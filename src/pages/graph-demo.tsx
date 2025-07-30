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
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-gray-800">Graph Demo</h1>
            <p className="mt-3 text-lg text-gray-600">An interactive example of a dependency graph.</p>
          </header>

          <section className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden">
            <header className="px-8 py-5 bg-gray-50 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Sample Code Dependency Graph</h2>
            </header>
            <div className="p-4 bg-gray-100">
              <GraphViewer graph={sampleGraph} width={850} height={600} />
            </div>
            <footer className="px-8 py-5 bg-gray-50 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Legend & Instructions</h3>
              <ul className="space-y-2 text-gray-600">
                <li><span className="inline-block w-4 h-4 rounded-full bg-blue-500 mr-2"></span><span className="font-semibold">.js file</span></li>
                <li><span className="inline-block w-4 h-4 rounded-full bg-purple-500 mr-2"></span><span className="font-semibold">.ts file</span></li>
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
