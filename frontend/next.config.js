// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Organize PDF
      { source: '/split_pdf', destination: '/tools/split' },
      { source: '/merge_pdf', destination: '/tools/merge' },

      // Optimize PDF
      { source: '/compress_pdf', destination: '/tools/compress' },

      // Convert PDF
      { source: '/convert_pdf', destination: '/tools/convert' },
      { source: '/pdf_to_jpg', destination: '/tools/convert?format=jpg' },
      { source: '/pdf_to_png', destination: '/tools/convert?format=png' },
      { source: '/pdf_to_ppt', destination: '/tools/convert?format=ppt' },
      { source: '/pdf_to_excel', destination: '/tools/convert?format=excel' },
      { source: '/pdf_to_word', destination: '/tools/convert?format=word' },
      { source: '/pdf_to_html', destination: '/tools/convert?format=html' },

      // 🔥 NEW: Shortcuts for converting TO PDF
      {source: '/convert_to_pdf', destination: '/tools/convert_to_pdf'},
      { source: '/jpg_to_pdf', destination: '/tools/convert_to_pdf?format=jpg' },
      { source: '/png_to_pdf', destination: '/tools/convert_to_pdf?format=png' },
      { source: '/word_to_pdf', destination: '/tools/convert_to_pdf?format=word' },
      { source: '/excel_to_pdf', destination: '/tools/convert_to_pdf?format=excel' },
      { source: '/ppt_to_pdf', destination: '/tools/convert_to_pdf?format=ppt' },
      { source: '/html_to_pdf', destination: '/tools/convert_to_pdf?format=html' },

      // Secure PDF
      { source: '/pdf_secure', destination: '/tools/secure' },
    ];
  },
};

module.exports = nextConfig;
