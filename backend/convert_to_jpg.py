from restrictions import check_convert_pdf_restrictions, get_user
from flask import jsonify, send_file, request
from pdf2image import convert_from_bytes
import zipfile
import os
import traceback
from utils import create_temp_file, create_temp_dir


def convert_pdf_to_jpg():
    """Convert PDF pages to JPG images with restrictions"""

    try:
        # Handle both 'file' and 'files'
        uploaded_file = request.files.get("file") or (
            request.files.getlist("files")[0] if request.files.getlist("files") else None
        )
        if not uploaded_file:
            return jsonify({"error": "No file provided"}), 400

        # Get user email from form (default = free user)
        email = request.form.get("email") or request.form.get("user_email") or "free@example.com"
        print(f"[DEBUG] /convert-jpg email={email}")
        user_info = get_user(email)
        print(f"[DEBUG] /convert-jpg user_info={user_info}")
        print(f"[DEBUG] /convert-jpg premium={user_info.get('is_premium_')} for {email}")

        # Save file temporarily for restriction check
        temp_dir = create_temp_dir()
        file_path = os.path.join(temp_dir, uploaded_file.filename)
        uploaded_file.save(file_path)
        size_mb = os.path.getsize(file_path) / (1024 * 1024)
        print(f"[DEBUG] /convert-jpg uploaded file size: {size_mb:.2f} MB")

        # Run restriction check
        restriction = check_convert_pdf_restrictions(email, [file_path])
        if restriction:
            print(f"[DEBUG] /convert-jpg restriction triggered: {restriction}")
            return jsonify(restriction), 403

        # Convert PDF to images
        with open(file_path, "rb") as f:
            images = convert_from_bytes(f.read())

        img_paths = []
        for i, img in enumerate(images):
            img_path = os.path.join(temp_dir, f"page_{i+1}.jpg")
            img.save(img_path, "JPEG")
            img_paths.append(img_path)

        # Zip images
        zip_path = create_temp_file(".zip")
        with zipfile.ZipFile(zip_path, "w") as zipf:
            for p in img_paths:
                zipf.write(p, os.path.basename(p))

        return send_file(zip_path, as_attachment=True, download_name="pages_jpg.zip")

    except Exception as e:
        print(f"Error in convert_pdf_to_jpg: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to convert PDF to JPG: {str(e)}"}), 500
