const fs = require('fs');
const path = require('path');

// Path to the file with encoding issues
const filePath = path.join(__dirname, 'pages', 'sign_pdf.js');

try {
  // Read the file content
  let fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Replace the problematic line (line 415)
  const lines = fileContent.split('\n');
  lines[414] = '            <span??</span>';
  fileContent = lines.join('\n');
  
  // Write back with proper UTF-8 encoding
  fs.writeFileSync(filePath, fileContent, {encoding: 'utf8'});
  
  console.log('File encoding fixed successfully!');
} catch (error) {
  console.error('Error fixing file encoding:', error);
}