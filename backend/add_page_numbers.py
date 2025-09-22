from flask import request, send_file, jsonify
import os
import tempfile
import zipfile
from io import BytesIO
import logging
from PyPDF2 import PdfWriter, PdfReader
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import Color
import colorsys

# Configure logging
logger = logging.getLogger(__name__)

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_page_number_overlay(page_width, page_height, page_num, total_pages, 
                             position="bottom-center", font_size=12, color="#000000"):
    """Create a PDF overlay with page number."""
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=(page_width, page_height))
    
    # Convert hex color to RGB
    r, g, b = hex_to_rgb(color)
    c.setFillColorRGB(r/255, g/255, b/255)
    
    # Set font and size
    c.setFont("Helvetica", font_size)
    
    # Format text
    text = f"Page {page_num} of {total_pages}"
    text_width = c.stringWidth(text, "Helvetica", font_size)
    
    # Position the text based on the selected position
    margin = 36  # 0.5 inch margin
    
    if position == "bottom-center":
        x = (page_width - text_width) / 2
        y = margin
    elif position == "bottom-left":
        x = margin
        y = margin
    elif position == "bottom-right":
        x = page_width - text_width - margin
        y = margin
    elif position == "top-center":
        x = (page_width - text_width) / 2
        y = page_height - margin
    elif position == "top-left":
        x = margin
        y = page_height - margin
    elif position == "top-right":
        x = page_width - text_width - margin
        y = page_height - margin
    else:  # Default to bottom-center
        x = (page_width - text_width) / 2
        y = margin
    
    c.drawString(x, y, text)
    c.save()
    
    buffer.seek(0)
    return buffer

def add_page_numbers_to_pdf(input_pdf_path, position="bottom-center", 
                          start_number=1, font_size=12, color="#000000"):
    """Add page numbers to a PDF file."""
    try:
        # Read the input PDF
        with open(input_pdf_path, 'rb') as file:
            reader = PdfReader(file)
            writer = PdfWriter()
            
            total_pages = len(reader.pages)
            
            # Process each page
            for page_idx, page in enumerate(reader.pages):
                # Get page dimensions
                page_rect = page.mediabox
                page_width = float(page_rect[2] - page_rect[0])
                page_height = float(page_rect[3] - page_rect[1])
                
                # Current page number (adjusted by start_number)
                current_page_num = page_idx + start_number
                
                # Create page number overlay for this page
                overlay_buffer = create_page_number_overlay(
                    page_width, page_height, 
                    current_page_num, total_pages,
                    position, font_size, color
                )
                
                # Read overlay PDF
                overlay_reader = PdfReader(overlay_buffer)
                overlay_page = overlay_reader.pages[0]
                
                # Merge overlay with original page
                page.merge_page(overlay_page)
                writer.add_page(page)
            
            # Create output buffer
            output_buffer = BytesIO()
            writer.write(output_buffer)
            output_buffer.seek(0)
            
            return output_buffer
            
    except Exception as e:
        logger.error(f"Error adding page numbers to PDF: {str(e)}")
        raise e

def add_page_numbers_route():
    """Add page numbers to PDF files - main function for Flask route"""
    try:
        print("\n📋 Starting add_page_numbers_route function")
        print("✅ No restrictions applied to page numbering feature")

        # Get uploaded files
        files = request.files.getlist('files') or request.files.getlist('file')
        if not files or all(f.filename == '' for f in files):
            return jsonify({'error': 'No files uploaded'}), 400

        # Get page numbering settings
        position = request.form.get('position', 'bottom-center')
        start_number = int(request.form.get('start_number', 1))
        font_size = int(request.form.get('font_size', 12))
        color = request.form.get('color', '#000000')

        # Validate settings
        if start_number < 1:
            return jsonify({'error': 'Start number must be at least 1'}), 400

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
                file.save(temp_input.name)
                temp_input_path = temp_input.name

            try:
                # Apply page numbers → get BytesIO
                numbered_buffer = add_page_numbers_to_pdf(
                    temp_input_path, position,
                    start_number, font_size, color
                )

                # Append result to list
                processed_files.append((numbered_buffer, f"numbered_{file.filename}"))

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
            download_name="numbered_pdfs.zip",
            mimetype="application/zip"
        )

    except Exception as e:
        logger.error(f"Unexpected error in add_page_numbers: {str(e)}")
        return jsonify({'error': 'Internal server error occurred'}), 500