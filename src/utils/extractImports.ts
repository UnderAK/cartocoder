import fs from 'fs';
import path from 'path';

function extractDependencies(filePath: string, fileContent: string): string[] {
  const importRegex = /import\s+(?:[^'"\n]+from\s+)?["']([^"']+)["']/g;
  const requireRegex = /require\(["']([^"']+)["']\)/g;
  const deps: string[] = [];
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

function resolveDependency(fromFile: string, dep: string): string {
  const base = path.dirname(fromFile);
  let fullPath = path.resolve(base, dep);
  if (fs.existsSync(fullPath + '.js')) return fullPath + '.js';
  if (fs.existsSync(fullPath + '.ts')) return fullPath + '.ts';
  if (fs.existsSync(fullPath + '/index.js')) return fullPath + '/index.js';
  if (fs.existsSync(fullPath + '/index.ts')) return fullPath + '/index.ts';
  if (fs.existsSync(fullPath)) return fullPath;
  return dep;
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
      const resolved = normalize(resolveDependency(file, dep));
      nodeSet.add(resolved);
      const edgeKey = `${fromNorm}->${resolved}`;
      if (!edgeSet.has(edgeKey)) {
        links.push({ from: fromNorm, to: resolved });
        edgeSet.add(edgeKey);
      }
    }
  }

  const nodes = Array.from(nodeSet).map(id => ({ id }));
  const edges = links;
  return { nodes, edges };
}
