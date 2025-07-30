import fs from 'fs';
import path from 'path';

function extractDependencies(filePath: string, fileContent: string): string[] {
  const importRegex = /import(?:\s+.*\s+from)?\s+['"]([^'"]+)['"]/g;
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  const exportRegex = /export(?:\s+.*\s+from)?\s+['"]([^'"]+)['"]/g;
  const deps = new Set<string>();
  let match;

  for (const regex of [importRegex, requireRegex, exportRegex]) {
    while ((match = regex.exec(fileContent)) !== null) {
      deps.add(match[1]);
    }
  }

  return Array.from(deps).filter(dep => dep.startsWith('.') || dep.startsWith('/'));
}

function resolveDependency(fromFile: string, dep: string): string | null {
  const baseDir = path.dirname(fromFile);
  const resolvedPath = path.resolve(baseDir, dep);
  const extensions = ['.js', '.ts', '.jsx', '.tsx'];

  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
    return resolvedPath;
  }

  for (const ext of extensions) {
    if (fs.existsSync(resolvedPath + ext)) {
      return resolvedPath + ext;
    }
  }

  for (const ext of extensions) {
    const indexPath = path.join(resolvedPath, 'index' + ext);
    if (fs.existsSync(indexPath)) {
      return indexPath;
    }
  }

  return null;
}

function normalize(p: string): string {
  return path.relative(process.cwd(), p).replace(/\\/g, '/');
}

export interface GraphNode { id: string; }
export interface GraphEdge { from: string; to: string; }
export interface Graph { nodes: GraphNode[]; edges: GraphEdge[]; }

export function extractImportsFromFiles(files: string[]): Graph {
  const links: GraphEdge[] = [];
  const nodeSet = new Set<string>();
  const edgeSet = new Set<string>();

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
  return { nodes, edges };
}
