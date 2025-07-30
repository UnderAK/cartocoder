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
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-gray-800">Cartocoder</h1>
            <p className="mt-3 text-lg text-gray-600">Visualize any public GitHub repository as an interactive dependency graph.</p>
          </header>

          <form onSubmit={handleSubmit} className="relative mb-8">
            <input
              type="url"
              placeholder="Paste a GitHub repository URL... e.g., https://github.com/facebook/react"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full pl-6 pr-32 py-4 text-lg border-2 border-gray-300 rounded-full shadow-sm focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-shadow duration-300"
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !repoUrl}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-semibold py-3 px-7 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>

          {loading && (
            <div className="text-center py-10">
              <div className="inline-block w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-semibold">Analyzing repository... this may take a moment.</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {graph && (
            <section className="mt-12 bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden">
              <header className="px-8 py-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Dependency Graph</h2>
                <button
                  onClick={handleDownload}
                  className="bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-full hover:bg-gray-300 transition-colors duration-300"
                >
                  Download JSON
                </button>
              </header>
              <div className="p-4 bg-gray-100">
                {typeof window !== "undefined" && (
                  <React.Suspense fallback={<div className="text-center py-20">Loading graph visualization...</div>}>
                    {React.createElement(require("@/components/GraphViewer").default, {
                      graph,
                      width: 850, // Adjusted for larger container
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
