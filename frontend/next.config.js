// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add image optimization
  images: {
    domains: ['pdfville.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Add performance optimizations
  swcMinify: true,
  
  // Add proper headers for SEO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ],
      },
    ]
  },
  
  async rewrites() {
    return [
      // ===== EXISTING REWRITES =====
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

      // Shortcuts for converting TO PDF
      { source: '/convert_to_pdf', destination: '/tools/convert_to_pdf' },
      { source: '/jpg_to_pdf', destination: '/tools/convert_to_pdf?format=jpg' },
      { source: '/png_to_pdf', destination: '/tools/convert_to_pdf?format=png' },
      { source: '/word_to_pdf', destination: '/tools/convert_to_pdf?format=word' },
      { source: '/excel_to_pdf', destination: '/tools/convert_to_pdf?format=excel' },
      { source: '/ppt_to_pdf', destination: '/tools/convert_to_pdf?format=ppt' },
      { source: '/html_to_pdf', destination: '/tools/convert_to_pdf?format=html' },

      // Secure PDF
      { source: '/pdf_secure', destination: '/tools/secure' },

      // ===== NEW SEO REDIRECTS =====
      
      // UNLOCK PDF VARIANTS
      { source: '/pdf_to_unlock', destination: '/unlock_pdf' },
      { source: '/pdf_file_unlocked', destination: '/unlock_pdf' },
      { source: '/pdf_password_unlock', destination: '/unlock_pdf' },
      { source: '/pdf_unlock_without_password', destination: '/unlock_pdf' },
      { source: '/pdf_unlocker_free', destination: '/unlock_pdf' },
      { source: '/unlock_a_pdf', destination: '/unlock_pdf' },
      { source: '/pdf_lock_remover', destination: '/unlock_pdf' },
      
      // REMOVE PAGES VARIANTS
      { source: '/pdf_pages_remover', destination: '/remove_pages' },
      { source: '/pdf_remove_pages', destination: '/remove_pages' },
      { source: '/pdf_page_remover_online', destination: '/remove_pages' },
      { source: '/remove_pages_pdf', destination: '/remove_pages' },
      { source: '/remove_page_from_pdf_document', destination: '/remove_pages' },
      { source: '/pdf_remover', destination: '/remove_pages' },
      
      // EDIT PDF VARIANTS
      { source: '/pdf_editor', destination: '/edit_pdf' },
      { source: '/online_pdf_editor', destination: '/edit_pdf' },
      { source: '/pdf_editor_free', destination: '/edit_pdf' },
      { source: '/pdf_editor_online_free', destination: '/edit_pdf' },
      { source: '/pdf_file_editor', destination: '/edit_pdf' },
      { source: '/pdf_online_editor_free', destination: '/edit_pdf' },
      { source: '/pdf_editor_online', destination: '/edit_pdf' },
      { source: '/pdf_page_editor', destination: '/edit_pdf' },
      { source: '/pdf_free_editor', destination: '/edit_pdf' },
      { source: '/editor_free_pdf', destination: '/edit_pdf' },
      { source: '/edit_pdf_online_free_online', destination: '/edit_pdf' },
      { source: '/pdf_editing_in_online', destination: '/edit_pdf' },
      { source: '/edit_the_pdf_file_online_free', destination: '/edit_pdf' },
      { source: '/modify_a_pdf_online_free', destination: '/edit_pdf' },
      { source: '/modifier_pdf_online', destination: '/edit_pdf' },
      { source: '/pdf_modifier_online', destination: '/edit_pdf' },
      { source: '/edit_pdf_documents_adobe', destination: '/edit_pdf' },
      { source: '/edit_a_pdf_document_with_adobe_acrobat_pro', destination: '/edit_pdf' },
      { source: '/foxit_edit_pdf', destination: '/edit_pdf' },
      { source: '/edit_pdf_with_adobe_reader', destination: '/edit_pdf' },
      { source: '/pdf_editor_i_love_pdf', destination: '/edit_pdf' },
      { source: '/pdf_editor_canva', destination: '/edit_pdf' },
      { source: '/canva_pdf_editor', destination: '/edit_pdf' },
      { source: '/pdf_image_editor', destination: '/edit_pdf' },
      
      // ROTATE PDF VARIANTS
      { source: '/pdf_rotate_online', destination: '/rotate_pdf' },
      
      // SCAN PDF VARIANTS
      { source: '/pdf_scanner', destination: '/scan_pdf' },
      
      // PAGE NUMBERS VARIANTS
      { source: '/pdf_page_add', destination: '/pdf_add_page_numbers' },
      
      // PDF TO PDFA VARIANTS
      { source: '/pdf_to_pdf', destination: '/pdf_to_pdfa' },
      
      // COMPRESS VARIANTS
      { source: '/pdf_file_compressor', destination: '/tools/compress' },
      { source: '/pdf_reduce_size', destination: '/tools/compress' },
      { source: '/pdf_resize', destination: '/tools/compress' },
      { source: '/pdf_compressor_online', destination: '/tools/compress' },
      { source: '/pdf_file_size_reducer', destination: '/tools/compress' },
      { source: '/pdf_resize_in_kb', destination: '/tools/compress' },
      { source: '/pdf_size_reducer_online', destination: '/tools/compress' },
      { source: '/pdf_size_converter', destination: '/tools/compress' },
      { source: '/pdf_100_kb', destination: '/tools/compress' },
      { source: '/pdf_compressor_to_500kb', destination: '/tools/compress' },
      { source: '/pdf_500kb', destination: '/tools/compress' },
      { source: '/pdf_compressor_to_1mb', destination: '/tools/compress' },
      { source: '/pdf_kb_reducer', destination: '/tools/compress' },
      { source: '/pdf_1_mb', destination: '/tools/compress' },
      { source: '/pdf_size_decrease', destination: '/tools/compress' },
      { source: '/pdf_mb_to_kb_converter', destination: '/tools/compress' },
      { source: '/pdf_reduce_file_size', destination: '/tools/compress' },
      { source: '/pdf_under_200kb', destination: '/tools/compress' },
      { source: '/pdf_mb_reducer', destination: '/tools/compress' },
      { source: '/pdf_document_compression', destination: '/tools/compress' },
      { source: '/compress_pdf_doc', destination: '/tools/compress' },
      { source: '/pdf_to_pdf_compress', destination: '/tools/compress' },
      { source: '/reduce_size_of_pdf_doc', destination: '/tools/compress' },
      { source: '/pdf_doc_size_reducer', destination: '/tools/compress' },
      { source: '/how_to_reduce_file_size_of_pdf', destination: '/tools/compress' },
      { source: '/how_to_reduce_file_size_pdf', destination: '/tools/compress' },
      { source: '/how_to_make_a_pdf_document_smaller', destination: '/tools/compress' },
      { source: '/how_to_make_pdf_document_smaller', destination: '/tools/compress' },
      { source: '/pdf_resize_online', destination: '/tools/compress' },
      
      // SPLIT VARIANTS
      { source: '/pdf_split', destination: '/tools/split' },
      { source: '/pdf_split_pages', destination: '/tools/split' },
      { source: '/pdf_cutter', destination: '/tools/split' },
      { source: '/pdf_page_cutter', destination: '/tools/split' },
      { source: '/pdf_splitter_online', destination: '/tools/split' },
      { source: '/pdf_breaker', destination: '/tools/split' },
      { source: '/splitter_pdf', destination: '/tools/split' },
      { source: '/pdf_pdf_splitter', destination: '/tools/split' },
      
      // MERGE VARIANTS
      { source: '/pdf_combiner', destination: '/tools/merge' },
      { source: '/pdf_joiner', destination: '/tools/merge' },
      { source: '/pdf_merge_online', destination: '/tools/merge' },
      { source: '/pdf_merge_online_free', destination: '/tools/merge' },
      { source: '/pdf_add', destination: '/tools/merge' },
      { source: '/pdf_join', destination: '/tools/merge' },
      { source: '/pdf_join_online', destination: '/tools/merge' },
      { source: '/pdf_combine_files', destination: '/tools/merge' },
      { source: '/combine_pdf', destination: '/tools/merge' },
      { source: '/pdf_doc_merge', destination: '/tools/merge' },
      { source: '/pdf_doc_merger', destination: '/tools/merge' },
      { source: '/pdf_emerg', destination: '/tools/merge' },
      { source: '/pdf_merger_for_free', destination: '/tools/merge' },
      { source: '/combiner_pdf', destination: '/tools/merge' },
      { source: '/adobe_combine_pdf', destination: '/tools/merge' },
      
      // CONVERT GENERAL VARIANTS
      { source: '/pdf_converter', destination: '/tools/convert' },
      { source: '/pdf_image', destination: '/tools/convert' },
      { source: '/pdf_converter_online', destination: '/tools/convert' },
      { source: '/pdf_converter_to_word_free', destination: '/tools/convert' },
      
      // CONVERT FROM PDF VARIANTS
      { source: '/pdf_to_png_converter', destination: '/tools/convert?format=png' },
      { source: '/pdf_to_ppt_converter', destination: '/tools/convert?format=ppt' },
      { source: '/pdf_into_ppt', destination: '/tools/convert?format=ppt' },
      { source: '/pdf_convert_to_word', destination: '/tools/convert?format=word' },
      { source: '/pdf_to_doc', destination: '/tools/convert?format=word' },
      { source: '/pdf_word', destination: '/tools/convert?format=word' },
      { source: '/pdf_jpg', destination: '/tools/convert?format=jpg' },
      { source: '/pdf_jpg_converter', destination: '/tools/convert?format=jpg' },
      { source: '/pdf_2_jpg', destination: '/tools/convert?format=jpg' },
      { source: '/pdf_as_jpeg', destination: '/tools/convert?format=jpg' },
      { source: '/pdf_to_text_converter', destination: '/tools/convert?format=text' },
      { source: '/pdf_convert_to_excel', destination: '/tools/convert?format=excel' },
      { source: '/pdf_to_excel_format', destination: '/tools/convert?format=excel' },
      { source: '/pdf_into_excel', destination: '/tools/convert?format=excel' },
      { source: '/pdf_2_excel', destination: '/tools/convert?format=excel' },
      { source: '/pdf_to_excel_to_converter', destination: '/tools/convert?format=excel' },
      { source: '/pdf_file_convert_to_word', destination: '/tools/convert?format=word' },
      { source: '/transport_pdf_to_word', destination: '/tools/convert?format=word' },
      { source: '/transform_pdf_file_to_word', destination: '/tools/convert?format=word' },
      { source: '/how_do_you_change_a_pdf_document_to_word', destination: '/tools/convert?format=word' },
      { source: '/pdf_to_docx', destination: '/tools/convert?format=word' },
      { source: '/pdf_to_powerpoint', destination: '/tools/convert?format=ppt' },
      { source: '/how_to_convert_pdf_in_jpg', destination: '/tools/convert?format=jpg' },
      { source: '/doc_for_pdf', destination: '/tools/convert?format=word' },
      { source: '/pdf_in_document_word', destination: '/tools/convert?format=word' },
      { source: '/to_convert_pdf_to_word_free', destination: '/tools/convert?format=word' },
      { source: '/pdf_export_to_word_free', destination: '/tools/convert?format=word' },
      { source: '/pdf_a_text', destination: '/tools/convert?format=text' },
      { source: '/pdf_convert_to_png', destination: '/tools/convert?format=png' },
      { source: '/pdf_to_epub', destination: '/tools/convert?format=epub' },
      { source: '/adobe_acrobat_pdf_to_word_converter', destination: '/tools/convert?format=word' },
      { source: '/pdf_to_adobe_reader_converter', destination: '/tools/convert' },
      { source: '/software_pdf_excel_converter', destination: '/tools/convert?format=excel' },
      
      // CONVERT TO PDF VARIANTS
      { source: '/jpg_to_pdf_convert', destination: '/tools/convert_to_pdf?format=jpg' },
      { source: '/photo_into_pdf', destination: '/tools/convert_to_pdf?format=jpg' },
      { source: '/photo_pdf', destination: '/tools/convert_to_pdf?format=jpg' },
      { source: '/change_jpg_pdf', destination: '/tools/convert_to_pdf?format=jpg' },
      { source: '/changing_a_jpeg_to_a_pdf', destination: '/tools/convert_to_pdf?format=jpg' },
      { source: '/how_do_you_convert_jpg_to_pdf', destination: '/tools/convert_to_pdf?format=jpg' },
      { source: '/docx_to_pdf', destination: '/tools/convert_to_pdf?format=word' },
      { source: '/converting_a_word_doc_to_pdf', destination: '/tools/convert_to_pdf?format=word' },
      { source: '/word_convert_into_pdf', destination: '/tools/convert_to_pdf?format=word' },
      { source: '/word_into_pdf_convert', destination: '/tools/convert_to_pdf?format=word' },
      { source: '/docx_for_pdf', destination: '/tools/convert_to_pdf?format=word' },
      { source: '/convert_pics_to_pdf', destination: '/tools/convert_to_pdf?format=jpg' },
      { source: '/convert_a_png_file_to_pdf', destination: '/tools/convert_to_pdf?format=png' },
      { source: '/conversion_png_pdf', destination: '/tools/convert_to_pdf?format=png' },
      { source: '/convert_word_to_adobe_acrobat_pdf', destination: '/tools/convert_to_pdf?format=word' },
      { source: '/adobe_acrobat_convert_jpg_to_pdf', destination: '/tools/convert_to_pdf?format=jpg' },
      { source: '/picture_to_pdf', destination: '/tools/convert_to_pdf?format=jpg' },
      { source: '/pptx_a_pdf', destination: '/tools/convert_to_pdf?format=ppt' },
      { source: '/epub_into_pdf', destination: '/tools/convert_to_pdf?format=epub' },
      { source: '/pictures_into_pdf', destination: '/tools/convert_to_pdf?format=jpg' },
      { source: '/ooxml_to_pdf', destination: '/tools/convert_to_pdf?format=word' },
      { source: '/pdf_html_to_pdf', destination: '/tools/convert_to_pdf?format=html' },
      
      // SECURE/PROTECT VARIANTS
      { source: '/pdf_password_protector', destination: '/tools/secure' },
      { source: '/pdf_lock', destination: '/tools/secure' },
      { source: '/pdf_password', destination: '/tools/secure' },
      { source: '/how_to_remove_password_pdf_document', destination: '/tools/secure' },
      { source: '/protect_pdf', destination: '/tools/secure' },
      
      // SIGN PDF VARIANTS (if you have sign_pdf page)
      { source: '/pdf_signature', destination: '/sign_pdf' },
      { source: '/pdf_digital_signature', destination: '/sign_pdf' },
      { source: '/signature_on_pdf', destination: '/sign_pdf' },
      { source: '/signed_pdf', destination: '/sign_pdf' },
      { source: '/pdf_sign', destination: '/sign_pdf' },
      { source: '/how_do_you_sign_a_pdf', destination: '/sign_pdf' },
      { source: '/how_to_sign_a_document_pdf', destination: '/sign_pdf' },
      { source: '/how_to_e_sign_pdf_document', destination: '/sign_pdf' },
      { source: '/how_to_electronic_signature_on_pdf', destination: '/sign_pdf' },
      
      // OCR VARIANTS (if you add OCR functionality)
      { source: '/pdf_ocr', destination: '/scan_pdf' },
      { source: '/pdf_ocr_converter', destination: '/scan_pdf' },
      
      // EXTRACT/ORGANIZE VARIANTS
      { source: '/pdf_page_extractor', destination: '/tools/split' },
      { source: '/pdf_extract', destination: '/tools/split' },
      { source: '/pdf_organizer', destination: '/edit_pdf' },
      { source: '/pdf_arranger', destination: '/edit_pdf' },
      
      // WATERMARK VARIANTS
      { source: '/pdf_watermark_remover', destination: '/pdf_add_watermark' },
      
      // OTHER TOOL VARIANTS
      { source: '/pdf_crop', destination: '/edit_pdf' },
      { source: '/pdf_filler', destination: '/edit_pdf' },
      { source: '/pdf_highlighter', destination: '/edit_pdf' },
      { source: '/pdf_enhancer', destination: '/edit_pdf' },
      
      // GENERIC PDF VIEWERS/READERS
      { source: '/pdf_viewer', destination: '/' },
      { source: '/pdf_viewer_online', destination: '/' },
      { source: '/pdf_online', destination: '/' },
      { source: '/pdf_doc_viewer', destination: '/' },
      
      // I LOVE PDF VARIANTS
      { source: '/i_love_pdf', destination: '/' },
      { source: '/i_lovely_pdf', destination: '/' },
      { source: '/love_pdf', destination: '/' },
    ];
  },
};

module.exports = nextConfig;