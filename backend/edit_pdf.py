import os
import tempfile
import zipfile
from flask import request, jsonify, send_file
from PyPDF2 import PdfWriter, PdfReader
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.units import inch
import io
from PIL import Image
import fitz  # PyMuPDF for better PDF handling

from flask import Blueprint, request, jsonify, send_file
import os
import json
import fitz  # PyMuPDF
import tempfile
from werkzeug.utils import secure_filename
from utils import get_upload_folder, get_temp_folder, allowed_file, get_file_extension
import uuid
from restrictions import check_edit_pdf_restrictions

edit_pdf_bp = Blueprint('edit_pdf', __name__)

@edit_pdf_bp.route('/api/edit_pdf', methods=['POST'])
def edit_pdf():
    """
    Edit PDF with various operations (add text, shapes, images, delete/rotate/reorder pages)
    """
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
            
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
            
        if not file or not allowed_file(file.filename, ['pdf']):
            return jsonify({"error": "Invalid file format. Only PDF files are allowed."}), 400
        
        # Get operations from request
        operations_json = request.form.get('operations', '[]')
        operations = json.loads(operations_json)
        
        # Get user email from request
        email = request.form.get('email', '')
        
        # Check restrictions for edit PDF
        restriction_check = check_edit_pdf_restrictions(email, [], operations)
        if restriction_check:
            return jsonify(restriction_check), 403
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        upload_folder = get_upload_folder()
        temp_folder = get_temp_folder()
        
        # Create a unique filename to avoid conflicts
        unique_id = str(uuid.uuid4())
        input_path = os.path.join(upload_folder, f"{unique_id}_{filename}")
        output_filename = f"edited_{unique_id}_{filename}"
        output_path = os.path.join(temp_folder, output_filename)
        
        file.save(input_path)
        
        # Process the PDF with the requested operations
        success = process_pdf_edits(input_path, output_path, operations)
        
        if not success:
            return jsonify({"error": "Failed to process PDF edits"}), 500
        
        # Return the edited PDF file
        return send_file(
            output_path,
            as_attachment=True,
            download_name=f"edited_{filename}",
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def process_pdf_edits(input_path, output_path, operations):
    """Process PDF with edit operations"""
    try:
        # Use PyMuPDF for better editing capabilities
        pdf_doc = fitz.open(input_path)
        
        for operation in operations:
            op_type = operation.get('type')
            
            if op_type == 'add_text':
                add_text_to_pdf(pdf_doc, operation)
            elif op_type == 'add_shape':
                add_shape_to_pdf(pdf_doc, operation)
            elif op_type == 'add_image':
                add_image_to_pdf(pdf_doc, operation)
            elif op_type == 'delete_page':
                delete_page_from_pdf(pdf_doc, operation)
            elif op_type == 'rotate_page':
                rotate_page_in_pdf(pdf_doc, operation)
            elif op_type == 'reorder_pages':
                reorder_pdf_pages(pdf_doc, operation)
        
        # Save the modified PDF
        pdf_doc.save(output_path)
        pdf_doc.close()
        
        return True
        
    except Exception as e:
        print(f"❌ Error processing PDF edits: {str(e)}")
        return False

def add_text_to_pdf(pdf_doc, operation):
    """Add text to PDF at specified position"""
    try:
        page_num = operation.get('page', 0)
        text = operation.get('text', '')
        x = float(operation.get('x', 100))
        y = float(operation.get('y', 100))
        font_size = int(operation.get('font_size', 12))
        color = operation.get('color', '#000000')
        
        if page_num < len(pdf_doc):
            page = pdf_doc[page_num]
            
            # Convert hex color to RGB
            color_rgb = hex_to_rgb(color)
            
            # Add text
            text_dict = {
                "text": text,
                "fontsize": font_size,
                "color": color_rgb
            }
            
            point = fitz.Point(x, y)
            page.insert_text(point, text, fontsize=font_size, color=color_rgb)
            
    except Exception as e:
        print(f"❌ Error adding text: {str(e)}")

def add_shape_to_pdf(pdf_doc, operation):
    """Add shapes (rectangle, circle) to PDF"""
    try:
        page_num = operation.get('page', 0)
        shape_type = operation.get('shape', 'rectangle')
        x = float(operation.get('x', 100))
        y = float(operation.get('y', 100))
        width = float(operation.get('width', 100))
        height = float(operation.get('height', 100))
        color = operation.get('color', '#000000')
        fill = operation.get('fill', False)
        
        if page_num < len(pdf_doc):
            page = pdf_doc[page_num]
            color_rgb = hex_to_rgb(color)
            
            if shape_type == 'rectangle':
                rect = fitz.Rect(x, y, x + width, y + height)
                if fill:
                    page.draw_rect(rect, color=color_rgb, fill=color_rgb)
                else:
                    page.draw_rect(rect, color=color_rgb, width=2)
                    
            elif shape_type == 'circle':
                center = fitz.Point(x + width/2, y + height/2)
                radius = min(width, height) / 2
                if fill:
                    page.draw_circle(center, radius, color=color_rgb, fill=color_rgb)
                else:
                    page.draw_circle(center, radius, color=color_rgb, width=2)
            
    except Exception as e:
        print(f"❌ Error adding shape: {str(e)}")

def add_image_to_pdf(pdf_doc, operation):
    """Add image to PDF (placeholder - would need image upload handling)"""
    try:
        # This would require additional image handling
        # For now, just add a placeholder rectangle
        page_num = operation.get('page', 0)
        x = float(operation.get('x', 100))
        y = float(operation.get('y', 100))
        width = float(operation.get('width', 100))
        height = float(operation.get('height', 100))
        
        if page_num < len(pdf_doc):
            page = pdf_doc[page_num]
            rect = fitz.Rect(x, y, x + width, y + height)
            page.draw_rect(rect, color=(0.8, 0.8, 0.8), fill=(0.9, 0.9, 0.9))
            
            # Add placeholder text
            center = fitz.Point(x + width/2 - 20, y + height/2)
            page.insert_text(center, "IMAGE", fontsize=10, color=(0, 0, 0))
            
    except Exception as e:
        print(f"❌ Error adding image: {str(e)}")

def delete_page_from_pdf(pdf_doc, operation):
    """Delete page from PDF"""
    try:
        page_num = operation.get('page', 0)
        if 0 <= page_num < len(pdf_doc):
            pdf_doc.delete_page(page_num)
            
    except Exception as e:
        print(f"❌ Error deleting page: {str(e)}")

def rotate_page_in_pdf(pdf_doc, operation):
    """Rotate page in PDF"""
    try:
        page_num = operation.get('page', 0)
        rotation = int(operation.get('rotation', 90))
        
        if 0 <= page_num < len(pdf_doc):
            page = pdf_doc[page_num]
            page.set_rotation(rotation)
            
    except Exception as e:
        print(f"❌ Error rotating page: {str(e)}")

def reorder_pdf_pages(pdf_doc, operation):
    """Reorder pages in PDF"""
    try:
        new_order = operation.get('order', [])
        if not new_order:
            return
            
        # Create a new document with reordered pages
        temp_doc = fitz.open()
        
        for page_num in new_order:
            if 0 <= page_num < len(pdf_doc):
                temp_doc.insert_pdf(pdf_doc, from_page=page_num, to_page=page_num)
        
        # Replace pages in original document
        pdf_doc.close()
        pdf_doc = temp_doc
        
    except Exception as e:
        print(f"❌ Error reordering pages: {str(e)}")

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    try:
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16)/255 for i in (0, 2, 4))
    except:
        return (0, 0, 0)  # Default to black

# Alternative implementation using ReportLab for adding content
def add_content_with_reportlab(input_path, output_path, operations):
    """Add content to PDF using ReportLab overlay method"""
    try:
        # Read existing PDF
        existing_pdf = PdfReader(input_path)
        output = PdfWriter()
        
        for page_num, page in enumerate(existing_pdf.pages):
            # Create overlay for this page
            packet = io.BytesIO()
            can = canvas.Canvas(packet, pagesize=letter)
            
            # Process operations for this page
            for operation in operations:
                if operation.get('page') == page_num:
                    op_type = operation.get('type')
                    
                    if op_type == 'add_text':
                        add_text_with_canvas(can, operation)
                    elif op_type == 'add_shape':
                        add_shape_with_canvas(can, operation)
            
            can.save()
            
            # Move to beginning of StringIO buffer
            packet.seek(0)
            overlay_pdf = PdfReader(packet)
            
            # Merge overlay with original page
            if overlay_pdf.pages:
                page.merge_page(overlay_pdf.pages[0])
            
            output.add_page(page)
        
        # Save result
        with open(output_path, "wb") as output_stream:
            output.write(output_stream)
            
        return True
        
    except Exception as e:
        print(f"❌ Error with ReportLab overlay: {str(e)}")
        return False

def add_text_with_canvas(canvas_obj, operation):
    """Add text using ReportLab canvas"""
    try:
        text = operation.get('text', '')
        x = float(operation.get('x', 100))
        y = float(operation.get('y', 100))
        font_size = int(operation.get('font_size', 12))
        color = operation.get('color', '#000000')
        
        canvas_obj.setFont("Helvetica", font_size)
        canvas_obj.setFillColor(HexColor(color))
        canvas_obj.drawString(x, y, text)
        
    except Exception as e:
        print(f"❌ Error adding text with canvas: {str(e)}")

def add_shape_with_canvas(canvas_obj, operation):
    """Add shapes using ReportLab canvas"""
    try:
        shape_type = operation.get('shape', 'rectangle')
        x = float(operation.get('x', 100))
        y = float(operation.get('y', 100))
        width = float(operation.get('width', 100))
        height = float(operation.get('height', 100))
        color = operation.get('color', '#000000')
        fill = operation.get('fill', False)
        
        canvas_obj.setStrokeColor(HexColor(color))
        if fill:
            canvas_obj.setFillColor(HexColor(color))
        
        if shape_type == 'rectangle':
            if fill:
                canvas_obj.rect(x, y, width, height, fill=1, stroke=1)
            else:
                canvas_obj.rect(x, y, width, height, fill=0, stroke=1)
        elif shape_type == 'circle':
            radius = min(width, height) / 2
            center_x = x + width/2
            center_y = y + height/2
            if fill:
                canvas_obj.circle(center_x, center_y, radius, fill=1, stroke=1)
            else:
                canvas_obj.circle(center_x, center_y, radius, fill=0, stroke=1)
                
    except Exception as e:
        print(f"❌ Error adding shape with canvas: {str(e)}")