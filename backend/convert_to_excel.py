from restrictions import check_restrictions, get_user
from flask import jsonify, send_file, request
import camelot
import zipfile
import os
import traceback
from utils import create_temp_file, create_temp_dir


def convert_pdf_to_excel():

    ## PREMIUM CHECK INSERTED (expects function signature (..., file_paths, email) or similar)
    try:
        user = get_user(locals().get("email"))
        paths = locals().get("file_paths") or locals().get("files") or locals().get("pdf_paths")
        if isinstance(paths, (list, tuple)):
            restriction = check_restrictions(paths, user)
            if restriction:
                return restriction
    except Exception:
        pass
    """Convert PDF tables to Excel files"""
    try:
        # Debug: Print all available files and form data
        print("Request files:", request.files.keys())
        print("Request form:", request.form.keys())
        
        # Handle both 'file' and 'files' parameter names
        uploaded_file = None
        if 'file' in request.files:
            uploaded_file = request.files['file']
        elif 'files' in request.files:
            uploaded_file = request.files['files']
        elif request.files.getlist("files"):
            uploaded_file = request.files.getlist("files")[0]
            
        if not uploaded_file or uploaded_file.filename == '':
            print("No file provided or empty filename")
            return jsonify({"error": "No file provided"}), 400

        print(f"Processing file: {uploaded_file.filename}")
        
        # Save uploaded file temporarily since camelot needs a file path
        temp_pdf_path = create_temp_file(".pdf")
        uploaded_file.save(temp_pdf_path)
        
        # Try different camelot parsing methods
        tables = None
        
        # Method 1: Try lattice (for PDFs with clear table borders)
        try:
            print("Trying lattice method...")
            tables = camelot.read_pdf(temp_pdf_path, pages="all", flavor="lattice")
            print(f"Lattice method found {len(tables)} tables")
        except Exception as e:
            print(f"Lattice method failed: {e}")
        
        # Method 2: Try stream if lattice didn't find tables (for PDFs without clear borders)
        if not tables or len(tables) == 0:
            try:
                print("Trying stream method...")
                tables = camelot.read_pdf(temp_pdf_path, pages="all", flavor="stream")
                print(f"Stream method found {len(tables)} tables")
            except Exception as e:
                print(f"Stream method failed: {e}")
        
        # Clean up temp PDF file
        try:
            os.unlink(temp_pdf_path)
        except:
            pass
        
        if not tables or len(tables) == 0:
            return jsonify({
                "error": "No tables found in PDF. The PDF might not contain recognizable table structures, or the tables might be images/scanned content."
            }), 400
        
        temp_dir = create_temp_dir()
        excel_paths = []

        # Save each table as Excel file
        for i, table in enumerate(tables):
            excel_path = os.path.join(temp_dir, f"table_{i+1}.xlsx")
            # Use pandas DataFrame directly instead of camelot's to_excel method
            table.df.to_excel(excel_path, index=False)
            excel_paths.append(excel_path)
            print(f"Saved table {i+1} with shape: {table.df.shape}")

        # Create zip file containing all Excel files
        zip_path = create_temp_file(".zip")
        with zipfile.ZipFile(zip_path, "w") as zipf:
            for p in excel_paths:
                zipf.write(p, os.path.basename(p))

        return send_file(zip_path, as_attachment=True, download_name="tables_excel.zip")
    
    except Exception as e:
        print(f"Error in convert_pdf_to_excel: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": f"Failed to convert PDF to Excel: {str(e)}"}), 500