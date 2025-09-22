from restrictions import check_restrictions, get_user
from flask import jsonify, send_file, request
from PyPDF2 import PdfReader, PdfWriter
import zipfile
import os
import traceback
from utils import create_temp_file, create_temp_dir


def split_pdf():
    """Split PDF into individual pages or a range of pages"""
    try:
        # Get the uploaded file
        uploaded_file = request.files.get("file") or (
            request.files.getlist("files")[0] if request.files.getlist("files") else None
        )
        if not uploaded_file:
            return jsonify({"error": "No file provided"}), 400

        # Save temporarily so restriction check can access it
        temp_dir = create_temp_dir()
        file_path = os.path.join(temp_dir, uploaded_file.filename)
        uploaded_file.save(file_path)

        # Check restrictions
        email = request.form.get("email", "free@example.com")  # default demo email
        restriction = check_restrictions(email, [file_path])
        if restriction:
            return jsonify({"error": restriction}), 403

        # Now continue with splitting
        reader = PdfReader(file_path)
        total_pages = len(reader.pages)

        # Get split range
        start_page = request.form.get("start_page")
        end_page = request.form.get("end_page")

        if start_page and end_page:
            try:
                start_idx = int(start_page) - 1
                end_idx = int(end_page) - 1

                if start_idx < 0 or end_idx >= total_pages:
                    return jsonify({
                        "error": f"Page range out of bounds. PDF has {total_pages} pages."
                    }), 400

                if start_idx > end_idx:
                    return jsonify({"error": "Start page cannot be greater than end page."}), 400

                pages_to_split = range(start_idx, end_idx + 1)
                split_type = "range"

            except ValueError:
                return jsonify({"error": "Invalid page numbers. Please provide valid integers."}), 400
        else:
            pages_to_split = range(total_pages)
            split_type = "all"

        pdf_paths = []
        for i in pages_to_split:
            writer = PdfWriter()
            writer.add_page(reader.pages[i])
            part_path = os.path.join(temp_dir, f"page_{i+1}.pdf")
            with open(part_path, "wb") as out_f:
                writer.write(out_f)
            pdf_paths.append(part_path)

        # Create zip
        zip_path = create_temp_file(".zip")
        with zipfile.ZipFile(zip_path, "w") as zipf:
            for p in pdf_paths:
                zipf.write(p, os.path.basename(p))

        download_name = f"split_pages_{start_page}-{end_page}.zip" if split_type == "range" else "split_pages.zip"

        return send_file(zip_path, as_attachment=True, download_name=download_name)

    except Exception as e:
        print(f"Error in split_pdf: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to split PDF: {str(e)}"}), 500
