import os
import uuid
import tempfile
from flask import request, jsonify, send_file
import PyPDF2
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import subprocess
from werkzeug.utils import secure_filename

def convert_pdf_to_pdfa():
    """Convert PDF to PDF/A format"""
    # Check if file was uploaded
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    
    # Check if filename is empty
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Check file extension
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Only PDF files are supported"}), 400
    
    try:
        # Create temporary directory for processing
        with tempfile.TemporaryDirectory() as temp_dir:
            # Save uploaded file
            input_path = os.path.join(temp_dir, secure_filename(file.filename))
            file.save(input_path)
            
            # Generate output filename
            output_filename = f"pdfa_{uuid.uuid4().hex}.pdf"
            output_path = os.path.join(temp_dir, output_filename)
            
            # Use GhostScript to convert PDF to PDF/A
            gs_command = [
                'gs',  # Use gswin64c on Windows
                '-dPDFA=2',
                '-dBATCH',
                '-dNOPAUSE',
                '-dNOOUTERSAVE',
                '-dPDFACompatibilityPolicy=1',
                '-sColorConversionStrategy=UseDeviceIndependentColor',
                '-sDEVICE=pdfwrite',
                f'-sOutputFile={output_path}',
                input_path
            ]
            
            # Execute GhostScript command
            process = subprocess.run(gs_command, capture_output=True, text=True)
            
            if process.returncode != 0:
                return jsonify({"error": f"Conversion failed: {process.stderr}"}), 500
            
            # Return the converted file
            return send_file(
                output_path,
                as_attachment=True,
                download_name=f"pdfa_{secure_filename(file.filename)}",
                mimetype='application/pdf'
            )
    
    except Exception as e:
        return jsonify({"error": f"Conversion failed: {str(e)}"}), 500