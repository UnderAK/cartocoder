const fs = require('fs');
const path = require('path');

const SRC_PATH = path.resolve(__dirname, '../src');
const OUTPUT_PATH = path.resolve(__dirname, '../public/graph.json');

// This is a simplified version of the logic in src/utils/extractImports.ts
// adapted for a standalone Node.js script.

function extractDependencies(fileContent) {
  const importRegex = /import(?:\s+.*\s+from)?\s+['"]([^'"]+)['"]/g;
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  const deps = new Set();
  let match;

  [importRegex, requireRegex].forEach(regex => {
    while ((match = regex.exec(fileContent)) !== null) {
      // Filter for relative paths
      if (match[1].startsWith('.') || match[1].startsWith('@/')) {
        deps.add(match[1]);
      }
    }
  });

  return Array.from(deps);
}

function resolveDependency(fromFile, dependency) {
  const baseDir = path.dirname(fromFile);
  // Resolve aliases like @/components/GraphViewer
  const depPath = dependency.startsWith('@/') 
    ? path.resolve(SRC_PATH, dependency.substring(2))
    : path.resolve(baseDir, dependency);

  const extensions = ['.js', '.ts', '.jsx', '.tsx'];
  
  // Check for direct file match
  for (const ext of extensions) {
    if (fs.existsSync(depPath + ext)) {
      return depPath + ext;
    }
  }

  // Check for index file in a directory
  for (const ext of extensions) {
    const indexPath = path.join(depPath, 'index' + ext);
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }

  return null;
}

function walk(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(walk(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function generateGraph() {
  console.log('Scanning files in:', SRC_PATH);
  const allFiles = walk(SRC_PATH);
  const nodes = new Set();
  const edges = [];
  const edgeSet = new Set();

  const projectRoot = path.resolve(__dirname, '..');

  for (const file of allFiles) {
    const fromNode = path.relative(projectRoot, file).replace(/\\/g, '/');
    nodes.add(fromNode);

    try {
      const content = fs.readFileSync(file, 'utf-8');
      const dependencies = extractDependencies(content);

      for (const dep of dependencies) {
        const resolvedPath = resolveDependency(file, dep);
        if (resolvedPath) {
          const toNode = path.relative(projectRoot, resolvedPath).replace(/\\/g, '/');
          nodes.add(toNode);
          const edgeKey = `${fromNode}->${toNode}`;
          if (!edgeSet.has(edgeKey)) {
            edges.push({ from: fromNode, to: toNode });
            edgeSet.add(edgeKey);
          }
        }
      }
    } catch (error) {
      console.warn(`Could not read or parse ${file}:`, error.message);
    }
  }

  const graphData = {
    nodes: Array.from(nodes).map(id => ({ id })),
    edges: edges,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(graphData, null, 2));
  console.log(`Graph data generated successfully at ${OUTPUT_PATH}`);
  console.log(`Found ${nodes.size} nodes and ${edges.length} edges.`);
}

generateGraph();
