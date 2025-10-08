const fs = require('fs');
const path = require('path');

// Directory containing tool pages
const toolsDir = path.join(__dirname, 'frontend', 'pages', 'tools');

// List of files to update
const filesToUpdate = [
  'convert.js',
  'convert_to_pdf.js',
  'merge.js',
  'split.js',
  'compress.js',
  'secure.js',
  // Add other tool pages as needed
];

// Process each file
filesToUpdate.forEach(filename => {
  const filePath = path.join(toolsDir, filename);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add import for useUpgrade if not already present
    if (!content.includes('import { useUpgrade }')) {
      content = content.replace(
        /import.*from.*\n/,
        match => match + 'import { useUpgrade } from "../../context/UpgradeContext";\n'
      );
    }
    
    // Remove local state for upgrade modal
    content = content.replace(/const \[showUpgradeModal, setShowUpgradeModal\] = useState\(false\);(\s+)const \[upgradeMessage, setUpgradeMessage\] = useState\('.*'\);/g, '');
    
    // Add useUpgrade hook
    if (!content.includes('const { showUpgradeModal, setUpgradeMessage }')) {
      content = content.replace(
        /export default function .*\(\) {(\s+)/,
        match => match + '  const { showUpgradeModal, setUpgradeMessage } = useUpgrade();\n\n'
      );
    }
    
    // Remove closeUpgradeModal function
    content = content.replace(/const closeUpgradeModal = \(\) => {\s+setShowUpgradeModal\(false\);\s+};/g, '');
    
    // Remove upgrade modal component at the end
    content = content.replace(/{\/\* Upgrade Modal.*\n(.*\n)*?.*<\/div>\s+<\/div>\s+\)}/g, '');
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filename}`);
  } else {
    console.log(`File not found: ${filename}`);
  }
});

console.log('All files updated successfully!');