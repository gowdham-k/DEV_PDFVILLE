from flask import request, jsonify, send_file
import io, os, tempfile, traceback
import base64
import re
import fitz  # PyMuPDF
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from bs4 import BeautifulSoup
from PIL import Image as PILImage


def convert_html_to_pdf():
    """
    Convert HTML to PDF
    Supports single file only
    """
    try:
        # Check if file was uploaded or HTML content was provided
        html_content = None
        filename = "converted.pdf"
        
        if 'file' in request.files and request.files['file']:
            # Process uploaded HTML file
            file = request.files['file']
            filename = file.filename
            
            # Check if file is an HTML file
            if not filename.lower().endswith(('.html', '.htm')):
                return jsonify({"error": f"File {filename} is not an HTML file"}), 400
            
            # Read HTML content from file
            html_content = file.read().decode('utf-8')
            filename = os.path.splitext(filename)[0] + ".pdf"
        elif 'html' in request.form:
            # Process HTML content from form data
            html_content = request.form['html']
        elif request.is_json and 'html' in request.json:
            # Process HTML content from JSON
            html_content = request.json['html']
        else:
            return jsonify({"error": "No HTML content or file provided"}), 400
        
        # Create a temporary directory to work with
        temp_dir = tempfile.mkdtemp()
        output_path = os.path.join(temp_dir, "output.pdf")
        
        # Process HTML content - handle base64 encoded images
        html_content, image_paths = _process_inline_images(html_content, temp_dir)
        
        # Convert HTML to PDF using ReportLab and BeautifulSoup
        _convert_html_to_pdf_with_reportlab(html_content, output_path, image_paths)
        
        # Check if conversion was successful
        if not os.path.exists(output_path):
            return jsonify({"error": "Conversion failed"}), 500
        
        return send_file(output_path, as_attachment=True, download_name=filename)
    
    except Exception as e:
        print("🔥 ERROR in convert_html_to_pdf function:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


def _process_inline_images(html_content, temp_dir):
    """
    Process inline base64 encoded images in HTML content
    Extracts them to files and updates the HTML to reference the files
    This helps with memory usage for large base64 encoded images
    """
    # Find all base64 encoded images
    img_pattern = re.compile(r'<img[^>]*src=["\']data:image/([^;]+);base64,([^"\'>]+)["\'][^>]*>', re.IGNORECASE)
    img_matches = img_pattern.findall(html_content)
    
    image_paths = []
    
    # Extract each image and save to file
    for i, (img_type, img_data) in enumerate(img_matches):
        try:
            # Decode base64 data
            img_binary = base64.b64decode(img_data)
            
            # Save to file
            img_filename = f"img_{i}.{img_type}"
            img_path = os.path.join(temp_dir, img_filename)
            image_paths.append(img_path)
            
            with open(img_path, 'wb') as f:
                f.write(img_binary)
            
            # Replace in HTML
            img_tag = f'data:image/{img_type};base64,{img_data}'
            html_content = html_content.replace(img_tag, f'img_{i}')
        except Exception as e:
            print(f"Error processing image {i}: {str(e)}")
            # Continue with other images if one fails
    
    return html_content, image_paths

def _convert_html_to_pdf_with_reportlab(html_content, output_path, image_paths):
    """
    Convert HTML content to PDF using ReportLab
    This is a simplified conversion that handles basic HTML elements
    """
    # Parse HTML with BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Create a PDF document
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []
    
    # Process HTML elements
    for element in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img']):
        if element.name.startswith('h'):
            # Handle headings
            heading_level = int(element.name[1])
            style = styles['Heading%d' % min(heading_level, 4)]
            elements.append(Paragraph(element.get_text(), style))
            elements.append(Spacer(1, 0.2 * inch))
        elif element.name == 'p':
            # Handle paragraphs
            elements.append(Paragraph(element.get_text(), styles['Normal']))
            elements.append(Spacer(1, 0.1 * inch))
        elif element.name == 'img':
            # Handle images
            src = element.get('src')
            if src and src.startswith('img_'):
                try:
                    # Extract image index
                    img_index = int(src.split('_')[1])
                    if img_index < len(image_paths):
                        img_path = image_paths[img_index]
                        # Get image dimensions
                        img = PILImage.open(img_path)
                        width, height = img.size
                        # Scale image to fit page width
                        max_width = 6 * inch
                        if width > max_width:
                            ratio = max_width / width
                            width = max_width
                            height = height * ratio
                        # Add image to PDF
                        elements.append(Image(img_path, width=width, height=height))
                        elements.append(Spacer(1, 0.1 * inch))
                except Exception as e:
                    print(f"Error processing image {src}: {str(e)}")
    
    # Build PDF document
    doc.build(elements)
    
    # Optional: Enhance PDF with PyMuPDF for better formatting
    try:
        pdf = fitz.open(output_path)
        # You can add additional processing here if needed
        pdf.save(output_path, garbage=4, deflate=True, clean=True)
        pdf.close()
    except Exception as e:
        print(f"PyMuPDF enhancement failed: {str(e)}")
        # Continue without enhancement
