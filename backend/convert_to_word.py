from pdf2image import convert_from_bytes 
import pytesseract 
from docx import Document 
from flask import request, jsonify, send_file 
import io, os, tempfile, traceback 
import shutil  # ✅ added for auto-detect

# ✅ Auto-detect tesseract.exe from PATH
tesseract_path = shutil.which("tesseract")
if tesseract_path:
    pytesseract.pytesseract.tesseract_cmd = tesseract_path
else:
    raise FileNotFoundError(
        "Tesseract not found. Please install it and add to PATH: https://github.com/UB-Mannheim/tesseract/wiki"
    )

def handle_convert_pdf_to_word(): 
    try: 
        uploaded_file = request.files.get("file") 
        if not uploaded_file: 
            return jsonify({"error": "No file provided"}), 400 
 
        pdf_bytes = uploaded_file.read() 
        images = convert_from_bytes(pdf_bytes)  # convert pdf → images 
 
        doc = Document() 
 
        for i, image in enumerate(images, start=1): 
            text = pytesseract.image_to_string(image) 
            doc.add_paragraph(f"--- Page {i} ---") 
            doc.add_paragraph(text) 
            doc.add_page_break() 
 
        temp_dir = tempfile.mkdtemp() 
        output_path = os.path.join(temp_dir, "output.docx") 
        doc.save(output_path) 
 
        return send_file(output_path, as_attachment=True, download_name="converted.docx") 
 
    except Exception as e: 
        print("🔥 ERROR in /convert-word route:") 
        traceback.print_exc() 
        return jsonify({"error": str(e)}), 500 
