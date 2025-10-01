from flask import request, jsonify, send_file
import io, os, tempfile, traceback
import subprocess
import platform
from restrictions import check_convert_pdf_restrictions
 
# Only import comtypes on Windows
if platform.system() == 'Windows':
    try:
        import comtypes.client
    except ImportError:
        print("comtypes not available, will use LibreOffice for conversion")
        comtypes = None
else:
    comtypes = None

def convert_word_to_pdf():
    """
    Convert Word documents (DOC/DOCX) to PDF
    Supports single file only
    """
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        if not file:
            return jsonify({"error": "No file provided"}), 400
        
        # Check if file is a Word document
        filename = file.filename
        if not filename.lower().endswith(('.doc', '.docx')):
            return jsonify({"error": f"File {filename} is not a Word document"}), 400
        
        # Create a temporary directory to work with
        temp_dir = tempfile.mkdtemp()
        input_path = os.path.join(temp_dir, filename)
        output_path = os.path.join(temp_dir, "output.pdf")
        
        # Save the uploaded file
        file.save(input_path)
        
        # Check restrictions for PDF conversion
        email = request.form.get("email", "anonymous@example.com")
        restriction_error = check_convert_pdf_restrictions(email, [input_path])
        if restriction_error:
            return jsonify(restriction_error), 403
        
        # Convert Word to PDF using COM (Windows only) if comtypes is available
        if platform.system() == 'Windows' and comtypes is not None:
            try:
                word = comtypes.client.CreateObject('Word.Application')
                word.Visible = False
                doc = word.Documents.Open(input_path)
                doc.SaveAs(output_path, FileFormat=17)  # 17 = PDF format
                doc.Close()
                word.Quit()
            except Exception as e:
                print(f"COM conversion failed: {str(e)}")
                # Fallback to LibreOffice if COM fails
                return _convert_with_libreoffice(input_path, output_path)
        else:
            # Use LibreOffice for non-Windows platforms or if comtypes is not available
            return _convert_with_libreoffice(input_path, output_path)
        
        # Check if conversion was successful
        if not os.path.exists(output_path):
            return jsonify({"error": "Conversion failed"}), 500
        
        return send_file(output_path, as_attachment=True, download_name="converted.pdf")
    
    except Exception as e:
        print("?? ERROR in convert_word_to_pdf function:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

def _convert_with_libreoffice(input_path, output_path):
    """
    Convert Word to PDF using LibreOffice/OpenOffice
    """
    try:
        # Try to find LibreOffice or OpenOffice executable
        soffice_path = None
        if platform.system() == 'Windows':
            possible_paths = [
                r'C:\Program Files\LibreOffice\program\soffice.exe',
                r'C:\Program Files (x86)\LibreOffice\program\soffice.exe',
                r'C:\Program Files\OpenOffice\program\soffice.exe',
                r'C:\Program Files (x86)\OpenOffice\program\soffice.exe'
            ]
            for path in possible_paths:
                if os.path.exists(path):
                    soffice_path = path
                    break
        else:
            # For Linux/Mac, try to find in PATH
            soffice_path = 'soffice'
        
        if not soffice_path:
            return jsonify({"error": "LibreOffice/OpenOffice not found"}), 500
        
        # Convert using LibreOffice/OpenOffice
        output_dir = os.path.dirname(output_path)
        cmd = [soffice_path, '--headless', '--convert-to', 'pdf', '--outdir', output_dir, input_path]
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        
        # Check if conversion was successful
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        generated_pdf = os.path.join(output_dir, f"{base_name}.pdf")
        
        if os.path.exists(generated_pdf):
            # Rename to expected output path if needed
            if generated_pdf != output_path:
                os.rename(generated_pdf, output_path)
            return send_file(output_path, as_attachment=True, download_name="converted.pdf")
        else:
            return jsonify({"error": "Conversion failed"}), 500
    
    except Exception as e:
        print(f"LibreOffice conversion failed: {str(e)}")
        return jsonify({"error": str(e)}), 500