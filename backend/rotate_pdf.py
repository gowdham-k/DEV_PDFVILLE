import os
import PyPDF2
import tempfile
import zipfile
from io import BytesIO
from flask import request, jsonify, send_file
import re
from restrictions import check_restrictions, get_user

def parse_page_ranges(page_ranges, total_pages):
    """
    Parse page ranges string and return list of page numbers (0-indexed)
    Examples:
    - "1,3,5" -> [0, 2, 4]
    - "2-5" -> [1, 2, 3, 4]
    - "1,3,5-7,10" -> [0, 2, 4, 5, 6, 9]
    """
    if not page_ranges or page_ranges.strip().lower() == 'all':
        return list(range(total_pages))
    
    pages = []
    parts = page_ranges.replace(' ', '').split(',')
    
    for part in parts:
        if '-' in part:
            # Handle ranges like "5-7"
            try:
                start, end = part.split('-', 1)
                start_page = int(start) - 1  # Convert to 0-indexed
                end_page = int(end) - 1      # Convert to 0-indexed
                
                # Validate range
                if start_page < 0 or end_page >= total_pages or start_page > end_page:
                    continue
                    
                pages.extend(range(start_page, end_page + 1))
            except ValueError:
                continue
        else:
            # Handle single pages like "1", "3", "5"
            try:
                page_num = int(part) - 1  # Convert to 0-indexed
                if 0 <= page_num < total_pages:
                    pages.append(page_num)
            except ValueError:
                continue
    
    # Remove duplicates and sort
    return sorted(list(set(pages)))

def rotate_single_pdf(input_pdf_path, output_pdf_path, pages_to_rotate, rotation_angle):
    """
    Rotate specific pages in a single PDF file
    """
    try:
        with open(input_pdf_path, 'rb') as input_file:
            reader = PyPDF2.PdfReader(input_file)
            writer = PyPDF2.PdfWriter()
            
            total_pages = len(reader.pages)
            
            # Parse page ranges
            if pages_to_rotate == "all":
                pages_list = list(range(total_pages))
            else:
                pages_list = parse_page_ranges(pages_to_rotate, total_pages)
            
            # Process each page
            for page_num in range(total_pages):
                page = reader.pages[page_num]
                
                # Rotate page if it's in the list
                if page_num in pages_list:
                    page = page.rotate(int(rotation_angle))
                
                writer.add_page(page)
            
            # Write the output PDF
            with open(output_pdf_path, 'wb') as output_file:
                writer.write(output_file)
                
        return True, "Successfully rotated pages in PDF"
        
    except Exception as e:
        return False, f"Error rotating PDF: {str(e)}"

def rotate_pdf_pages():
    """
    Main function to handle PDF page rotation requests
    This function follows the same pattern as other PDF operations in your app
    """
    try:
        # Check if files are present
        if 'files' not in request.files:
            return jsonify({'error': 'No files uploaded'}), 400
        
        files = request.files.getlist('files')
        if not files or all(file.filename == '' for file in files):
            return jsonify({'error': 'No files selected'}), 400
            
        # Get user email for restriction checking
        email = request.form.get('email', '')
        
        # Get rotation parameters
        pages_to_rotate = request.form.get('pages_to_rotate', '').strip()
        rotation_angle = request.form.get('rotation_angle', '90')
        rotation_type = request.form.get('rotation_type', 'specific')
        
        print(f"Rotation request - Pages: {pages_to_rotate}, Angle: {rotation_angle}, Type: {rotation_type}")
        
        # Validate rotation angle
        if rotation_angle not in ['90', '180', '270']:
            return jsonify({'error': 'Invalid rotation angle. Use 90, 180, or 270'}), 400
        
        # Validate pages specification
        if rotation_type == 'specific' and not pages_to_rotate:
            return jsonify({'error': 'Please specify pages to rotate'}), 400
        
        # Validate page ranges format if specific pages are provided
        if rotation_type == 'specific' and pages_to_rotate != 'all':
            pattern = r'^(\d+(-\d+)?,?\s*)+$'
            if not re.match(pattern, pages_to_rotate.replace(' ', '')):
                return jsonify({'error': 'Invalid page range format. Use format like: 1,3,5-7,10'}), 400
        
        # Create temporary directory for processing
        with tempfile.TemporaryDirectory() as temp_dir:
            # Save files temporarily for restriction checking
            temp_file_paths = []
            for file_index, file in enumerate(files):
                if not file.filename.lower().endswith('.pdf'):
                    continue
                temp_path = os.path.join(temp_dir, f"temp_{file_index}_{file.filename}")
                file.save(temp_path)
                temp_file_paths.append(temp_path)
            
            # Check restrictions
            restriction_error = check_restrictions(email, temp_file_paths)
            if restriction_error:
                if isinstance(restriction_error, dict):
                    return jsonify(restriction_error), 403
                else:
                    return jsonify({"error": restriction_error, "show_upgrade": True}), 403
            
            processed_files = []
            
            for file_index, file in enumerate(files):
                if not file.filename.lower().endswith('.pdf'):
                    continue
                
                print(f"Processing file {file_index + 1}/{len(files)}: {file.filename}")
                
                # Save uploaded file
                input_path = os.path.join(temp_dir, f"input_{file_index}_{file.filename}")
                file.save(input_path)
                
                # Create output path
                base_name = os.path.splitext(file.filename)[0]
                output_filename = f"rotated_{base_name}.pdf"
                output_path = os.path.join(temp_dir, output_filename)
                
                # Determine pages to rotate
                pages_param = pages_to_rotate if rotation_type == 'specific' else 'all'
                
                # Rotate pages
                success, message = rotate_single_pdf(
                    input_path, 
                    output_path, 
                    pages_param,
                    rotation_angle
                )
                
                if success and os.path.exists(output_path):
                    processed_files.append({
                        'path': output_path,
                        'filename': output_filename
                    })
                    print(f"Successfully rotated: {file.filename}")
                else:
                    print(f"Failed to rotate {file.filename}: {message}")
                    return jsonify({'error': f'Failed to rotate {file.filename}: {message}'}), 500
            
            if not processed_files:
                return jsonify({'error': 'No PDF files were processed successfully'}), 400
            
            print(f"Total files processed: {len(processed_files)}")
            
            # Return single file or create zip
            if len(processed_files) == 1:
                # Read the file into memory before sending to avoid file lock issues
                with open(processed_files[0]['path'], 'rb') as f:
                    file_data = BytesIO(f.read())
                
                return send_file(
                    file_data,
                    as_attachment=True,
                    download_name=processed_files[0]['filename'],
                    mimetype='application/pdf'
                )
            else:
                # Create zip file for multiple PDFs
                zip_buffer = BytesIO()
                with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                    for file_info in processed_files:
                        zip_file.write(file_info['path'], file_info['filename'])
                
                zip_buffer.seek(0)
                
                return send_file(
                    zip_buffer,
                    as_attachment=True,
                    download_name='rotated_pdfs.zip',
                    mimetype='application/zip'
                )
    
    except Exception as e:
        print(f"Error in rotate_pdf_pages: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500