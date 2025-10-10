import os, io, tempfile, zipfile
from flask import request, jsonify, send_file
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
import fitz  # PyMuPDF
from pdf2image import convert_from_bytes
import pytesseract
from restrictions import check_summarize_pdf_restrictions, check_premium_only_feature

# --- Core helpers ---

def _extract_pages_text(pdf_bytes):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages = []
    for i in range(len(doc)):
        t = doc.load_page(i).get_text("text")
        pages.append(t or "")
    doc.close()
    return pages

def _ocr_pages_text(pdf_bytes, dpi=300, language='eng'):
    images = convert_from_bytes(pdf_bytes, dpi=dpi)
    pages = []
    for img in images:
        pages.append(pytesseract.image_to_string(img, lang=language))
    return pages

def _summarize(text, max_sentences=8):
    # Simple frequency-based summarizer (no external models)
    import re
    sentences = [s.strip() for s in re.split(r'[\.!?]\s+', text) if s.strip()]
    if not sentences:
        return "No textual content found."
    words = re.findall(r"[A-Za-z0-9']+", text.lower())
    stop = set("the a an and or if in on at of for to from with without into within between among over under is are was were be been being this that these those it its as by we you they he she their our your his her one two three four five six seven eight nine ten".split())
    freq = {}
    for w in words:
        if w not in stop:
            freq[w] = freq.get(w, 0)+1
    scores = []
    for s in sentences:
        sw = re.findall(r"[A-Za-z0-9']+", s.lower())
        score = sum(freq.get(w,0) for w in sw)
        scores.append(score)
    # pick top N sentences but keep original order
    idxs = sorted(range(len(sentences)), key=lambda i: scores[i], reverse=True)[:max_sentences]
    idxs.sort()
    selected = ["• " + sentences[i] for i in idxs]
    return "\n".join(selected)

def _search_matches(pages, query, max_snippets=3):
    q = (query or '').strip()
    if not q:
        return []
    res = []
    ql = q.lower()
    for i,p in enumerate(pages):
        lower = p.lower()
        if ql in lower:
            # collect small context snippets around matches
            snippets = []
            start = 0
            while len(snippets) < max_snippets:
                pos = lower.find(ql, start)
                if pos == -1:
                    break
                s = max(0, pos-60); e = min(len(p), pos+60)
                snippets.append(p[s:e].replace('\n',' '))
                start = pos+len(q)
            res.append({"page": i+1, "count": lower.count(ql), "snippets": snippets})
    return res

def _make_summary_page(summary_text, title="PDF Summary"):
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf").name
    doc = SimpleDocTemplate(tmp, pagesize=letter, rightMargin=36,leftMargin=36,topMargin=36,bottomMargin=36)
    styles = getSampleStyleSheet()
    story = [Paragraph(f"<b>{title}</b>", styles['Title']), Spacer(1, 0.25*inch)]
    for para in summary_text.split('\n'):
        story.append(Paragraph(para, styles['BodyText']))
        story.append(Spacer(1, 0.1*inch))
    doc.build(story)
    return tmp

def _append_summary(original_bytes, summary_pdf_path):
    in_reader = PdfReader(io.BytesIO(original_bytes))
    sum_reader = PdfReader(summary_pdf_path)
    writer = PdfWriter()
    for p in in_reader.pages:
        writer.add_page(p)
    for p in sum_reader.pages:
        writer.add_page(p)
    out_buf = io.BytesIO()
    writer.write(out_buf)
    out_buf.seek(0)
    return out_buf

# --- Routes installer ---

def setup_summarize_pdf_routes(app):
    @app.route('/api/pdf-summarize-preview', methods=['POST'])
    def pdf_summarize_preview():
        if 'file' not in request.files:
            return jsonify({"error":"No file uploaded"}), 400
        f = request.files['file']
        filename = secure_filename(f.filename or 'document.pdf')
        email = request.form.get('email','')
        query = request.form.get('query','')
        enable_ocr = request.form.get('enable_ocr','auto')  # auto|on|off

        # temp save for restrictions
        with tempfile.TemporaryDirectory() as td:
            p = os.path.join(td, filename)
            f.save(p)
            f.seek(0)
            r = check_summarize_pdf_restrictions(email, [p])
            if r:
                return jsonify({"error": r}), 403
        pdf_bytes = f.read()
        pages = _extract_pages_text(pdf_bytes)
        if sum(len(t) for t in pages) < 200 and enable_ocr in ('auto','on'):
            pages = _ocr_pages_text(pdf_bytes)
        summary = _summarize("\n".join(pages))
        matches = _search_matches(pages, query)
        return jsonify({"summary": summary, "matches": matches, "pages": len(pages)})

    @app.route('/api/pdf-summarize', methods=['POST'])
    def pdf_summarize_route():
        if 'file' not in request.files:
            return jsonify({"error":"No file uploaded"}), 400
        f = request.files['file']
        filename = secure_filename(f.filename or 'document.pdf')
        email = request.form.get('email','')
        query = request.form.get('query','')
        enable_ocr = request.form.get('enable_ocr','auto')

        # restrictions
        with tempfile.TemporaryDirectory() as td:
            p = os.path.join(td, filename)
            f.save(p)
            f.seek(0)
            r = check_summarize_pdf_restrictions(email, [p])
            if r:
                return jsonify({"error": r}), 403
        pdf_bytes = f.read()
        pages = _extract_pages_text(pdf_bytes)
        if sum(len(t) for t in pages) < 200 and enable_ocr in ('auto','on'):
            pages = _ocr_pages_text(pdf_bytes)
        # build summary text with optional search highlight count
        summary = _summarize("\n".join(pages))
        if query.strip():
            matches = _search_matches(pages, query)
            total_hits = sum(m['count'] for m in matches)
            if total_hits:
                summary = f"Search hits for '{query}': {total_hits}\n\n" + summary
        sum_pdf = _make_summary_page(summary)
        out_buf = _append_summary(pdf_bytes, sum_pdf)
        out_name = f"summarized_{filename}"
        return send_file(out_buf, as_attachment=True, download_name=out_name, mimetype='application/pdf')

    # Premium AI endpoints
    @app.route('/api/pdf-summarize-ai-preview', methods=['POST'])
    def pdf_summarize_ai_preview():
        if 'file' not in request.files:
            return jsonify({"error":"No file uploaded"}), 400
        f = request.files['file']
        filename = secure_filename(f.filename or 'document.pdf')
        email = request.form.get('email','')
        query = request.form.get('query','')
        enable_ocr = request.form.get('enable_ocr','auto')  # auto|on|off

        # premium gating
        with tempfile.TemporaryDirectory() as td:
            p = os.path.join(td, filename)
            f.save(p)
            f.seek(0)
            r = check_premium_only_feature(email, [p])
            if r:
                return jsonify(r), 403
        pdf_bytes = f.read()
        pages = _extract_pages_text(pdf_bytes)
        if sum(len(t) for t in pages) < 200 and enable_ocr in ('auto','on'):
            pages = _ocr_pages_text(pdf_bytes)
        summary = _ai_summarize("\n".join(pages))
        matches = _search_matches(pages, query)
        return jsonify({"summary": summary, "matches": matches, "pages": len(pages), "ai": True})

    @app.route('/api/pdf-summarize-ai', methods=['POST'])
    def pdf_summarize_ai_route():
        if 'file' not in request.files:
            return jsonify({"error":"No file uploaded"}), 400
        f = request.files['file']
        filename = secure_filename(f.filename or 'document.pdf')
        email = request.form.get('email','')
        query = request.form.get('query','')
        enable_ocr = request.form.get('enable_ocr','auto')

        # premium gating
        with tempfile.TemporaryDirectory() as td:
            p = os.path.join(td, filename)
            f.save(p)
            f.seek(0)
            r = check_premium_only_feature(email, [p])
            if r:
                return jsonify(r), 403
        pdf_bytes = f.read()
        pages = _extract_pages_text(pdf_bytes)
        if sum(len(t) for t in pages) < 200 and enable_ocr in ('auto','on'):
            pages = _ocr_pages_text(pdf_bytes)
        summary = _ai_summarize("\n".join(pages))
        if query.strip():
            matches = _search_matches(pages, query)
            total_hits = sum(m['count'] for m in matches)
            if total_hits:
                summary = f"Search hits for '{query}': {total_hits}\n\n" + summary
        sum_pdf = _make_summary_page(summary, title="PDF Summary (AI)")
        out_buf = _append_summary(pdf_bytes, sum_pdf)
        out_name = f"summarized_ai_{filename}"
        return send_file(out_buf, as_attachment=True, download_name=out_name, mimetype='application/pdf')


def _ai_summarize(text, model_name=None, min_length=64, max_length=256):
    """
    AI-based summarization using Hugging Face transformers.
    Chunks long text to stay within model limits and concatenates summaries.
    """
    try:
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
        # Prefer a lighter model by default to reduce memory and load time
        selected_model = model_name or "sshleifer/distilbart-cnn-12-6"

        # Explicitly disable meta-device init and force CPU to avoid meta tensor errors
        tokenizer = AutoTokenizer.from_pretrained(selected_model)
        model = AutoModelForSeq2SeqLM.from_pretrained(
            selected_model,
            low_cpu_mem_usage=False  # avoid meta tensor init
        )
        summarizer = pipeline("summarization", model=model, tokenizer=tokenizer, device=-1)  # CPU

        # Chunk text by approximate character count to avoid exceeding model limits
        import re
        sentences = [s.strip() for s in re.split(r'[\.!?]\s+', text) if s.strip()]
        chunks = []
        buf = []
        cur_len = 0
        for s in sentences:
            buf.append(s)
            cur_len += len(s)
            if cur_len > 1500:  # heuristic chunk size
                chunks.append(" ".join(buf))
                buf = []
                cur_len = 0
        if buf:
            chunks.append(" ".join(buf))
        outputs = []
        for ch in chunks[:8]:  # limit number of chunks for performance
            out = summarizer(ch, min_length=min_length, max_length=max_length)
            outputs.append(out[0]['summary_text'])
        if not outputs:
            return "No textual content found."
        return "\n".join("• " + o for o in outputs)
    except Exception as e:
        return f"AI summarization error: {str(e)}"