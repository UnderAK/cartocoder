import React, { useState } from "react";
import { type GraphData } from "@/components/GraphViewer";
import Link from 'next/link';
import { motion } from 'framer-motion';

const RepoInputPage: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGraph(null);

    try {
      const response = await fetch("/api/clone-repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred.");
      }

      setGraph(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!graph) return;
    const dataStr = JSON.stringify(graph, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "graph.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

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
          className="max-w-4xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <header className="text-center mb-10">
            <h1 className="text-5xl font-bold tracking-tight">Analyze a Repository</h1>
            <p className="mt-3 text-lg text-gray-500">Paste a public GitHub URL to generate an interactive dependency graph.</p>
          </header>

          <form onSubmit={handleSubmit} className="relative mb-8 max-w-2xl mx-auto">
            <input
              type="url"
              placeholder="e.g., https://github.com/facebook/react"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full pl-6 pr-36 py-4 text-base bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !repoUrl}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>

          {loading && (
            <div className="text-center py-10">
              <div className="inline-block w-10 h-10 border-2 border-t-black border-gray-200 rounded-full animate-spin"></div>
              <p className="mt-4 font-semibold">Analyzing repository... this can take a moment.</p>
            </div>
          )}

          {error && (
            <div className="border border-red-400 bg-red-50 rounded-lg p-4 text-center max-w-2xl mx-auto" role="alert">
              <p className="font-bold text-red-700">Analysis Failed</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {graph && (
            <motion.section
              className="mt-12 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
            >
              <header className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold">Dependency Graph</h2>
                <button
                  onClick={handleDownload}
                  className="bg-white text-black border border-gray-300 font-semibold py-2 px-5 rounded-full hover:bg-gray-100 transition-colors duration-300"
                >
                  Download JSON
                </button>
              </header>
              <div className="p-4 bg-white">
                {typeof window !== "undefined" && (
                  <React.Suspense fallback={<div className="text-center py-20 text-gray-500">Loading graph...</div>}>
                    {React.createElement(require("@/components/GraphViewer").default, {
                      graph,
                      width: 850,
                      height: 600,
                    })}
                  </React.Suspense>
                )}
              </div>
            </motion.section>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default RepoInputPage;
