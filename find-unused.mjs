import fs from 'fs';
import path from 'path';

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else if (/\.(tsx|ts|js|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(path.join(process.cwd(), 'src'));
const importedFiles = new Set();

const importRegex = /import\s+(?:.*?\s+from\s+)?['"](.*?)['"]/g;
const dynamicImportRegex = /import\(['"](.*?)['"]\)/g;

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  
  const processMatch = (m) => {
    let importPath = m[1];
    if (importPath.startsWith('@/')) {
      importPath = importPath.replace('@/', 'src/');
    }
    if (importPath.startsWith('.') || importPath.startsWith('src/')) {
      // Resolve path
      let resolvedPath;
      if (importPath.startsWith('src/')) {
        resolvedPath = path.join(process.cwd(), importPath);
      } else {
        resolvedPath = path.resolve(path.dirname(file), importPath);
      }
      
      // Try resolving extensions
      const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js'];
      for (const ext of extensions) {
        if (fs.existsSync(resolvedPath + ext) && fs.statSync(resolvedPath + ext).isFile()) {
          importedFiles.add(path.normalize(resolvedPath + ext));
          break;
        }
      }
    }
  };

  while ((match = importRegex.exec(content)) !== null) processMatch(match);
  while ((match = dynamicImportRegex.exec(content)) !== null) processMatch(match);
});

const nextjsMagicFiles = ['page.tsx', 'layout.tsx', 'loading.tsx', 'not-found.tsx', 'error.tsx', 'route.ts'];

const unusedFiles = allFiles.filter(file => {
  const basename = path.basename(file);
  const isMagicFile = nextjsMagicFiles.includes(basename) && file.includes(path.join('src', 'app'));
  return !importedFiles.has(path.normalize(file)) && !isMagicFile;
});

console.log('Unused files:');
unusedFiles.forEach(f => console.log(f.replace(process.cwd(), '')));
