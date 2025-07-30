import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

export interface GraphNode {
  id: string;
  x?: number;
  y?: number;
}
export interface GraphEdge {
  from: string;
  to: string;
}
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface GraphViewerProps {
  graph: GraphData;
  width?: number;
  height?: number;
}

// If type errors persist for d3, ensure @types/d3 is installed

const GraphViewer: React.FC<GraphViewerProps> = ({ graph, width = 800, height = 600 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Helper to color nodes by file type
  function getNodeColor(id: string): string {
    if (id.endsWith('.js')) return '#3498db'; // blue
    if (id.endsWith('.ts')) return '#9b59b6'; // purple
    return '#69b3a2';
  }

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Add zoom/pan behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        svg.select('g#graph-group').attr('transform', event.transform);
      });
    svg.call(zoom as any);

    // Main group for pan/zoom
    const g = svg.append('g').attr('id', 'graph-group');

    // Prepare data
    const nodes = graph.nodes.map((d) => ({ ...d }));
    const nodeById = new Map(nodes.map((n) => [n.id, n]));
    const links = graph.edges.map((e) => ({ source: e.from, target: e.to }));

    // Find root node (index.js or first node)
    const rootId = nodes.find(n => n.id.endsWith('index.js'))?.id || nodes[0]?.id;
    // D3 force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Center root node after simulation stabilizes
    simulation.on('end', () => {
      if (rootId) {
        const rootNode = nodes.find((n: any) => n.id === rootId);
        if (rootNode) {
          const dx = width / 2 - (rootNode.x ?? 0);
          const dy = height / 2 - (rootNode.y ?? 0);
          nodes.forEach((n: any) => {
            n.x += dx;
            n.y += dy;
          });
          simulation.alpha(0.1).restart();
        }
      }
    });

    // Draw links
    const link = g.append("g")
      .attr("stroke", "#aaa")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", 2)
      .attr("class", (d: any) => `link-from-${d.source.id} link-to-${d.target.id}`);

    // Draw nodes
    const node = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 18)
      .attr("fill", (d: any) => getNodeColor(d.id))
      .on("mouseover", (event: any, d: any) => {
        setHoveredNode(d.id);
      })
      .on("mouseout", () => {
        setHoveredNode(null);
      })
      .on("click", (event: any, d: any) => {
        setSelectedNode(d.id);
        setModalOpen(true);
      })
      .call(d3.drag<any, any>()
        .on("start", (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event: any, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Add labels
    // Add labels
    const label = g.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.id.split("/").pop() || d.id)
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("pointer-events", "none")
      .style("font-size", "12px");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)
        .attr("stroke", (d: any) => {
          if (
            hoveredNode &&
            (d.source.id === hoveredNode || d.target.id === hoveredNode)
          ) {
            return "#f39c12";
          }
          return "#aaa";
        })
        .attr("stroke-width", (d: any) => {
          if (
            hoveredNode &&
            (d.source.id === hoveredNode || d.target.id === hoveredNode)
          ) {
            return 4;
          }
          return 2;
        });

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y)
        .attr("fill", (d: any) =>
          hoveredNode && d.id === hoveredNode
            ? "#f39c12"
            : getNodeColor(d.id)
        );

      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [graph, width, height]);

  return (
    <>
      <svg ref={svgRef} width={width} height={height} style={{ border: "1px solid #ccc", background: "#fff" }} />
      {modalOpen && selectedNode && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 360,
              maxWidth: "80vw",
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 12 }}>File: {selectedNode}</h3>
            <pre style={{ maxHeight: 400, overflow: "auto", background: "#f5f5f5", padding: 12 }}>
              {/* Placeholder for file content */}
              File content preview coming soon...
            </pre>
            <button
              style={{ marginTop: 16, padding: "8px 16px", cursor: "pointer" }}
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GraphViewer;
