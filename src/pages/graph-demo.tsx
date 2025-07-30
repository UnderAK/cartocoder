import React from "react";
import GraphViewer, { GraphData } from "@/components/GraphViewer";

const sampleGraph: GraphData = {
  nodes: [
    { id: "index.js" },
    { id: "utils.js" },
    { id: "config.js" },
    { id: "math.js" },
  ],
  edges: [
    { from: "index.js", to: "utils.js" },
    { from: "index.js", to: "config.js" },
    { from: "utils.js", to: "math.js" },
  ],
};

const GraphDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-6xl font-bold tracking-tighter">Graph Demo</h1>
            <p className="mt-3 text-lg text-gray-500">An interactive example of a dependency graph.</p>
          </header>

          <section className="border-2 border-black rounded-lg overflow-hidden">
            <header className="px-6 py-4 border-b-2 border-black">
              <h2 className="text-xl font-bold">Sample Graph</h2>
            </header>
            <div className="p-4 bg-white">
              <GraphViewer graph={sampleGraph} width={850} height={600} />
            </div>
            <footer className="px-6 py-4 border-t-2 border-black">
              <h3 className="text-lg font-semibold mb-3">Instructions</h3>
              <ul className="space-y-2 text-gray-600">
                <li><span className="font-semibold">Nodes:</span> All nodes are represented by white circles with a black border.</li>
                <li className="pt-2">Hover a node to highlight its connections.</li>
                <li>Click a node to view its full file path.</li>
                <li>Drag nodes to rearrange the layout.</li>
                <li>Use your mouse wheel or trackpad to zoom and pan.</li>
              </ul>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
};

export default GraphDemoPage;
