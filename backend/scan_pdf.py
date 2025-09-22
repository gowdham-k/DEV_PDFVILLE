import os
import io
import tempfile
import logging
import traceback
import zipfile
from flask import request, jsonify, send_file
from werkzeug.utils import secure_filename
from PIL import Image
from io import BytesIO
import pytesseract
from pdf2image import convert_from_bytes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure pytesseract path if needed (uncomment and modify if necessary)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def scan_pdf_to_text(pdf_bytes, dpi=300, language='eng'):
    """
    Convert PDF to text using OCR
    """
    try:
        # Convert PDF to images
        logger.info("Converting PDF to images")
        images = convert_from_bytes(pdf_bytes, dpi=dpi)
        
        # Process each page with OCR
        logger.info(f"Processing {len(images)} pages with OCR")
        text_results = []
        
        for i, image in enumerate(images):
            logger.info(f"Processing page {i+1}")
            # Use pytesseract to extract text
            text = pytesseract.image_to_string(image, lang=language)
            text_results.append(text)
        
        # Combine all text
        full_text = "\n\n--- Page Break ---\n\n".join(text_results)
        return full_text, None
    
    except Exception as e:
        logger.error(f"Error in OCR processing: {str(e)}")
        traceback.print_exc()
        return None, str(e)

def scan_pdf():
    """
    Route handler for PDF scanning
    """
    logger.info("PDF scan request received")
    
    # Check if files were uploaded
    if 'files' not in request.files:
        logger.error("No files part in the request")
        return jsonify({"error": "No files uploaded"}), 400
    
    files = request.files.getlist('files')
    if not files or files[0].filename == '':
        logger.error("No files selected")
        return jsonify({"error": "No files selected"}), 400
    
    # Get parameters
    language = request.form.get('language', 'eng')
    dpi = int(request.form.get('dpi', 300))
    output_format = request.form.get('output_format', 'txt')
    
    logger.info(f"Processing with language: {language}, DPI: {dpi}, Output format: {output_format}")
    
    # Create temporary directory for processing
    with tempfile.TemporaryDirectory() as temp_dir:
        processed_files = []
        failed_files = []
        
        # Process each PDF
        for i, file in enumerate(files):
            if not file.filename.lower().endswith('.pdf'):
                logger.warning(f"Skipping non-PDF file: {file.filename}")
                continue
                
            logger.info(f"Processing file {i+1}/{len(files)}: {file.filename}")
            
            try:
                # Read the PDF file
                pdf_bytes = file.read()
                
                # Perform OCR
                text_content, error = scan_pdf_to_text(pdf_bytes, dpi, language)
                
                if error:
                    logger.error(f"OCR failed for {file.filename}: {error}")
                    failed_files.append((file.filename, error))
                    continue
                
                # Save the output
                base_name = os.path.splitext(secure_filename(file.filename))[0]
                output_filename = f"scanned_{base_name}.txt"
                output_path = os.path.join(temp_dir, output_filename)
                
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(text_content)
                
                processed_files.append((output_path, output_filename))
                logger.info(f"Successfully processed: {file.filename}")
                
            except Exception as e:
                logger.error(f"Error processing {file.filename}: {str(e)}")
                traceback.print_exc()
                failed_files.append((file.filename, str(e)))
        
        # Handle results
        if not processed_files:
            if failed_files:
                error_messages = "; ".join([f"{name}: {error}" for name, error in failed_files])
                return jsonify({"error": f"Failed to process files: {error_messages}"}), 500
            else:
                return jsonify({"error": "No PDF files were processed"}), 400
        
        # Return single file or create zip
        if len(processed_files) == 1:
            # Read the file into memory before sending to avoid file lock issues
            with open(processed_files[0][0], 'rb') as f:
                file_data = BytesIO(f.read())
            
            return send_file(
                file_data,
                as_attachment=True,
                download_name=processed_files[0][1],
                mimetype='text/plain'
            )
        else:
            # Create zip file for multiple PDFs
            zip_buffer = BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for file_path, file_name in processed_files:
                    zip_file.write(file_path, file_name)
            
            zip_buffer.seek(0)
            return send_file(
                zip_buffer,
                as_attachment=True,
                download_name="scanned_pdfs.zip",
                mimetype='application/zip'
            )