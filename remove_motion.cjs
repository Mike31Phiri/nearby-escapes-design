const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const dirsToWalk = [
  'c:/Projects/Nearby Escapes/src/components',
  'c:/Projects/Nearby Escapes/src/app'
];

let changed = 0;

dirsToWalk.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = walk(dir);
    files.forEach(file => {
      let content = fs.readFileSync(file, 'utf8');
      const originalContent = content;
      
      // Remove hover translate classes
      content = content.replace(/\bhover:-translate-y-\d+(\.\d+)?\b/g, '');
      content = content.replace(/\bgroup-hover:-translate-y-\d+(\.\d+)?\b/g, '');
      content = content.replace(/\bhover:-translate-y-\[[^\]]+\]/g, '');
      content = content.replace(/\bgroup-hover:-translate-y-\[[^\]]+\]/g, '');
      
      // Remove hover scale classes
      content = content.replace(/\bhover:scale-\d+(\.\d+)?\b/g, '');
      content = content.replace(/\bgroup-hover:scale-\d+(\.\d+)?\b/g, '');
      content = content.replace(/\bhover:scale-\[[^\]]+\]/g, '');
      content = content.replace(/\bgroup-hover:scale-\[[^\]]+\]/g, '');
      
      // Remove active scale classes
      content = content.replace(/\bactive:scale-\d+(\.\d+)?\b/g, '');
      content = content.replace(/\bactive:scale-\[[^\]]+\]/g, '');

      // Remove the specific one in styles.css if it exists but this walks .tsx
      // We will handle styles.css manually if needed

      if (content !== originalContent) {
        // Clean up double spaces left by removal
        content = content.replace(/ +/g, ' ');
        content = content.replace(/ "/g, '"');
        content = content.replace(/" /g, '"');
        
        fs.writeFileSync(file, content);
        changed++;
      }
    });
  }
});

console.log('Modified ' + changed + ' files.');
