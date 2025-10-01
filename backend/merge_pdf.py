from restrictions import check_merge_pdf_restrictions
from flask import jsonify, send_file, request
from PyPDF2 import PdfMerger
import traceback
import os
from utils import create_temp_file, create_temp_dir


def merge_pdfs():
    """Merge multiple PDF files into one with restrictions"""

    try:
        files = request.files.getlist("files")
        if not files:
            return jsonify({"error": "No files provided"}), 400

        # Get email from form (default free user for demo)
        email = request.form.get("email", "free@example.com")

        # Save uploaded files temporarily
        temp_dir = create_temp_dir()
        file_paths = []
        for f in files:
            if f.filename == "":
                continue
            path = os.path.join(temp_dir, f.filename)
            f.save(path)
            file_paths.append(path)

        # Run restriction checks
        restriction = check_merge_pdf_restrictions(email, file_paths)
        if restriction:
            # Handle both string and dict error responses
            if isinstance(restriction, dict):
                return jsonify(restriction), 403
            else:
                return jsonify({"error": restriction}), 403

        # Merge PDFs
        merger = PdfMerger()
        for path in file_paths:
            merger.append(path)

        print("Restriction result:", restriction)
        output_path = create_temp_file(".pdf")
        merger.write(output_path)
        merger.close()

        return send_file(output_path, as_attachment=True, download_name="merged.pdf")

    except Exception as e:
        print(f"Error in merge_pdfs: {str(e)}")
        print(traceback.format_exc())
        print("Restriction result:", restriction)
        return jsonify({"error": f"Failed to merge PDFs: {str(e)}"}), 500
