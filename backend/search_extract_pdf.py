from flask import request, jsonify
import os
import tempfile
import logging
import re
import fitz  # PyMuPDF
from restrictions import check_restrictions

logger = logging.getLogger(__name__)


def extract_text_per_page(pdf_path):
    """
    Extract plain text from each page of the PDF using PyMuPDF.
    Returns a list of strings where index is page number - 1.
    """
    texts = []
    with fitz.open(pdf_path) as doc:
        for page in doc:
            try:
                texts.append(page.get_text("text") or "")
            except Exception as e:
                logger.error(f"Failed to extract text from page {page.number+1}: {e}")
                texts.append("")
    return texts


def find_matches(text, query, context_chars=120):
    """
    Find case-insensitive matches of query in text and return list of snippets
    around each match with limited context.
    """
    if not query:
        return []
    pattern = re.compile(re.escape(query), re.IGNORECASE)
    matches = []
    for m in pattern.finditer(text):
        start = max(m.start() - context_chars, 0)
        end = min(m.end() + context_chars, len(text))
        snippet = text[start:end]
        # highlight the match by wrapping with markers
        highlighted = (
            snippet[: m.start() - start]
            + "<mark>" + snippet[m.start() - start : m.end() - start] + "</mark>"
            + snippet[m.end() - start :]
        )
        matches.append(highlighted)
    return matches


def search_extract(pdf_path, query):
    pages_text = extract_text_per_page(pdf_path)
    results = []
    total = 0
    for idx, text in enumerate(pages_text):
        page_matches = find_matches(text, query)
        if page_matches:
            results.append({
                "page": idx + 1,
                "count": len(page_matches),
                "snippets": page_matches
            })
            total += len(page_matches)
    return {"total_matches": total, "results": results}


def setup_routes(app):
    @app.route('/api/search_extract_pdf', methods=['POST'])
    def api_search_extract_pdf():
        try:
            # Restrictions check similar to summarize_pdf
            restrictions_check = check_restrictions(request)
            if restrictions_check:
                return jsonify(restrictions_check), 403

            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400

            file = request.files['file']
            query = request.form.get('query', '').strip()
            extract_all = request.form.get('extract_all', 'false').lower() == 'true'

            if not extract_all and not query:
                return jsonify({'error': 'Search query is required'}), 400

            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_input:
                file.save(temp_input.name)
                temp_path = temp_input.name

            try:
                # If only extraction requested, return full text per page
                if extract_all:
                    pages_text = extract_text_per_page(temp_path)
                    os.unlink(temp_path)
                    return jsonify({
                        'pages': [
                            {
                                'page': i + 1,
                                'text': pages_text[i]
                            } for i in range(len(pages_text))
                        ],
                        'total_pages': len(pages_text)
                    }), 200

                # Otherwise perform search and return snippets
                result = search_extract(temp_path, query)
                os.unlink(temp_path)
                return jsonify({
                    'query': query,
                    **result
                }), 200

            except Exception as e:
                # ensure temp file is removed
                try:
                    os.unlink(temp_path)
                except Exception:
                    pass
                logger.error(f"Error during search/extract: {str(e)}")
                return jsonify({'error': 'Failed to process PDF', 'details': str(e)}), 500

        except Exception as e:
            logger.error(f"Error in search_extract_pdf API: {str(e)}")
            return jsonify({'error': str(e)}), 500