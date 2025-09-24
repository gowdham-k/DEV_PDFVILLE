import os
import tempfile
import zipfile
from flask import request, jsonify, send_file
from PyPDF2 import PdfReader, PdfWriter
from PyPDF2.errors import PdfReadError, PdfReadWarning
import io
from werkzeug.utils import secure_filename
import pikepdf
import warnings
import logging

# Suppress PyPDF2 warnings for cleaner output
warnings.filterwarnings("ignore", category=PdfReadWarning)
logging.getLogger("PyPDF2").setLevel(logging.ERROR)

def repair_with_pypdf2(file_content, preserve_bookmarks=True, preserve_metadata=True):
    """
    Attempt to repair PDF using PyPDF2 (basic repair)
    """
    try:
        input_pdf = PdfReader(io.BytesIO(file_content), strict=False)
        output_pdf = PdfWriter()
        
        # Copy pages
        for page_num in range(len(input_pdf.pages)):
            try:
                page = input_pdf.pages[page_num]
                output_pdf.add_page(page)
            except Exception as e:
                print(f"    ⚠️ Warning: Could not copy page {page_num + 1}: {str(e)}")
                continue
        
        # Preserve metadata if requested
        if preserve_metadata and input_pdf.metadata:
            try:
                output_pdf.add_metadata(input_pdf.metadata)
            except Exception as e:
                print(f"    ⚠️ Warning: Could not preserve metadata: {str(e)}")
        
        # Preserve bookmarks if requested
        if preserve_bookmarks:
            try:
                # PyPDF2 doesn't have direct bookmark copying, but we'll try to preserve outline
                if hasattr(input_pdf, 'outline') and input_pdf.outline:
                    # This is a simplified approach - full bookmark preservation is complex
                    pass
            except Exception as e:
                print(f"    ⚠️ Warning: Could not preserve bookmarks: {str(e)}")
        
        # Write to bytes
        output_buffer = io.BytesIO()
        output_pdf.write(output_buffer)
        output_buffer.seek(0)
        
        return output_buffer.getvalue(), "pypdf2"
        
    except Exception as e:
        raise Exception(f"PyPDF2 repair failed: {str(e)}")

def repair_with_pikepdf(file_content, preserve_bookmarks=True, preserve_metadata=True):
    """
    Attempt to repair PDF using pikepdf (advanced repair)
    """
    try:
        # Create temporary file for pikepdf
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_input:
            temp_input.write(file_content)
            temp_input_path = temp_input.name
        
        try:
            # Open with pikepdf - it has better repair capabilities
            pdf = pikepdf.open(temp_input_path, allow_overwriting_input=True)
            
            # Save to buffer
            output_buffer = io.BytesIO()
            pdf.save(output_buffer, 
                    fix_metadata_version=True,
                    sanitize=True,
                    linearize=False)
            
            pdf.close()
            output_buffer.seek(0)
            
            return output_buffer.getvalue(), "pikepdf"
            
        finally:
            # Clean up temp file
            try:
                os.unlink(temp_input_path)
            except:
                pass
                
    except Exception as e:
        raise Exception(f"pikepdf repair failed: {str(e)}")

def repair_minimal(file_content):
    """
    Minimal repair - just try to read and rewrite
    """
    try:
        input_pdf = PdfReader(io.BytesIO(file_content), strict=False)
        output_pdf = PdfWriter()
        
        # Just copy pages without extra processing
        for page in input_pdf.pages:
            output_pdf.add_page(page)
        
        output_buffer = io.BytesIO()
        output_pdf.write(output_buffer)
        output_buffer.seek(0)
        
        return output_buffer.getvalue(), "minimal"
        
    except Exception as e:
        raise Exception(f"Minimal repair failed: {str(e)}")

def repair_deep_scan(file_content, preserve_bookmarks=True, preserve_metadata=True):
    """
    Deep scan repair - try multiple methods
    """
    methods = [
        ("pikepdf", lambda: repair_with_pikepdf(file_content, preserve_bookmarks, preserve_metadata)),
        ("pypdf2", lambda: repair_with_pypdf2(file_content, preserve_bookmarks, preserve_metadata)),
        ("minimal", lambda: repair_minimal(file_content))
    ]
    
    last_error = None
    
    for method_name, repair_func in methods:
        try:
            print(f"    🔧 Trying {method_name} repair method...")
            result = repair_func()
            print(f"    ✅ Success with {method_name}")
            return result
        except Exception as e:
            print(f"    ❌ {method_name} failed: {str(e)}")
            last_error = e
            continue
    
    raise Exception(f"All repair methods failed. Last error: {str(last_error)}")

def repair_pdf_file(file_content, filename, repair_mode="auto", preserve_bookmarks=True, preserve_metadata=True):
    """
    Repair a single PDF file based on the specified mode
    """
    print(f"    🔧 Repair mode: {repair_mode}")
    
    try:
        if repair_mode == "minimal":
            repaired_content, method = repair_minimal(file_content)
        elif repair_mode == "rebuild":
            repaired_content, method = repair_with_pikepdf(file_content, preserve_bookmarks, preserve_metadata)
        elif repair_mode == "deep":
            repaired_content, method = repair_deep_scan(file_content, preserve_bookmarks, preserve_metadata)
        else:  # auto mode
            # Try pikepdf first, fall back to PyPDF2
            try:
                repaired_content, method = repair_with_pikepdf(file_content, preserve_bookmarks, preserve_metadata)
            except Exception:
                repaired_content, method = repair_with_pypdf2(file_content, preserve_bookmarks, preserve_metadata)
        
        print(f"    ✅ Repaired using {method} method")
        return repaired_content
        
    except Exception as e:
        print(f"    ❌ Repair failed: {str(e)}")
        raise

def repair_pdf():
    """
    Repair corrupted or damaged PDF files
    
    Expected form data:
    - files: PDF files to repair
    - repair_mode: "auto", "rebuild", "minimal", or "deep"
    - preserve_bookmarks: "true" or "false"
    - preserve_metadata: "true" or "false"
    """
    
    print("\n" + "="*50)
    print("🔧 PDF REPAIR REQUEST")
    print("="*50)
    
    try:
        # Get uploaded files
        uploaded_files = request.files.getlist('files')
        if not uploaded_files or all(not file.filename for file in uploaded_files):
            print("❌ No files uploaded")
            return jsonify({"error": "No PDF files provided"}), 400

        # Get repair parameters
        repair_mode = request.form.get('repair_mode', 'auto')
        preserve_bookmarks = request.form.get('preserve_bookmarks', 'true').lower() == 'true'
        preserve_metadata = request.form.get('preserve_metadata', 'true').lower() == 'true'
        
        print(f"📝 Files to repair: {len(uploaded_files)}")
        print(f"🔧 Repair mode: {repair_mode}")
        print(f"🔖 Preserve bookmarks: {preserve_bookmarks}")
        print(f"📊 Preserve metadata: {preserve_metadata}")
        
        # Validate repair mode
        valid_modes = ["auto", "rebuild", "minimal", "deep"]
        if repair_mode not in valid_modes:
            return jsonify({"error": f"Invalid repair mode. Must be one of: {valid_modes}"}), 400

        # Create temporary directory for processing
        temp_dir = tempfile.mkdtemp()
        processed_files = []
        repair_summary = []

        try:
            for file_index, file in enumerate(uploaded_files):
                if not file or not file.filename:
                    continue
                    
                filename = secure_filename(file.filename)
                if not filename.lower().endswith('.pdf'):
                    print(f"⚠️ Skipping non-PDF file: {filename}")
                    continue

                print(f"\n🔧 Processing: {filename}")
                
                try:
                    # Read the PDF
                    file_content = file.read()
                    original_size = len(file_content)
                    print(f"📊 Original size: {original_size:,} bytes")
                    
                    # Attempt repair
                    repaired_content = repair_pdf_file(
                        file_content, 
                        filename, 
                        repair_mode,
                        preserve_bookmarks,
                        preserve_metadata
                    )
                    
                    repaired_size = len(repaired_content)
                    print(f"📊 Repaired size: {repaired_size:,} bytes")
                    
                    # Save the repaired PDF
                    output_filename = f"repaired_{filename}"
                    output_path = os.path.join(temp_dir, output_filename)
                    
                    with open(output_path, 'wb') as output_file:
                        output_file.write(repaired_content)
                    
                    processed_files.append({
                        'path': output_path,
                        'filename': output_filename,
                        'original_name': filename
                    })
                    
                    repair_summary.append({
                        'filename': filename,
                        'status': 'success',
                        'original_size': original_size,
                        'repaired_size': repaired_size
                    })
                    
                    print(f"💾 Saved: {output_filename}")
                    
                except Exception as e:
                    error_msg = str(e)
                    print(f"❌ Failed to repair {filename}: {error_msg}")
                    
                    repair_summary.append({
                        'filename': filename,
                        'status': 'failed',
                        'error': error_msg
                    })
                    
                    # Continue processing other files
                    continue

            if not processed_files:
                print("❌ No files could be repaired")
                failed_files = [item for item in repair_summary if item['status'] == 'failed']
                error_details = "; ".join([f"{item['filename']}: {item.get('error', 'Unknown error')}" for item in failed_files])
                return jsonify({"error": f"No files could be repaired. Details: {error_details}"}), 400

            # Print repair summary
            print(f"\n📋 REPAIR SUMMARY:")
            print(f"✅ Successfully repaired: {len(processed_files)}")
            print(f"❌ Failed to repair: {len([item for item in repair_summary if item['status'] == 'failed'])}")

            # If single file, return it directly
            if len(processed_files) == 1:
                print(f"\n📤 Sending single repaired file: {processed_files[0]['filename']}")
                return send_file(
                    processed_files[0]['path'],
                    as_attachment=True,
                    download_name=processed_files[0]['filename'],
                    mimetype='application/pdf'
                )
            
            # If multiple files, create ZIP
            print(f"\n📦 Creating ZIP with {len(processed_files)} repaired files")
            zip_path = os.path.join(temp_dir, 'repaired_pdfs.zip')
            
            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                for file_info in processed_files:
                    zipf.write(file_info['path'], file_info['filename'])
                    print(f"  📁 Added to ZIP: {file_info['filename']}")
                
                # Add repair summary as text file
                summary_content = "PDF Repair Summary\n" + "="*30 + "\n\n"
                for item in repair_summary:
                    summary_content += f"File: {item['filename']}\n"
                    summary_content += f"Status: {item['status']}\n"
                    if item['status'] == 'success':
                        summary_content += f"Original size: {item['original_size']:,} bytes\n"
                        summary_content += f"Repaired size: {item['repaired_size']:,} bytes\n"
                    else:
                        summary_content += f"Error: {item.get('error', 'Unknown error')}\n"
                    summary_content += "\n"
                
                # Add summary to ZIP
                zipf.writestr('repair_summary.txt', summary_content)
                print("  📄 Added repair summary to ZIP")
            
            print("📤 Sending ZIP file")
            return send_file(
                zip_path,
                as_attachment=True,
                download_name='repaired_pdfs.zip',
                mimetype='application/zip'
            )

        except Exception as e:
            print(f"❌ Processing error: {str(e)}")
            return jsonify({"error": f"Error processing PDFs: {str(e)}"}), 500
            
        finally:
            # Clean up temporary files
            try:
                import shutil
                shutil.rmtree(temp_dir)
                print("🧹 Cleaned up temporary files")
            except Exception as e:
                print(f"⚠️ Cleanup warning: {str(e)}")

    except Exception as e:
        print(f"❌ Request error: {str(e)}")
        return jsonify({"error": f"Request processing failed: {str(e)}"}), 500
    
    finally:
        print("="*50)
        print("🏁 PDF REPAIR REQUEST COMPLETED")
        print("="*50 + "\n")

# Alternative function name for compatibility
def repair_pdf_handler():
    """Alternative handler name for compatibility"""
    return repair_pdf()

# If this file is imported, ensure the function is available
__all__ = ['repair_pdf', 'repair_pdf_handler', 'repair_pdf_file']