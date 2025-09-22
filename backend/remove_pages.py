from flask import request, send_file, jsonify
import os
import tempfile
import zipfile
from io import BytesIO
import logging
from PyPDF2 import PdfWriter, PdfReader
from restrictions import check_restrictions

# Configure logging
logger = logging.getLogger(__name__)

def parse_page_ranges(page_ranges_str, total_pages):
    """
    Parse page ranges string and return set of page numbers to remove.
    Examples: "1,3,5-7,10" -> {1,3,5,6,7,10}
    """
    pages_to_remove = set()
    
    if not page_ranges_str.strip():
        return pages_to_remove
    
    try:
        ranges = page_ranges_str.split(',')
        for range_str in ranges:
            range_str = range_str.strip()
            if '-' in range_str:
                # Handle range like "5-7"
                start, end = range_str.split('-', 1)
                start = int(start.strip())
                end = int(end.strip())
                if start > end:
                    start, end = end, start  # Swap if reversed
                for page in range(start, end + 1):
                    if 1 <= page <= total_pages:
                        pages_to_remove.add(page)
            else:
                # Handle single page
                page = int(range_str)
                if 1 <= page <= total_pages:
                    pages_to_remove.add(page)
    except ValueError as e:
        raise ValueError(f"Invalid page range format: {page_ranges_str}")
    
    return pages_to_remove

def remove_pages_from_pdf(input_pdf_path, pages_to_remove):
    """Remove specified pages from a PDF file."""
    try:
        with open(input_pdf_path, 'rb') as file:
            reader = PdfReader(file)
            writer = PdfWriter()
            
            total_pages = len(reader.pages)
            logger.info(f"PDF has {total_pages} pages, removing pages: {sorted(pages_to_remove)}")
            
            # Add pages that are NOT in the removal list
            pages_added = 0
            for page_num in range(1, total_pages + 1):
                if page_num not in pages_to_remove:
                    writer.add_page(reader.pages[page_num - 1])  # PyPDF2 uses 0-based indexing
                    pages_added += 1
            
            if pages_added == 0:
                raise ValueError("Cannot remove all pages from PDF")
            
            # Create output buffer
            output_buffer = BytesIO()
            writer.write(output_buffer)
            output_buffer.seek(0)
            
            logger.info(f"Successfully removed {len(pages_to_remove)} pages, {pages_added} pages remaining")
            return output_buffer
            
    except Exception as e:
        logger.error(f"Error removing pages from PDF: {str(e)}")
        raise e

def remove_pages():
    """Remove specified pages from PDF files - main function for Flask route"""
    try:
        # Apply restrictions check
        """restriction_result = check_restrictions(request)
        if restriction_result:
            return restriction_result"""
        
        # Check if files were uploaded
        if 'files' not in request.files:
            return jsonify({'error': 'No files uploaded'}), 400
        
        files = request.files.getlist('files')
        if not files or all(f.filename == '' for f in files):
            return jsonify({'error': 'No files selected'}), 400
        
        # Get page removal settings
        pages_to_remove_str = request.form.get('pages_to_remove', '')
        removal_type = request.form.get('removal_type', 'specific')  # 'specific' or 'range'
        
        if removal_type == 'specific' and not pages_to_remove_str.strip():
            return jsonify({'error': 'Please specify pages to remove'}), 400
        
        # Validate files are PDFs
        pdf_files = []
        for file in files:
            if file.filename.lower().endswith('.pdf'):
                pdf_files.append(file)
        
        if not pdf_files:
            return jsonify({'error': 'No valid PDF files found'}), 400
        
        logger.info(f"Processing {len(pdf_files)} PDF files for page removal")
        logger.info(f"Pages to remove: {pages_to_remove_str}, Type: {removal_type}")
        
        # Create temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            processed_files = []
            
            # Process each PDF
            for i, file in enumerate(pdf_files):
                logger.info(f"Processing file {i+1}/{len(pdf_files)}: {file.filename}")
                
                # Save uploaded file temporarily
                temp_input_path = os.path.join(temp_dir, f"input_{i}_{file.filename}")
                file.save(temp_input_path)
                
                try:
                    # Read PDF to get total pages
                    with open(temp_input_path, 'rb') as f:
                        reader = PdfReader(f)
                        total_pages = len(reader.pages)
                    
                    # Parse pages to remove
                    if removal_type == 'specific':
                        pages_to_remove = parse_page_ranges(pages_to_remove_str, total_pages)
                    else:
                        # For future expansion - could add other removal types
                        pages_to_remove = parse_page_ranges(pages_to_remove_str, total_pages)
                    
                    if not pages_to_remove:
                        return jsonify({'error': f'No valid pages specified for removal from {file.filename}'}), 400
                    
                    if len(pages_to_remove) >= total_pages:
                        return jsonify({'error': f'Cannot remove all pages from {file.filename}'}), 400
                    
                    # Remove pages
                    processed_buffer = remove_pages_from_pdf(temp_input_path, pages_to_remove)
                    
                    # Save processed file
                    output_filename = f"pages_removed_{file.filename}"
                    temp_output_path = os.path.join(temp_dir, output_filename)
                    
                    with open(temp_output_path, 'wb') as f:
                        f.write(processed_buffer.getvalue())
                    
                    processed_files.append((temp_output_path, output_filename))
                    
                except ValueError as e:
                    logger.error(f"Validation error processing {file.filename}: {str(e)}")
                    return jsonify({'error': f'Error with {file.filename}: {str(e)}'}), 400
                except Exception as e:
                    logger.error(f"Error processing {file.filename}: {str(e)}")
                    return jsonify({'error': f'Error processing {file.filename}: {str(e)}'}), 500
            
            # If only one file, return it directly
            if len(processed_files) == 1:
                # Copy the file content to a BytesIO object to avoid file access issues
                with open(processed_files[0][0], 'rb') as f:
                    file_content = BytesIO(f.read())
                
                return send_file(
                    file_content,
                    as_attachment=True,
                    download_name=processed_files[0][1],
                    mimetype='application/pdf'
                )
            
            # If multiple files, create a zip
            zip_buffer = BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for file_path, filename in processed_files:
                    zip_file.write(file_path, filename)
            
            zip_buffer.seek(0)
            
            return send_file(
                zip_buffer,
                as_attachment=True,
                download_name='pages_removed_pdfs.zip',
                mimetype='application/zip'
            )
            
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error in remove_pages: {str(e)}")
        return jsonify({'error': 'Internal server error occurred'}), 500