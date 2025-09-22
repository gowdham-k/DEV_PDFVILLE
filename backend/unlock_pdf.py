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

def unlock_pdf_file(input_pdf_path, password=None):
    """Unlock a password-protected PDF file."""
    try:
        with open(input_pdf_path, 'rb') as file:
            reader = PdfReader(file)
            
            # Check if PDF is encrypted
            if not reader.is_encrypted:
                logger.info("PDF is not password protected")
                # If not encrypted, just copy the file
                file.seek(0)
                return BytesIO(file.read())
            
            # Try to decrypt with provided password
            if password:
                try:
                    if reader.decrypt(password):
                        logger.info("PDF successfully decrypted with provided password")
                    else:
                        raise ValueError("Incorrect password provided")
                except Exception as e:
                    raise ValueError("Incorrect password provided")
            else:
                # Try common passwords or empty password
                common_passwords = ["", "123456", "password", "admin", "user"]
                decrypted = False
                
                for pwd in common_passwords:
                    try:
                        if reader.decrypt(pwd):
                            logger.info(f"PDF successfully decrypted with password: '{pwd}'")
                            decrypted = True
                            break
                    except:
                        continue
                
                if not decrypted:
                    raise ValueError("PDF is password protected. Please provide the correct password.")
            
            # Create new PDF without password protection
            writer = PdfWriter()
            
            # Copy all pages to new writer
            for page in reader.pages:
                writer.add_page(page)
            
            # Copy metadata if available
            if reader.metadata:
                writer.add_metadata(reader.metadata)
            
            # Create output buffer
            output_buffer = BytesIO()
            writer.write(output_buffer)
            output_buffer.seek(0)
            
            logger.info("Successfully removed password protection from PDF")
            return output_buffer
            
    except Exception as e:
        logger.error(f"Error unlocking PDF: {str(e)}")
        raise e

def unlock_pdf():
    """Unlock password-protected PDF files - main function for Flask route"""
    try:
        # Apply restrictions check
        # Uncomment to enable restrictions
        # restriction_result = check_restrictions(request)
        # if restriction_result:
        #     return restriction_result
        
        # Check if files were uploaded
        if 'files' not in request.files:
            return jsonify({'error': 'No files uploaded'}), 400
        
        files = request.files.getlist('files')
        if not files or all(f.filename == '' for f in files):
            return jsonify({'error': 'No files selected'}), 400
        
        # Get password from form data
        password = request.form.get('password', '').strip()
        
        # Validate files are PDFs
        pdf_files = []
        for file in files:
            if file.filename.lower().endswith('.pdf'):
                pdf_files.append(file)
        
        if not pdf_files:
            return jsonify({'error': 'No valid PDF files found'}), 400
        
        logger.info(f"Processing {len(pdf_files)} PDF files for unlocking")
        if password:
            logger.info("Password provided for decryption")
        else:
            logger.info("No password provided, will try common passwords")
        
        # Create temporary directory
        with tempfile.TemporaryDirectory() as temp_dir:
            processed_files = []
            failed_files = []
            
            # Process each PDF
            for i, file in enumerate(pdf_files):
                logger.info(f"Processing file {i+1}/{len(pdf_files)}: {file.filename}")
                
                # Save uploaded file temporarily
                temp_input_path = os.path.join(temp_dir, f"input_{i}_{file.filename}")
                file.save(temp_input_path)
                
                try:
                    # Unlock PDF
                    unlocked_buffer = unlock_pdf_file(temp_input_path, password)
                    
                    # Save unlocked file
                    output_filename = f"unlocked_{file.filename}"
                    temp_output_path = os.path.join(temp_dir, output_filename)
                    
                    with open(temp_output_path, 'wb') as f:
                        f.write(unlocked_buffer.getvalue())
                    
                    processed_files.append((temp_output_path, output_filename))
                    
                except ValueError as e:
                    logger.error(f"Failed to unlock {file.filename}: {str(e)}")
                    failed_files.append((file.filename, str(e)))
                except Exception as e:
                    logger.error(f"Error processing {file.filename}: {str(e)}")
                    failed_files.append((file.filename, f"Processing error: {str(e)}"))
            
            # Handle results
            if not processed_files and failed_files:
                # All files failed
                error_msg = "Failed to unlock PDFs:\n" + "\n".join([f"• {name}: {error}" for name, error in failed_files])
                return jsonify({'error': error_msg}), 400
            
            if failed_files:
                # Some files failed - include warning in response
                warning_msg = "Some files could not be unlocked:\n" + "\n".join([f"• {name}: {error}" for name, error in failed_files])
                logger.warning(warning_msg)
            
            # If only one successful file, return it directly
            if len(processed_files) == 1:
                # Copy the file content to a BytesIO object to avoid file access issues
                with open(processed_files[0][0], 'rb') as f:
                    file_content = BytesIO(f.read())
                
                response = send_file(
                    file_content,
                    as_attachment=True,
                    download_name=processed_files[0][1],
                    mimetype='application/pdf'
                )
                if failed_files:
                    # Add warning header for partial success
                    response.headers['X-Warning'] = f"{len(failed_files)} files failed to unlock"
                return response
            
            # If multiple successful files, create a zip
            zip_buffer = BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for file_path, filename in processed_files:
                    zip_file.write(file_path, filename)
                
                # Add a summary file if some files failed
                if failed_files:
                    summary = "Failed to unlock the following files:\n\n"
                    summary += "\n".join([f"• {name}: {error}" for name, error in failed_files])
                    zip_file.writestr("unlock_summary.txt", summary)
            
            zip_buffer.seek(0)
            
            response = send_file(
                zip_buffer,
                as_attachment=True,
                download_name='unlocked_pdfs.zip',
                mimetype='application/zip'
            )
            if failed_files:
                response.headers['X-Warning'] = f"{len(failed_files)} files failed to unlock"
            return response
            
    except Exception as e:
        logger.error(f"Unexpected error in unlock_pdf: {str(e)}")
        return jsonify({'error': 'Internal server error occurred'}), 500