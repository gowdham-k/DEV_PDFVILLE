from flask import request, jsonify, send_file
import io, os, tempfile, traceback
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import zipfile
from restrictions import check_convert_pdf_restrictions

def convert_png_to_pdf():
    """
    Convert PNG images to PDF
    Supports multiple files
    """
    try:
        # Check if files were uploaded
        if 'files[]' in request.files:
            files = request.files.getlist('files[]')
        elif 'files' in request.files:
            # Check if 'files' is a list or a single file
            files_list = request.files.getlist('files')
            if files_list and len(files_list) > 0:
                files = files_list
            else:
                # Try to get it as a single file
                files = [request.files['files']]
        elif 'file' in request.files:
            files = [request.files['file']]
        else:
            return jsonify({"error": "No files provided"}), 400
        
        if not files or len(files) == 0:
            return jsonify({"error": "No files provided"}), 400
        
        # Check if all files are PNG
        for file in files:
            filename = file.filename
            if not filename.lower().endswith('.png'):
                return jsonify({"error": f"File {filename} is not a PNG image"}), 400
        
        # Create a temporary directory to work with
        temp_dir = tempfile.mkdtemp()
        
        # Save files temporarily for restriction check
        temp_file_paths = []
        for i, file in enumerate(files):
            temp_path = os.path.join(temp_dir, f"input_{i}.png")
            file.save(temp_path)
            temp_file_paths.append(temp_path)
        
        # Check restrictions
        email = request.form.get("email") or request.form.get("user_email") or "anonymous@example.com"
        print(f"[DEBUG] /convert-png-to-pdf email={email}")
        restriction_error = check_convert_pdf_restrictions(email, temp_file_paths)
        if restriction_error:
            print(f"[DEBUG] /convert-png-to-pdf restriction: {restriction_error}")
            return jsonify(restriction_error), 403
        
        # Process single file or multiple files differently
        if len(files) == 1:
            # Single file conversion - use the already saved temp file
            output_path = os.path.join(temp_dir, "output.pdf")
            image = Image.open(temp_file_paths[0])
            
            # Convert to RGB if necessary (for RGBA images)
            if image.mode == 'RGBA':
                image = image.convert('RGB')
            
            # Save as PDF
            image.save(output_path, "PDF")
            
            return send_file(output_path, as_attachment=True, download_name="converted.pdf")
        else:
            # Multiple files - create individual PDFs and zip them
            zip_path = os.path.join(temp_dir, "converted_pdfs.zip")
            
            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for i, temp_path in enumerate(temp_file_paths):
                    # Create PDF for each image
                    pdf_filename = f"image_{i+1}.pdf"
                    pdf_path = os.path.join(temp_dir, pdf_filename)
                    
                    image = Image.open(temp_path)
                    if image.mode == 'RGBA':
                        image = image.convert('RGB')
                    
                    image.save(pdf_path, "PDF")
                    zipf.write(pdf_path, pdf_filename)
            
            return send_file(zip_path, as_attachment=True, download_name="converted_pdfs.zip")
    
    except Exception as e:
        print("🔥 ERROR in convert_png_to_pdf function:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500