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
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Projects/Nearby Escapes/src/components');
let changed = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('group-hover:scale-105')) {
    content = content.replace(/\bgroup-hover:scale-105\b/g, '');
    content = content.replace(/\btransition-transform\b/g, '');
    content = content.replace(/\bduration-[0-9]+\b/g, '');
    // Replace multiple spaces with a single space
    content = content.replace(/ +/g, ' ');
    // Fix spaces around quotes
    content = content.replace(/ "/g, '"');
    content = content.replace(/" /g, '"');
    fs.writeFileSync(file, content);
    changed++;
  }
});
console.log('Modified ' + changed + ' files.');
