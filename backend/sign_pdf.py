import os
import tempfile
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import black
from io import BytesIO

def sign_pdf(input_file_path, signature_text, position_x, position_y, page_number):
    """
    Add a text signature to a PDF file
    
    Args:
        input_file_path (str): Path to the input PDF file
        signature_text (str): Text to use as signature
        position_x (int): X coordinate for signature placement
        position_y (int): Y coordinate for signature placement
        page_number (int): Page number to add signature to (0-based index)
        
    Returns:
        str: Path to the signed PDF file
    """
    try:
        # Create a temporary directory to store the output file
        temp_dir = tempfile.mkdtemp()
        output_file_path = os.path.join(temp_dir, "signed_pdf.pdf")
        
        # Read the input PDF
        pdf_reader = PdfReader(input_file_path)
        pdf_writer = PdfWriter()
        
        # Validate page number
        if page_number < 0 or page_number >= len(pdf_reader.pages):
            raise ValueError(f"Invalid page number. PDF has {len(pdf_reader.pages)} pages.")
        
        # Process each page
        for i, page in enumerate(pdf_reader.pages):
            if i == page_number:
                # Create a PDF with the signature
                packet = BytesIO()
                can = canvas.Canvas(packet, pagesize=letter)
                can.setFillColor(black)
                can.setFont("Helvetica", 12)
                can.drawString(position_x, position_y, signature_text)
                can.save()
                
                # Move to the beginning of the BytesIO buffer
                packet.seek(0)
                signature_pdf = PdfReader(packet)
                
                # Merge the signature with the page
                page.merge_page(signature_pdf.pages[0])
                
            # Add the page to the writer
            pdf_writer.add_page(page)
        
        # Write the output file
        with open(output_file_path, "wb") as output_file:
            pdf_writer.write(output_file)
        
        return output_file_path
    
    except Exception as e:
        print(f"Error signing PDF: {str(e)}")
        raise