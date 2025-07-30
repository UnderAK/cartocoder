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
    <div style={{ padding: 32 }}>
      <h2 style={{ fontSize: 28, marginBottom: 16 }}>Sample Code Dependency Graph</h2>
      <GraphViewer graph={sampleGraph} width={700} height={500} />
      <div style={{ marginTop: 16, color: '#555' }}>
        <ul>
          <li><span style={{ color: '#3498db' }}>●</span> .js file</li>
          <li><span style={{ color: '#9b59b6' }}>●</span> .ts file</li>
          <li>Hover a node to highlight its edges.</li>
          <li>Click a node to see its file path.</li>
          <li>Drag nodes, zoom, and pan freely.</li>
        </ul>
      </div>
    </div>
  );
};

export default GraphDemoPage;
