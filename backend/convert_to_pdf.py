from flask import request, jsonify, send_file
import io, os, tempfile, traceback
import shutil
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import fitz  # PyMuPDF
from restrictions import check_convert_pdf_restrictions

def convert_to_pdf():
    """
    Convert various file formats to PDF
    Supported formats: JPG, PNG, JPEG, BMP, TIFF, TXT
    """
    try:
        uploaded_file = request.files.get("file")
        if not uploaded_file:
            return jsonify({"error": "No file provided"}), 400

        # Get the file extension
        filename = uploaded_file.filename
        file_ext = os.path.splitext(filename)[1].lower()
        
        # Create a temporary directory to work with
        temp_dir = tempfile.mkdtemp()
        temp_input_path = os.path.join(temp_dir, "input" + file_ext)
        output_path = os.path.join(temp_dir, "output.pdf")
        
        # Save the uploaded file to a temporary location
        uploaded_file.save(temp_input_path)
        
        # Check restrictions for PDF files
        email = request.form.get("email") or request.form.get("user_email") or "anonymous@example.com"
        print(f"[DEBUG] /convert-to-pdf email={email}")
        restriction_error = check_convert_pdf_restrictions(email, [temp_input_path])
        if restriction_error:
            print(f"[DEBUG] /convert-to-pdf restriction: {restriction_error}")
            return jsonify(restriction_error), 403
        
        # Process based on file type
        if file_ext in [".jpg", ".jpeg", ".png", ".bmp", ".tiff"]:
            # Image to PDF conversion
            return convert_image_to_pdf(uploaded_file, output_path)
        elif file_ext == ".txt":
            # Text to PDF conversion
            return convert_text_to_pdf(uploaded_file, output_path)
        elif file_ext in [".doc", ".docx"]:
            # Word to PDF conversion (requires additional libraries)
            return jsonify({"error": "Word to PDF conversion not supported yet"}), 501
        else:
            return jsonify({"error": f"Unsupported file format: {file_ext}"}), 400

    except Exception as e:
        print("🔥 ERROR in convert_to_pdf function:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

def convert_image_to_pdf(uploaded_file, output_path):
    """
    Convert an image file to PDF
    """
    try:
        # Read the image file
        image_data = uploaded_file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary (for RGBA images)
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        
        # Save as PDF
        image.save(output_path, "PDF")
        
        return send_file(output_path, as_attachment=True, download_name="converted.pdf")
    
    except Exception as e:
        print("🔥 ERROR in convert_image_to_pdf function:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

def convert_text_to_pdf(uploaded_file, output_path):
    """
    Convert a text file to PDF
    """
    try:
        # Read the text file
        text_data = uploaded_file.read().decode('utf-8')
        
        # Create a PDF with the text content
        c = canvas.Canvas(output_path, pagesize=letter)
        width, height = letter
        
        # Split text into lines and add to PDF
        y_position = height - 50  # Start from top with margin
        for line in text_data.split('\n'):
            if y_position < 50:  # Add a new page if we're at the bottom
                c.showPage()
                y_position = height - 50
            
            c.drawString(50, y_position, line)
            y_position -= 15  # Line spacing
        
        c.save()
        
        return send_file(output_path, as_attachment=True, download_name="converted.pdf")
    
    except Exception as e:
        print("🔥 ERROR in convert_text_to_pdf function:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500