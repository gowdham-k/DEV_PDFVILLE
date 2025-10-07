from flask import request, send_file, jsonify
import os
import tempfile
import zipfile
from io import BytesIO
import logging
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import Color
from reportlab.lib.utils import ImageReader
from restrictions import check_restrictions, check_add_watermark_restrictions
from PyPDF2 import PdfWriter, PdfReader
import colorsys
from restrictions import check_add_watermark_restrictions

# Configure logging
logger = logging.getLogger(__name__)

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple (0-1 range)."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))

def create_watermark_pdf(text, width, height, opacity=0.3, rotation=45, 
                        color="#FF0000", font_size=48, position="center"):
    """Create a watermark PDF overlay."""
    # Create a temporary file for the watermark
    watermark_buffer = BytesIO()
    
    # Create canvas for watermark
    c = canvas.Canvas(watermark_buffer, pagesize=(width, height))
    
    # Set transparency
    c.setFillAlpha(opacity)
    
    # Convert hex color to RGB
    rgb_color = hex_to_rgb(color)
    c.setFillColorRGB(*rgb_color)
    
    # Set font
    try:
        c.setFont("Helvetica-Bold", font_size)
    except:
        # Fallback to default font if Helvetica-Bold is not available
        c.setFont("Helvetica", font_size)
    
    # Calculate text dimensions
    text_width = c.stringWidth(text, "Helvetica-Bold", font_size)
    text_height = font_size
    
    # Calculate position based on setting
    if position == "center":
        x = (width - text_width) / 2
        y = (height - text_height) / 2
    elif position == "top-left":
        x = 50
        y = height - text_height - 50
    elif position == "top-right":
        x = width - text_width - 50
        y = height - text_height - 50
    elif position == "bottom-left":
        x = 50
        y = 50
    elif position == "bottom-right":
        x = width - text_width - 50
        y = 50
    else:  # default to center
        x = (width - text_width) / 2
        y = (height - text_height) / 2
    
    # Save current state
    c.saveState()
    
    # Move to position and rotate
    c.translate(x + text_width/2, y + text_height/2)
    c.rotate(rotation)
    c.translate(-text_width/2, -text_height/2)
    
    # Draw text
    c.drawString(0, 0, text)
    
    # Restore state
    c.restoreState()
    
    # Save the canvas
    c.save()
    
    watermark_buffer.seek(0)
    return watermark_buffer

def add_watermark_to_pdf(input_pdf_path, watermark_text, opacity=0.3, 
                        rotation=45, color="#FF0000", font_size=48, position="center"):
    """Add watermark to a PDF file."""
    try:
        # Read the input PDF
        with open(input_pdf_path, 'rb') as file:
            reader = PdfReader(file)
            writer = PdfWriter()
            
            # Process each page
            for page_num, page in enumerate(reader.pages):
                # Get page dimensions
                page_rect = page.mediabox
                page_width = float(page_rect[2] - page_rect[0])
                page_height = float(page_rect[3] - page_rect[1])
                
                # Create watermark for this page
                watermark_buffer = create_watermark_pdf(
                    watermark_text, page_width, page_height, 
                    opacity, rotation, color, font_size, position
                )
                
                # Read watermark PDF
                watermark_reader = PdfReader(watermark_buffer)
                watermark_page = watermark_reader.pages[0]
                
                # Merge watermark with original page
                page.merge_page(watermark_page)
                writer.add_page(page)
            
            # Create output buffer
            output_buffer = BytesIO()
            writer.write(output_buffer)
            output_buffer.seek(0)
            
            return output_buffer
            
    except Exception as e:
        logger.error(f"Error adding watermark to PDF: {str(e)}")
        raise e

def add_watermark():
    """Add watermark to PDF files - main function for Flask route"""
    try:
        email = request.form.get("email", "free@example.com")
        # Get uploaded files
        files = request.files.getlist('files') or request.files.getlist('file')
        if not files or all(f.filename == '' for f in files):
            return jsonify({'error': 'No files uploaded'}), 400

        with tempfile.TemporaryDirectory() as temp_dir:
            temp_file_paths = []
            for file in files:
                temp_path = os.path.join(temp_dir, file.filename)
                file.save(temp_path)
                temp_file_paths.append(temp_path)

            # Apply premium restrictions check
            restriction_result = check_add_watermark_restrictions(email, temp_file_paths)
            if restriction_result:
                return jsonify(restriction_result), 403

        # Get watermark settings
        watermark_text = request.form.get('watermark_text', 'CONFIDENTIAL')
        opacity = float(request.form.get('opacity', 0.3))
        position = request.form.get('position', 'center')
        rotation = int(request.form.get('rotation', 45))
        color = request.form.get('color', '#FF0000')
        font_size = int(request.form.get('font_size', 48))

        if not watermark_text.strip():
            return jsonify({'error': 'Watermark text is required'}), 400

        # Validate PDFs
        pdf_files = [f for f in files if f.filename.lower().endswith('.pdf')]
        if not pdf_files:
            return jsonify({'error': 'No valid PDF files found'}), 400

        print(f"📊 Processing {len(pdf_files)} PDF file(s)")

        processed_files = []

        # Process each file completely in memory
        for i, file in enumerate(pdf_files):
            print(f"🔄 Processing {i+1}/{len(pdf_files)}: {file.filename}")

            # Save input file temporarily to process
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_input:
                file.seek(0)
                file.save(temp_input.name)
                temp_input_path = temp_input.name

            try:
                # Apply watermark → get BytesIO
                watermarked_buffer = add_watermark_to_pdf(
                    temp_input_path, watermark_text, opacity,
                    rotation, color, font_size, position
                )

                # Append result to list
                processed_files.append((watermarked_buffer, f"watermarked_{file.filename}"))

            finally:
                os.remove(temp_input_path)  # cleanup temp input

        # ✅ If only one file, return directly from memory
        if len(processed_files) == 1:
            buf, filename = processed_files[0]
            return send_file(
                buf,
                as_attachment=True,
                download_name=filename,
                mimetype="application/pdf"
            )

        # 📦 If multiple files → zip in memory
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for buf, filename in processed_files:
                zip_file.writestr(filename, buf.getvalue())
        zip_buffer.seek(0)

        return send_file(
            zip_buffer,
            as_attachment=True,
            download_name="watermarked_pdfs.zip",
            mimetype="application/zip"
        )

    except Exception as e:
        logger.error(f"Unexpected error in add_watermark: {str(e)}")
        return jsonify({'error': 'Internal server error occurred'}), 500