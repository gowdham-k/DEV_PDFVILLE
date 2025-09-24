import os
import io
import zipfile
import tempfile
from flask import request, jsonify, send_file
import PyPDF2
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import black
import fitz  # PyMuPDF for better PDF text extraction and manipulation
import requests
import json
from typing import List, Dict, Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PDFTranslator:
    """
    A comprehensive PDF translation service that preserves formatting
    and supports multiple translation services.
    """
    
    def __init__(self):
        # Initialize translation services - you can add more services here
        self.translation_services = {
            'google': self._translate_google,
            'azure': self._translate_azure,
            'aws': self._translate_aws,
            'libre': self._translate_libre
        }
        
        # Language code mappings for different services
        self.language_mappings = {
            'en': 'English',
            'es': 'Spanish', 
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'zh-cn': 'Chinese (Simplified)',
            'ja': 'Japanese',
            'ko': 'Korean',
            'ar': 'Arabic',
            'hi': 'Hindi',
            'th': 'Thai',
            'vi': 'Vietnamese',
            'nl': 'Dutch',
            'pl': 'Polish',
            'tr': 'Turkish'
        }

    def extract_text_with_positions(self, pdf_path: str) -> List[Dict]:
        """Extract text with position information from PDF"""
        try:
            doc = fitz.open(pdf_path)
            pages_content = []
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                
                # Get text blocks with position information
                blocks = page.get_text("dict")
                
                page_content = {
                    'page_number': page_num,
                    'width': page.rect.width,
                    'height': page.rect.height,
                    'blocks': []
                }
                
                for block in blocks["blocks"]:
                    if "lines" in block:  # Text block
                        for line in block["lines"]:
                            for span in line["spans"]:
                                page_content['blocks'].append({
                                    'text': span["text"],
                                    'bbox': span["bbox"],  # [x0, y0, x1, y1]
                                    'font': span["font"],
                                    'size': span["size"],
                                    'flags': span["flags"],
                                    'color': span["color"]
                                })
                
                pages_content.append(page_content)
            
            doc.close()
            return pages_content
            
        except Exception as e:
            logger.error(f"Error extracting text with positions: {str(e)}")
            return []

    def translate_text(self, text: str, target_language: str, mode: str = 'auto') -> str:
        """Translate text using the best available service"""
        if not text.strip():
            return text
            
        try:
            # Try LibreTranslate first (free and local)
            translated = self._translate_libre(text, target_language)
            if translated and translated != text:
                return translated
        except Exception as e:
            logger.warning(f"LibreTranslate failed: {str(e)}")
        
        try:
            # Fallback to Google Translate (requires API key)
            translated = self._translate_google(text, target_language)
            if translated and translated != text:
                return translated
        except Exception as e:
            logger.warning(f"Google Translate failed: {str(e)}")
        
        # If all services fail, return original text
        return text

    def _translate_libre(self, text: str, target_language: str) -> str:
        """Translate using LibreTranslate (free, self-hosted option)"""
        try:
            # You can host LibreTranslate locally or use a public instance
            libre_url = os.environ.get('LIBRETRANSLATE_URL', 'https://libretranslate.de/translate')
            
            data = {
                'q': text,
                'source': 'auto',
                'target': target_language,
                'format': 'text'
            }
            
            response = requests.post(libre_url, data=data, timeout=30)
            if response.status_code == 200:
                result = response.json()
                return result.get('translatedText', text)
        except Exception as e:
            logger.error(f"LibreTranslate error: {str(e)}")
        return text

    def _translate_google(self, text: str, target_language: str) -> str:
        """Translate using Google Translate API (requires API key)"""
        try:
            api_key = os.environ.get('GOOGLE_TRANSLATE_API_KEY')
            if not api_key:
                logger.warning("Google Translate API key not found")
                return text
                
            url = f'https://translation.googleapis.com/language/translate/v2?key={api_key}'
            
            data = {
                'q': text,
                'target': target_language,
                'format': 'text'
            }
            
            response = requests.post(url, data=data, timeout=30)
            if response.status_code == 200:
                result = response.json()
                return result['data']['translations'][0]['translatedText']
        except Exception as e:
            logger.error(f"Google Translate error: {str(e)}")
        return text

    def _translate_azure(self, text: str, target_language: str) -> str:
        """Translate using Azure Translator (requires API key and region)"""
        try:
            api_key = os.environ.get('AZURE_TRANSLATOR_KEY')
            region = os.environ.get('AZURE_TRANSLATOR_REGION')
            if not api_key:
                return text
                
            endpoint = 'https://api.cognitive.microsofttranslator.com'
            path = '/translate'
            constructed_url = endpoint + path
            
            params = {
                'api-version': '3.0',
                'to': target_language
            }
            
            headers = {
                'Ocp-Apim-Subscription-Key': api_key,
                'Ocp-Apim-Subscription-Region': region,
                'Content-type': 'application/json',
                'X-ClientTraceId': str(uuid.uuid4())
            }
            
            body = [{'text': text}]
            
            response = requests.post(constructed_url, params=params, headers=headers, json=body, timeout=30)
            if response.status_code == 200:
                result = response.json()
                return result[0]['translations'][0]['text']
        except Exception as e:
            logger.error(f"Azure Translator error: {str(e)}")
        return text

    def _translate_aws(self, text: str, target_language: str) -> str:
        """Translate using AWS Translate (requires boto3 and AWS credentials)"""
        try:
            import boto3
            translate_client = boto3.client('translate')
            
            result = translate_client.translate_text(
                Text=text,
                SourceLanguageCode='auto',
                TargetLanguageCode=target_language
            )
            
            return result['TranslatedText']
        except Exception as e:
            logger.error(f"AWS Translate error: {str(e)}")
        return text

    def create_translated_pdf(self, pages_content: List[Dict], target_language: str, 
                            preserve_formatting: bool = True, translate_mode: str = 'auto') -> bytes:
        """Create a new PDF with translated content"""
        try:
            buffer = io.BytesIO()
            
            if not pages_content:
                # Create empty PDF if no content
                doc = SimpleDocTemplate(buffer, pagesize=letter)
                story = [Paragraph("No content to translate", getSampleStyleSheet()['Normal'])]
                doc.build(story)
                return buffer.getvalue()
            
            # Create PDF with PyMuPDF for better formatting control
            doc = fitz.open()
            
            for page_content in pages_content:
                # Create new page with same dimensions
                page = doc.new_page(width=page_content['width'], height=page_content['height'])
                
                if preserve_formatting:
                    # Translate and place text blocks in original positions
                    for block in page_content['blocks']:
                        if block['text'].strip():
                            translated_text = self.translate_text(block['text'], target_language, translate_mode)
                            
                            # Insert text at original position with original formatting
                            try:
                                page.insert_text(
                                    (block['bbox'][0], block['bbox'][1]),
                                    translated_text,
                                    fontsize=block['size'],
                                    color=block['color']
                                )
                            except Exception as e:
                                # Fallback if positioning fails
                                page.insert_text(
                                    (block['bbox'][0], block['bbox'][1]),
                                    translated_text,
                                    fontsize=12
                                )
                else:
                    # Simple text flow without position preservation
                    all_text = " ".join([block['text'] for block in page_content['blocks'] if block['text'].strip()])
                    if all_text.strip():
                        translated_text = self.translate_text(all_text, target_language, translate_mode)
                        
                        # Insert translated text with basic formatting
                        text_rect = fitz.Rect(50, 50, page_content['width']-50, page_content['height']-50)
                        page.insert_textbox(text_rect, translated_text, fontsize=12)
            
            # Save PDF to buffer
            pdf_bytes = doc.write()
            doc.close()
            
            return pdf_bytes
            
        except Exception as e:
            logger.error(f"Error creating translated PDF: {str(e)}")
            # Return empty PDF on error
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            story = [Paragraph(f"Translation error: {str(e)}", getSampleStyleSheet()['Normal'])]
            doc.build(story)
            return buffer.getvalue()

    def translate_pdf_file(self, pdf_path: str, target_language: str, 
                          preserve_formatting: bool = True, translate_mode: str = 'auto') -> bytes:
        """Main method to translate a PDF file"""
        try:
            logger.info(f"Starting translation of {pdf_path} to {target_language}")
            
            # Extract text with positions
            pages_content = self.extract_text_with_positions(pdf_path)
            
            if not pages_content:
                raise Exception("Could not extract text from PDF")
            
            # Create translated PDF
            translated_pdf = self.create_translated_pdf(
                pages_content, target_language, preserve_formatting, translate_mode
            )
            
            logger.info(f"Translation completed successfully")
            return translated_pdf
            
        except Exception as e:
            logger.error(f"Error translating PDF: {str(e)}")
            raise


def translate_pdf_route(request):
    """Flask route handler for PDF translation"""
    try:
        # Check if files are uploaded
        if 'files' not in request.files and 'file' not in request.files:
            return jsonify({"error": "No files uploaded"}), 400
        
        # Get files (handle both 'files' and 'file' keys for compatibility)
        files = request.files.getlist('files') or [request.files.get('file')]
        files = [f for f in files if f and f.filename]
        
        if not files:
            return jsonify({"error": "No valid files selected"}), 400
        
        # Get parameters
        target_language = request.form.get('target_language', 'en')
        preserve_formatting = request.form.get('preserve_formatting', 'true').lower() == 'true'
        translate_mode = request.form.get('translate_mode', 'auto')
        
        # Validate target language
        translator = PDFTranslator()
        if target_language not in translator.language_mappings:
            return jsonify({"error": f"Unsupported target language: {target_language}"}), 400
        
        translated_files = []
        temp_files = []
        
        try:
            for file in files:
                # Check if file is PDF
                if not file.filename.lower().endswith('.pdf'):
                    return jsonify({"error": f"File {file.filename} is not a PDF"}), 400
                
                # Save uploaded file temporarily
                temp_input = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
                file.save(temp_input.name)
                temp_files.append(temp_input.name)
                
                # Translate PDF
                logger.info(f"Translating {file.filename}")
                translated_pdf_bytes = translator.translate_pdf_file(
                    temp_input.name,
                    target_language,
                    preserve_formatting,
                    translate_mode
                )
                
                # Generate output filename
                base_name = os.path.splitext(file.filename)[0]
                lang_name = translator.language_mappings.get(target_language, target_language)
                translated_filename = f"{base_name}_translated_{lang_name.lower().replace(' ', '_')}.pdf"
                
                translated_files.append({
                    'filename': translated_filename,
                    'data': translated_pdf_bytes
                })
            
            # Clean up temporary files
            for temp_file in temp_files:
                try:
                    os.unlink(temp_file)
                except:
                    pass
            
            # Return single file or zip
            if len(translated_files) == 1:
                return send_file(
                    io.BytesIO(translated_files[0]['data']),
                    mimetype='application/pdf',
                    as_attachment=True,
                    download_name=translated_files[0]['filename']
                )
            else:
                # Create zip file for multiple files
                zip_buffer = io.BytesIO()
                with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                    for file_info in translated_files:
                        zip_file.writestr(file_info['filename'], file_info['data'])
                
                zip_buffer.seek(0)
                return send_file(
                    zip_buffer,
                    mimetype='application/zip',
                    as_attachment=True,
                    download_name='translated_pdfs.zip'
                )
        
        except Exception as e:
            # Clean up temporary files on error
            for temp_file in temp_files:
                try:
                    os.unlink(temp_file)
                except:
                    pass
            raise e
            
    except Exception as e:
        logger.error(f"Translation route error: {str(e)}")
        return jsonify({"error": f"Translation failed: {str(e)}"}), 500


def setup_translation_service():
    """Setup function to initialize translation service dependencies"""
    try:
        # Register fonts for better PDF rendering
        font_paths = [
            '/System/Library/Fonts/Arial.ttf',  # macOS
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',  # Linux
            'C:\\Windows\\Fonts\\arial.ttf',  # Windows
        ]
        
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    pdfmetrics.registerFont(TTFont('Arial', font_path))
                    logger.info(f"Registered font: {font_path}")
                    break
                except:
                    continue
        
        logger.info("Translation service setup completed")
        return True
        
    except Exception as e:
        logger.error(f"Translation service setup error: {str(e)}")
        return False


# Initialize the service
setup_translation_service()