import traceback
import pdfplumber
from flask import jsonify, send_file, request
from werkzeug.utils import secure_filename
from utils import cleanup_file, create_temp_file
from restrictions import check_convert_pdf_restrictions

def handle_convert_pdf_to_html():
    """Handles PDF → HTML conversion with better error handling and cleanup"""
    uploaded_file = None
    output_path = None
    
    try:
        # Get uploaded file
        uploaded_file = request.files.get("file") or (
            request.files.getlist("files")[0] if request.files.getlist("files") else None
        )
        if not uploaded_file or uploaded_file.filename == "":
            return jsonify({"error": "No file provided"}), 400

        # Save uploaded file temporarily for restriction check
        temp_input_path = create_temp_file(uploaded_file.filename)
        uploaded_file.save(temp_input_path)
        
        # Check restrictions for PDF files
        email = request.form.get("email", "anonymous@example.com")
        restriction_error = check_convert_pdf_restrictions(email, [temp_input_path])
        if restriction_error:
            cleanup_file(temp_input_path)
            return jsonify(restriction_error), 403

        # Sanitize filename
        original_name = secure_filename((uploaded_file.filename or "converted").rsplit(".", 1)[0])

        # Convert PDF to HTML
        html_content = ["<html><body>"]
        with pdfplumber.open(temp_input_path) as pdf:
            if not pdf.pages:
                cleanup_file(temp_input_path)
                return jsonify({"error": "PDF has no pages"}), 400

            for page in pdf.pages:
                text = page.extract_text() or ""
                if not text.strip():
                    html_content.append("<p><i>[No extractable text on this page]</i></p>")
                else:
                    text = text.replace("\n", "<br>")
                    html_content.append(f"<p>{text}</p>")
        html_content.append("</body></html>")

        # Clean up temp input file
        cleanup_file(temp_input_path)

        # Save HTML to temp file
        output_path = create_temp_file(f"{original_name}.html")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(html_content))

        # Send file as response
        return send_file(
            output_path,
            mimetype="text/html",
            as_attachment=True,
            download_name=f"{original_name}.html"
        )

    except Exception as e:
        print(f"Error in convert_pdf_to_html: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to convert PDF to HTML: {str(e)}"}), 500

    finally:
        # Cleanup temp files after request is done
        if output_path:
            cleanup_file(output_path)
