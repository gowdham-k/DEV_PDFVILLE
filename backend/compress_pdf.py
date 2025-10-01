from restrictions import check_compress_pdf_restrictions, get_user
from flask import jsonify, send_file, request
import pikepdf
import traceback
from utils import create_temp_file
import os
from PIL import Image
import io
import math
import time
import fitz  # PyMuPDF
import subprocess
import shutil


def format_file_size(size_in_bytes):
    """Format file size in bytes to human-readable format"""
    if size_in_bytes < 1024:
        return f"{size_in_bytes} B"
    elif size_in_bytes < 1024 * 1024:
        return f"{size_in_bytes/1024:.2f} KB"
    elif size_in_bytes < 1024 * 1024 * 1024:
        return f"{size_in_bytes/(1024*1024):.2f} MB"
    else:
        return f"{size_in_bytes/(1024*1024*1024):.2f} GB"


def compress_pdf():
    try:
        start_time = time.time()
        # Handle both 'file' and 'files'
        files = request.files.getlist("files") or [request.files.get("file")]
        files = [f for f in files if f]  # Filter out None values
        
        if not files:
            return jsonify({"error": "No file provided"}), 400

        # Get compression level from request (default = medium)
        compression_level = request.form.get("compression_level", "medium").lower()

        # --- PREMIUM CHECK HERE ---
        email = request.form.get("email")
        
        # Create temporary files for restriction checking
        temp_files = []
        for file in files:
            temp_path = create_temp_file(".pdf")
            file.save(temp_path)
            temp_files.append(temp_path)
            
        # Check restrictions specific to compress_pdf
        restriction = check_compress_pdf_restrictions(email, temp_files, compression_level)
        if restriction:
            # Clean up temp files
            for temp_file in temp_files:
                if os.path.exists(temp_file):
                    os.remove(temp_file)
            # Handle new error format with upgrade button
            if isinstance(restriction, dict):
                return jsonify(restriction), 403
            else:
                # Backward compatibility for string errors
                return jsonify({"error": restriction}), 403
        
        # Get user status for premium features
        user = get_user(email)
        is_premium = user["is_premium_"]
        # --------------------------

        # Process each file (single file for free users, multiple for premium)
        results = []
        
        for file_index, file in enumerate(temp_files):
            # Temp output path for this file
            output_path = create_temp_file(".pdf")
            temp_path = create_temp_file(".pdf")  # For intermediate processing
            
            # File size before compression
            original_size = os.path.getsize(file)
            input_path = file

        # -------------------------------
        # MODE: LOSSLESS (metadata cleanup + stream compression)
        # -------------------------------
        if compression_level == "lossless":
            # First pass with pikepdf for metadata cleanup and basic compression
            with pikepdf.open(input_path) as pdf:
                # Clear metadata safely
                for key in list(pdf.docinfo.keys()):
                    del pdf.docinfo[key]

                if "/Metadata" in pdf.Root:
                    del pdf.Root.Metadata
                if pdf.Root.get("/Metadata") is not None:
                    del pdf.Root.Metadata
                pdf.remove_unreferenced_resources()
                pdf.save(temp_path, compress_streams=True, linearize=True)
            
            # Second pass with qpdf for additional lossless optimization
            qpdf_optimize(temp_path, output_path, compression_level="lossless")

        # -------------------------------
        # MODE: MEDIUM (image optimization + structure optimization)
        # -------------------------------
        elif compression_level == "medium":
            # First pass with PyMuPDF for image optimization
            pymupdf_optimize(input_path, temp_path, quality=90, resolution=170)
            
            # Copy the temp file to output path since we're missing this step
            shutil.copy2(temp_path, output_path)
            
        # -------------------------------
        # MODE: HIGH (premium only - maximum compression)
        # -------------------------------
        elif compression_level == "high" and is_premium:
            # High compression is premium only - uses more aggressive settings
            pymupdf_optimize(input_path, temp_path, quality=70, resolution=150, grayscale=False)
            
            # Second pass with pikepdf for additional optimization
            with pikepdf.open(temp_path) as pdf:
                # Clear metadata safely
                for key in list(pdf.docinfo.keys()):
                    del pdf.docinfo[key]

                if "/Metadata" in pdf.Root:
                    del pdf.Root.Metadata
                pdf.remove_unreferenced_resources()
                pdf.save(output_path, compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)

        # -------------------------------
        # MODE: HIGH (aggressive hybrid approach)
        # -------------------------------
        elif compression_level == "high":
            # First pass with PyMuPDF for aggressive image optimization
            pymupdf_optimize(input_path, temp_path, quality=20, resolution=90, grayscale=True)
            
            # Second pass with pikepdf for structure optimization
            with pikepdf.open(temp_path) as pdf:
                # Clear metadata safely
                for key in list(pdf.docinfo.keys()):
                    del pdf.docinfo[key]

                if "/Metadata" in pdf.Root:
                    del pdf.Root.Metadata
                if pdf.Root.get("/Metadata") is not None:
                    del pdf.Root.Metadata
                pdf.remove_unreferenced_resources()
                pdf.save(temp_path + ".opt", compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)
            
            # Final pass with qpdf for maximum compression
            qpdf_optimize(temp_path + ".opt", output_path, compression_level="high")
            
            # Clean up intermediate file
            if os.path.exists(temp_path + ".opt"):
                os.remove(temp_path + ".opt")

        else:
            return jsonify({"error": "Invalid compression level"}), 400

        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

        # File size after compression
            compressed_size = os.path.getsize(output_path)
            compression_ratio = (original_size - compressed_size) / original_size * 100
            
            # Format sizes for display
            original_size_formatted = format_file_size(original_size)
            compressed_size_formatted = format_file_size(compressed_size)
            
            # Add result for this file
            results.append({
                "success": True,
                "original_size": original_size,
                "compressed_size": compressed_size,
                "original_size_formatted": original_size_formatted,
                "compressed_size_formatted": compressed_size_formatted,
                "compression_ratio": round(compression_ratio, 2),
                "file_url": f"/download/{os.path.basename(output_path)}",
                "output_path": output_path,
                "filename": os.path.basename(file)
            })
            
            print(f"Compression results for file {file_index+1}/{len(temp_files)}: Original {original_size/1024:.2f}KB → "
                  f"Compressed {compressed_size/1024:.2f}KB "
                  f"({compression_ratio:.2f}% saved)")
        
        # Clean up temp input files
        for temp_file in temp_files:
            if os.path.exists(temp_file):
                os.remove(temp_file)
                
        processing_time = time.time() - start_time
        
        # Check if the request wants JSON response (for frontend display)
        if request.form.get("return_stats") == "true":
            return jsonify({
                "success": True,
                "files": results,
                "file_count": len(results),
                "processing_time": round(processing_time, 2),
                "compression_level": compression_level,
                "is_premium": is_premium
            })
        
        # Default behavior: return the file directly (for single file) or a zip for multiple files
        if len(results) == 1:
            return send_file(results[0]["output_path"], as_attachment=True, download_name="compressed.pdf")
        else:
            # For multiple files, create a zip file
            zip_path = create_temp_file(".zip")
            import zipfile
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for result in results:
                    zipf.write(result["output_path"], f"compressed_{result['filename']}")
            
            return send_file(zip_path, as_attachment=True, download_name="compressed_pdfs.zip")

    except Exception as e:
        print(f"Error in compress_pdf: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to compress PDF: {str(e)}"}), 500


# PyMuPDF-based optimization (replaces Ghostscript)
def pymupdf_optimize(input_path, output_path, quality=70, resolution=150, grayscale=False):
    """
    Optimize PDF using PyMuPDF (fitz)
    
    Args:
        input_path: Path to input PDF
        output_path: Path to save optimized PDF
        quality: JPEG quality for image compression (1-100)
        resolution: Target DPI for images
        grayscale: Whether to convert images to grayscale
    """
    try:
        # Open the PDF with PyMuPDF
        doc = fitz.open(input_path)
        
        # Create a new PDF for the optimized version
        new_doc = fitz.open()
        
        # Process each page
        for page_num in range(len(doc)):
            # Get the page
            page = doc[page_num]
            
            # Create a new page in the output document
            new_page = new_doc.new_page(width=page.rect.width, height=page.rect.height)
            
            # Extract images from the page
            image_list = page.get_images(full=True)
            
            # If no images, just copy the page content
            if not image_list:
                new_page.show_pdf_page(new_page.rect, doc, page_num)
                continue
            
            # Create a list to store optimized images
            optimized_images = []
            
            # Process each image
            for img_index, img_info in enumerate(image_list):
                xref = img_info[0]
                
                # Extract image
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                
                # Process with Pillow
                with io.BytesIO(image_bytes) as stream:
                    img = Image.open(stream)
                    img.load()
                    
                    # Get original size
                    original_width, original_height = img.size
                    
                    # Calculate new dimensions based on resolution
                    if base_image.get("dpi") and max(base_image["dpi"]) > resolution:
                        scale_factor = resolution / max(base_image["dpi"])
                        new_width = max(1, math.floor(original_width * scale_factor))
                        new_height = max(1, math.floor(original_height * scale_factor))
                        img = img.resize((new_width, new_height), Image.LANCZOS)
                    
                    # Convert to grayscale if requested
                    if grayscale and img.mode in ["RGB", "RGBA"]:
                        img = img.convert("L")
                    # Handle transparency
                    elif img.mode == "RGBA":
                        background = Image.new("RGB", img.size, (255, 255, 255))
                        background.paste(img, mask=img.split()[3])
                        img = background
                    
                    # Compress the image
                    with io.BytesIO() as output:
                        if img.mode in ["L", "RGB"]:
                            img.save(output, format="JPEG", quality=quality, optimize=True)
                        else:
                            img.save(output, format="PNG", optimize=True, compress_level=9)
                        
                        output.seek(0)
                        optimized_images.append((img_info, output.getvalue()))
            
            # Draw the page content without images
            new_page.show_pdf_page(new_page.rect, doc, page_num)
            
            # Replace images with optimized versions
            for img_info, opt_bytes in optimized_images:
                xref = img_info[0]
                doc.update_stream(xref, opt_bytes)
        
        # Save the optimized PDF
        new_doc.save(output_path, garbage=4, deflate=True, clean=True)
        
        # Close the documents
        doc.close()
        new_doc.close()
        
    except Exception as e:
        print(f"Error in pymupdf_optimize: {str(e)}")
        print(traceback.format_exc())
        raise


# QPDF-based optimization for final compression
def qpdf_optimize(input_path, output_path, compression_level="medium"):
    """
    Use QPDF for final optimization pass
    
    Args:
        input_path: Path to input PDF
        output_path: Path to output PDF
        compression_level: Compression level (lossless, medium, high)
    """
    try:
        # Check if qpdf is available
        qpdf_cmd = shutil.which("qpdf")
        
        if not qpdf_cmd:
            # Fallback to pikepdf if qpdf command-line is not available
            with pikepdf.open(input_path) as pdf:
                pdf.remove_unreferenced_resources()
                pdf.save(output_path, compress_streams=True, 
                         object_stream_mode=pikepdf.ObjectStreamMode.generate)
            return
        
        # Set compression options based on level
        if compression_level == "lossless":
            cmd = [
                qpdf_cmd, "--linearize", "--compress-streams=y", "--decode-level=specialized",
                "--object-streams=generate", input_path, output_path
            ]
        elif compression_level == "medium":
            cmd = [
                qpdf_cmd, "--linearize", "--compress-streams=y", "--decode-level=specialized",
                "--object-streams=generate", "--compression-level=9", input_path, output_path
            ]
        else:  # high
            cmd = [
                qpdf_cmd, "--linearize", "--compress-streams=y", "--decode-level=all",
                "--object-streams=generate", "--compression-level=9", "--recompress-flate",
                input_path, output_path
            ]
        
        # Run qpdf command
        subprocess.run(cmd, check=True)
        
    except Exception as e:
        print(f"Error in qpdf_optimize: {str(e)}")
        print(traceback.format_exc())
        
        # Fallback to pikepdf if qpdf fails
        with pikepdf.open(input_path) as pdf:
            pdf.remove_unreferenced_resources()
            pdf.save(output_path, compress_streams=True, 
                     object_stream_mode=pikepdf.ObjectStreamMode.generate)

def optimize_images_in_pdf(pdf, quality=80, downsample_factor=1.0, max_resolution=300):
    """Optimize images within the PDF for better compression
    
    Args:
        pdf: The pikepdf PDF object
        quality: JPEG compression quality (1-100)
        downsample_factor: Factor to reduce image dimensions (0.1-1.0)
        max_resolution: Maximum resolution in DPI to maintain
    """
    try:
        # Track total bytes saved for high compression level
        total_bytes_saved = 0
        high_compression = quality <= 30
        
        # Process each page in the PDF
        for page_num, page in enumerate(pdf.pages):
            print(f"Processing page {page_num+1}/{len(pdf.pages)}")
            
            # Process all images on the page
            for name, image in page.images.items():
                # Get the image data
                pdfimage = pikepdf.PdfImage(image)
                
                try:
                    # Get image details
                    bits_per_component = pdfimage.bits_per_component
                    color_space = pdfimage.colorspace
                    
                    # Skip already optimized small images - threshold varies by compression level
                    min_size_threshold = 5000 if quality < 50 else 10000 if quality < 80 else 20000
                    if len(pdfimage.read_bytes()) < min_size_threshold:
                        continue
                        
                    # Convert to PIL Image for processing
                    with io.BytesIO(pdfimage.read_bytes()) as stream:
                        img = Image.open(stream)
                        img.load()
                        
                        original_width, original_height = img.size
                        original_format = img.format
                        original_size = len(pdfimage.read_bytes())
                        
                        # For high compression, be more aggressive with resizing
                        if high_compression:
                            # Apply additional downsampling for high compression
                            downsample_factor *= 0.7
                            max_resolution = min(max_resolution, 72)  # Lower max resolution for high compression
                        
                        # Calculate new dimensions based on downsample factor
                        new_width = max(1, math.floor(original_width * downsample_factor))
                        new_height = max(1, math.floor(original_height * downsample_factor))
                        
                        # Limit resolution based on max_resolution
                        if pdfimage.dpi and max(pdfimage.dpi) > max_resolution:
                            scale_factor = max_resolution / max(pdfimage.dpi)
                            new_width = max(1, math.floor(original_width * scale_factor))
                            new_height = max(1, math.floor(original_height * scale_factor))
                        
                        # Only resize if dimensions have changed
                        if new_width < original_width or new_height < original_height:
                            img = img.resize((new_width, new_height), Image.LANCZOS)
                        
                        # Process based on image format and color mode
                        if img.mode in ["RGBA", "LA"]:
                            # Handle transparency by converting to RGB with white background
                            background = Image.new("RGB", img.size, (255, 255, 255))
                            background.paste(img, mask=img.split()[3])
                            img = background
                        elif img.mode == "P":  # Palette mode
                            img = img.convert("RGB")
                        
                        # Choose optimal format based on image characteristics and compression level
                        output_format = "JPEG"  # Default format
                        
                        # For high compression, force JPEG for most images
                        if high_compression and img.mode != "RGBA":
                            output_format = "JPEG"
                            # For text-heavy images, convert to grayscale to save space
                            if img.width > 300 and img.height > 300 and img.mode == "RGB":
                                # Convert to grayscale for high compression
                                img = img.convert("L")
                        # For grayscale images, use optimized settings
                        elif img.mode == "L":
                            output_format = "JPEG"
                            # For grayscale, we can use higher compression with less visible artifacts
                            # But respect the original quality setting more for high quality settings
                            if quality > 85 and not high_compression:
                                quality = min(quality + 5, 98)  # Small boost for high quality
                            else:
                                quality = min(quality + 10, 95)  # Larger boost for lower quality
                        
                        # For images with few colors, PNG might be better for high quality settings
                        if not high_compression and quality > 85 and original_format == "PNG" and len(img.getcolors(256)) is not None:
                            # Image has limited colors, PNG might be more efficient
                            output_format = "PNG"
                        
                        # Apply additional processing based on quality level
                        if quality < 60:
                            # For low quality, apply additional sharpening to compensate for compression artifacts
                            from PIL import ImageEnhance
                            enhancer = ImageEnhance.Sharpness(img)
                            img = enhancer.enhance(1.2)  # Slight sharpening
                        
                        # Optimize and compress the image
                        with io.BytesIO() as output:
                            if output_format == "JPEG":
                                # Adjust subsampling based on quality
                                subsampling = 0 if quality > 90 else 1 if quality > 70 else 2
                                # For high compression, always use maximum subsampling
                                if high_compression:
                                    subsampling = 2
                                img.save(output, format="JPEG", quality=quality, optimize=True,
                                         progressive=True, subsampling=subsampling)
                            else:  # PNG
                                # For high compression, reduce PNG color depth if possible
                                if high_compression and img.mode == 'RGB':
                                    try:
                                        # Try to quantize to fewer colors
                                        img = img.quantize(colors=256)
                                    except:
                                        pass
                                img.save(output, format="PNG", optimize=True, compress_level=9)
                                
                            output.seek(0)
                            output_bytes = output.getvalue()
                            
                            # Replace the image in the PDF if the new one is smaller
                            # For high quality, require more significant savings
                        # For low quality, be more aggressive with replacement
                        size_threshold = 0.95 if quality > 90 else 0.98 if quality > 80 else 1.1
                        # For high compression, always replace if smaller
                        if high_compression:
                            size_threshold = 1.2  # Be very aggressive with replacement
                            
                        bytes_saved = len(pdfimage.read_bytes()) - len(output_bytes)
                        if bytes_saved > 0:
                            total_bytes_saved += bytes_saved
                            
                        if len(output_bytes) < len(pdfimage.read_bytes()) * size_threshold:
                                if output_format == "JPEG":
                                    new_image = pikepdf.Stream(pdf, output_bytes)
                                    image.write(new_image, pikepdf.Name.DCTDecode)
                                else:  # PNG
                                    new_image = pikepdf.Stream(pdf, output_bytes)
                                    image.write(new_image, pikepdf.Name.FlateDecode)
                except Exception as img_error:
                    # Skip problematic images
                    print(f"Error processing image {name}: {str(img_error)}")
                    continue
        
        # For high compression, add a comment with bytes saved
        if high_compression:
            pdf.Root.PDFville_bytes_saved = total_bytes_saved
            
    except Exception as e:
        print(f"Error optimizing images: {str(e)}")
        # Continue with the rest of the compression even if image optimization fails
