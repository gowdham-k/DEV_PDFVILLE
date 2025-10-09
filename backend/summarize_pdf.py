from flask import request, send_file, jsonify
import os
import tempfile
import logging
from PyPDF2 import PdfReader
import fitz  # PyMuPDF
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.probability import FreqDist
from heapq import nlargest
import string
from restrictions import check_restrictions

# Disable reportlab font dependency
import reportlab.rl_config
reportlab.rl_config.warnOnMissingFontGlyphs = 0

# Configure logging
logger = logging.getLogger(__name__)

# Download NLTK resources if not already downloaded
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF using PyMuPDF for better text extraction."""
    text = ""
    try:
        # Open the PDF
        doc = fitz.open(pdf_path)
        
        # Extract text from each page
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text += page.get_text()
        
        # Close the document
        doc.close()
        
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        return ""

def preprocess_text(text):
    """Preprocess text for summarization."""
    # Tokenize into sentences
    sentences = sent_tokenize(text)
    
    # Convert to lowercase
    sentences = [sentence.lower() for sentence in sentences]
    
    # Remove punctuation and numbers
    translator = str.maketrans('', '', string.punctuation + string.digits)
    sentences = [sentence.translate(translator) for sentence in sentences]
    
    return sentences

def calculate_sentence_scores(sentences):
    """Calculate importance score for each sentence."""
    # Get stopwords
    stop_words = set(stopwords.words('english'))
    
    # Tokenize all sentences into words
    words = []
    for sentence in sentences:
        words.extend(word_tokenize(sentence))
    
    # Remove stopwords
    filtered_words = [word for word in words if word not in stop_words]
    
    # Calculate word frequency
    word_frequencies = FreqDist(filtered_words)
    
    # Normalize word frequencies
    if word_frequencies:
        max_frequency = max(word_frequencies.values())
        for word in word_frequencies:
            word_frequencies[word] = word_frequencies[word] / max_frequency
    
    # Calculate sentence scores based on word frequencies
    sentence_scores = {}
    for i, sentence in enumerate(sentences):
        for word in word_tokenize(sentence):
            if word in word_frequencies:
                if i in sentence_scores:
                    sentence_scores[i] += word_frequencies[word]
                else:
                    sentence_scores[i] = word_frequencies[word]
    
    return sentence_scores

def generate_summary(text, summary_ratio=0.3):
    """Generate a summary of the text."""
    # Preprocess text
    sentences = preprocess_text(text)
    original_sentences = sent_tokenize(text)
    
    # If there are no sentences, return empty summary
    if not sentences:
        return ""
    
    # Calculate sentence scores
    sentence_scores = calculate_sentence_scores(sentences)
    
    # Determine number of sentences for summary
    summary_size = max(1, int(len(sentences) * summary_ratio))
    
    # Get top sentences
    top_sentence_indices = nlargest(summary_size, sentence_scores, key=sentence_scores.get)
    top_sentence_indices = sorted(top_sentence_indices)
    
    # Create summary
    summary = ' '.join([original_sentences[i] for i in top_sentence_indices])
    
    return summary

def summarize_pdf(input_path, summary_ratio=0.3):
    """Summarize a PDF document."""
    try:
        # Extract text from PDF
        text = extract_text_from_pdf(input_path)
        
        # Generate summary
        summary = generate_summary(text, summary_ratio)
        
        return summary
    except Exception as e:
        logger.error(f"Error summarizing PDF: {str(e)}")
        return ""

def setup_routes(app):
    @app.route('/api/summarize_pdf', methods=['POST'])
    def api_summarize_pdf():
        try:
            # Check if user is allowed to use this feature
            restrictions_check = check_restrictions(request)
            if restrictions_check:
                return jsonify(restrictions_check), 403
            
            # Get uploaded file
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            
            # Get summary ratio (default to 0.3 - 30% of original text)
            summary_ratio = float(request.form.get('summary_ratio', 0.3))
            
            # Validate summary ratio
            if summary_ratio <= 0 or summary_ratio > 1:
                summary_ratio = 0.3
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_input:
                file.save(temp_input.name)
                
                # Generate summary
                summary = summarize_pdf(temp_input.name, summary_ratio)
                
                # Clean up
                os.unlink(temp_input.name)
                
                if not summary:
                    return jsonify({'error': 'Failed to generate summary'}), 500
                
                return jsonify({'summary': summary}), 200
                
        except Exception as e:
            logger.error(f"Error in summarize_pdf API: {str(e)}")
            return jsonify({'error': str(e)}), 500