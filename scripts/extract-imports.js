// Node.js script to extract import/require relationships from .js/.ts files
// Usage: node extract-imports.js <file1> <file2> ...

const fs = require('fs');
const path = require('path');

function extractDependencies(filePath, fileContent) {
  const importRegex = /import(?:\s+.*\s+from)?\s+['"]([^'"]+)['"]/g;
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  const exportRegex = /export(?:\s+.*\s+from)?\s+['"]([^'"]+)['"]/g;
  const deps = new Set();
  let match;

  for (const regex of [importRegex, requireRegex, exportRegex]) {
    while ((match = regex.exec(fileContent)) !== null) {
      deps.add(match[1]);
    }
  }

  return Array.from(deps).filter(dep => dep.startsWith('.') || dep.startsWith('/'));
}

function resolveDependency(fromFile, dep) {
  const baseDir = path.dirname(fromFile);
  const resolvedPath = path.resolve(baseDir, dep);
  const extensions = ['.js', '.ts', '.jsx', '.tsx'];

  // Case 1: Direct file match
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
    return resolvedPath;
  }

  // Case 2: File with extension
  for (const ext of extensions) {
    if (fs.existsSync(resolvedPath + ext)) {
      return resolvedPath + ext;
    }
  }

  // Case 3: Directory with index file
  for (const ext of extensions) {
    const indexPath = path.join(resolvedPath, 'index' + ext);
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }

  // Fallback: return original dependency if not resolved
  return null;
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
      const resolved = resolveDependency(file, dep);
      if (resolved) {
        const toNorm = normalize(resolved);
        nodeSet.add(toNorm);
        const edgeKey = `${fromNorm}->${toNorm}`;
        if (!edgeSet.has(edgeKey)) {
          links.push({ from: fromNorm, to: toNorm });
          edgeSet.add(edgeKey);
        }
      }
    }
  }

  const nodes = Array.from(nodeSet).map(id => ({ id }));
  const edges = links;
  console.log(JSON.stringify({ nodes, edges }, null, 2));
}

main();
