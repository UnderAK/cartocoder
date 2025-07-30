# Cartocoder: Visual Code Dependency Mindmap

Cartocoder is a full-stack tool that lets you visualize the internal structure of any public GitHub JavaScript/TypeScript repository as an interactive mindmap. Paste a GitHub repo URL, and Cartocoder will clone the repo, scan its files, extract import/require relationships, and render a beautiful, draggable, zoomable graph of the codebase.

---

## ✨ Features
- **Paste any public GitHub repo URL** and analyze its code structure instantly
- **Automatic clone + scan:** Recursively finds all `.js` and `.ts` files (ignoring `node_modules`, `.git`, and test folders)
- **Dependency extraction:** Parses all import/require statements and builds a graph
- **Interactive mindmap:**
  - Nodes colored by file type (`.js` = blue, `.ts` = purple)
  - Drag, zoom, and pan
  - Hover a node to highlight its edges
  - Click a node to see its full file path and preview contents
  - Root file (like `index.js`) is centered
- **Export:** Download the graph as JSON
- **Sample demo:** Try the interactive graph on a hardcoded mini-repo

---

## 🛠️ Tech Stack
- **Frontend:** Next.js (React 19), TypeScript, Tailwind CSS, D3.js (for graph rendering)
- **Backend:** Next.js API routes, Node.js, TypeScript
- **Git operations:** `simple-git`
- **Dependency extraction:** Node.js script using regex

---

## 🚀 How It Works
1. **User submits a GitHub repo URL** via the frontend form
2. **Backend clones the repo** (using `simple-git`) to a temp folder
3. **Recursively scans** for `.js` and `.ts` files
4. **Extracts import/require relationships** from each file
5. **Builds a dependency graph** (`{ nodes: [...], edges: [...] }`)
6. **Frontend renders the graph** as a mindmap with D3.js
7. **User can interact** (drag, zoom, click, export JSON)

---

## 🖥️ Local Development

### 1. Clone & Install
```bash
git clone <your-fork-url>
cd cartocoder
cd cartocoder
npm install
```

### 2. Run the Dev Server
```bash
npm run dev
```
Visit [http://localhost:3000/repo-input](http://localhost:3000/repo-input) to use the full workflow.
Visit [http://localhost:3000/graph-demo](http://localhost:3000/graph-demo) to see a sample graph.

### 3. Project Structure
- `src/pages/repo-input.tsx` – Main workflow UI (paste repo URL, see graph)
- `src/pages/graph-demo.tsx` – Demo of a hardcoded graph
- `src/components/GraphViewer.tsx` – D3.js-based interactive graph viewer
- `src/pages/api/clone-repo.ts` – API route to clone & scan repos
- `src/pages/api/extract-imports.ts` – API route to extract dependencies (implement if missing)
- `scripts/extract-imports.js` – Node script for dependency extraction

---

## 📝 License
MIT

---

## 🙋‍♂️ Feedback & Contributions
Pull requests and issues are welcome! See TODOs for future improvements:
- Show real file contents in modal
- Support more file types
- Add authentication, history, etc.

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
