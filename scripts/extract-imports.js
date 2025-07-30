// Node.js script to extract import/require relationships from .js/.ts files
// Usage: node extract-imports.js <file1> <file2> ...

const fs = require('fs');
const path = require('path');

function extractDependencies(filePath, fileContent) {
  const importRegex = /import\s+(?:[^'"\n]+from\s+)?["']([^"']+)["']/g;
  const requireRegex = /require\(["']([^"']+)["']\)/g;
  const deps = [];
  let match;
  while ((match = importRegex.exec(fileContent)) !== null) {
    deps.push(match[1]);
  }
  while ((match = requireRegex.exec(fileContent)) !== null) {
    deps.push(match[1]);
  }
  // Only keep relative imports (local files)
  return deps.filter(dep => dep.startsWith('./') || dep.startsWith('../'));
}

function resolveDependency(fromFile, dep) {
  // Try to resolve .js/.ts extensions, index files, etc.
  const base = path.dirname(fromFile);
  let fullPath = path.resolve(base, dep);
  if (fs.existsSync(fullPath + '.js')) return fullPath + '.js';
  if (fs.existsSync(fullPath + '.ts')) return fullPath + '.ts';
  if (fs.existsSync(fullPath + '/index.js')) return fullPath + '/index.js';
  if (fs.existsSync(fullPath + '/index.ts')) return fullPath + '/index.ts';
  if (fs.existsSync(fullPath)) return fullPath;
  return dep; // fallback: unresolved
}

function normalize(p) {
  return path.relative(process.cwd(), p).replace(/\\/g, '/');
}

function main() {
  const files = process.argv.slice(2);
  const links = [];
  const nodeSet = new Set();
  const edgeSet = new Set();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const deps = extractDependencies(file, content);
    const fromNorm = normalize(file);
    nodeSet.add(fromNorm);
    for (const dep of deps) {
      const resolved = normalize(resolveDependency(file, dep));
      nodeSet.add(resolved);
      // Edge key for deduplication
      const edgeKey = `${fromNorm}->${resolved}`;
      if (!edgeSet.has(edgeKey)) {
        links.push({ from: fromNorm, to: resolved });
        edgeSet.add(edgeKey);
      }
    }
  }

  const nodes = Array.from(nodeSet).map(id => ({ id }));
  const edges = links;
  console.log(JSON.stringify({ nodes, edges }, null, 2));
}

main();
