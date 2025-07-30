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
      const res = await fetch("/api/clone-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      if (!res.ok) {
        const { error, details } = await res.json();
        setError(error || `An unknown error occurred. Details: ${details || 'N/A'}`);
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

  const handleDownload = () => {
    if (!graph) return;
    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-6xl font-bold tracking-tighter">Cartocoder</h1>
            <p className="mt-3 text-lg text-gray-500">A minimalist dependency visualizer.</p>
          </header>

          <form onSubmit={handleSubmit} className="relative mb-8">
            <input
              type="url"
              placeholder="Paste a public GitHub repository URL..."
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full pl-6 pr-32 py-4 text-base bg-white border-2 border-black rounded-full focus:outline-none"
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !repoUrl}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>

          {loading && (
            <div className="text-center py-10">
              <div className="inline-block w-10 h-10 border-2 border-t-black border-gray-200 rounded-full animate-spin"></div>
              <p className="mt-4 font-semibold">Analyzing repository...</p>
            </div>
          )}

          {error && (
            <div className="border-2 border-black rounded-lg p-4 text-center" role="alert">
              <p className="font-bold">Analysis Failed</p>
              <p className="text-gray-600">{error}</p>
            </div>
          )}

          {graph && (
            <section className="mt-12 border-2 border-black rounded-lg overflow-hidden">
              <header className="px-6 py-4 border-b-2 border-black flex justify-between items-center">
                <h2 className="text-xl font-bold">Dependency Graph</h2>
                <button
                  onClick={handleDownload}
                  className="bg-white text-black border-2 border-black font-semibold py-2 px-5 rounded-full hover:bg-gray-100 transition-colors duration-300"
                >
                  Download JSON
                </button>
              </header>
              <div className="p-4 bg-white">
                {typeof window !== "undefined" && (
                  <React.Suspense fallback={<div className="text-center py-20">Loading graph...</div>}>
                    {React.createElement(require("@/components/GraphViewer").default, {
                      graph,
                      width: 850,
                      height: 600,
                    })}
                  </React.Suspense>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default RepoInputPage;
