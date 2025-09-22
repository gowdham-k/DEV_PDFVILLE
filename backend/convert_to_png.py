from flask import request, send_file
from pdf2image import convert_from_path
import zipfile, os, tempfile

def convert_pdf_to_png():
    try:
        file = request.files['file']
        temp_dir = tempfile.mkdtemp()

        # Save uploaded PDF
        pdf_path = os.path.join(temp_dir, file.filename)
        file.save(pdf_path)

        # Convert PDF to PNG images
        images = convert_from_path(pdf_path, dpi=200)
        png_files = []
        for i, image in enumerate(images):
            output_path = os.path.join(temp_dir, f"page_{i+1}.png")
            image.save(output_path, "PNG")
            png_files.append(output_path)

        # Create ZIP of all PNGs
        zip_path = os.path.join(temp_dir, "converted.zip")
        with zipfile.ZipFile(zip_path, "w") as zipf:
            for png_file in png_files:
                zipf.write(png_file, os.path.basename(png_file))

        return send_file(zip_path, as_attachment=True, download_name="converted.zip")

    except Exception as e:
        return {"error": str(e)}, 500
