import React, { useState } from "react";

const RepoInputPage: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graph, setGraph] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setGraph(null);
    try {
      // Step 1: Clone and scan repo
      const res = await fetch("/api/clone-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      if (!res.ok) {
        const { error, details } = await res.json();
        setError(error || `An unknown error occurred. Details: ${details || 'N/A'}`);
        setLoading(false);
        return;
      }

      const graphData = await res.json();
      setGraph(graphData);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 32, maxWidth: 540, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Analyze a GitHub Repo</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input
          type="url"
          placeholder="https://github.com/user/repo"
          value={repoUrl}
          onChange={e => setRepoUrl(e.target.value)}
          style={{ flex: 1, padding: 8, fontSize: 16 }}
          required
        />
        <button type="submit" disabled={loading || !repoUrl} style={{ padding: "8px 18px", fontSize: 16, cursor: "pointer" }}>
          Analyze
        </button>
      </form>
      {loading && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto", width: 40, height: 40, border: "4px solid #eee", borderTop: "4px solid #3498db", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          <div style={{ marginTop: 8 }}>Processing…</div>
        </div>
      )}
      {error && <div style={{ color: "#d32f2f", marginTop: 18 }}>{error}</div>}
      {graph && (
        <div style={{ marginTop: 32, background: '#f9f9fa', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Dependency Graph</h3>
            <button
              style={{ padding: '6px 18px', fontSize: 15, background: '#3498db', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              onClick={() => {
                const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'graph.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            >
              Download JSON
            </button>
          </div>
          {/* Lazy load GraphViewer to avoid SSR issues */}
          {typeof window !== "undefined" && (
            <React.Suspense fallback={<div>Loading graph…</div>}>
              {React.createElement(require("@/components/GraphViewer").default, {
                graph,
                width: 700,
                height: 500,
              })}
            </React.Suspense>
          )}
        </div>
      )}
    </div>
  );
};

export default RepoInputPage;
