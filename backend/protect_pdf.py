from restrictions import check_protect_pdf_restrictions
from flask import jsonify, send_file, request
import pikepdf
import traceback
import os
from utils import create_temp_file, create_temp_dir


def protect_pdf():
    """Add password protection to PDF with restrictions"""

    try:
        # Get file from request
        uploaded_file = request.files.get("file") or request.files.getlist("files")[0]
        if not uploaded_file:
            return jsonify({"error": "No file provided"}), 400

        # Get email from form (default free user for demo)
        email = request.form.get("email", "free@example.com")

        # Save uploaded file temporarily
        temp_dir = create_temp_dir()
        temp_path = os.path.join(temp_dir, uploaded_file.filename)
        uploaded_file.save(temp_path)

        # Run restrictions check for protect PDF
        restriction = check_protect_pdf_restrictions(email, [temp_path])
        if restriction:
            return jsonify(restriction), 403

        # Get password from request
        password = request.form.get("password")
        if not password:
            return jsonify({"error": "Password is required for protection"}), 400

        # Create output file
        output_path = create_temp_file(".pdf")

        # Protect PDF with password
        with pikepdf.open(temp_path) as pdf:
            pdf.save(
                output_path,
                encryption=pikepdf.Encryption(owner=password, user=password, R=4)
            )

        return send_file(output_path, as_attachment=True, download_name="protected.pdf")

    except Exception as e:
        print(f"Error in protect_pdf: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to protect PDF: {str(e)}"}), 500
