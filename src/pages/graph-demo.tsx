import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
      <nav className="absolute top-0 left-0 w-full p-6">
        <Link href="/" legacyBehavior>
          <a className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Cartocoder
          </a>
        </Link>
      </nav>
      <main className="flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <motion.div
          className="max-w-5xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <header className="text-center mb-10">
            <h1 className="text-5xl font-bold tracking-tight">Graph Demo</h1>
            <p className="mt-3 text-lg text-gray-500">An interactive example of a dependency graph.</p>
          </header>

          <motion.section
            className="mt-12 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          >
            <header className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Sample Graph</h2>
            </header>
            <div className="p-4 bg-white">
              <GraphViewer graph={sampleGraph} width={850} height={600} />
            </div>
            <footer className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-lg mb-2">How to Interact</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li><span className="font-semibold">Click</span> a node to view its details.</li>
                <li><span className="font-semibold">Drag</span> nodes to rearrange the layout.</li>
                <li><span className="font-semibold">Zoom & Pan</span> with your mouse wheel or trackpad.</li>
              </ul>
            </footer>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default GraphDemoPage;
