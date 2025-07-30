import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-7xl font-bold tracking-tighter">
              Cartocoder
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              A minimalist dependency visualizer.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Link href="/repo-input" legacyBehavior>
              <a className="block p-8 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-2">Analyze a Repo</h2>
                <p className="text-gray-600">Paste a public GitHub repo URL to generate a dependency graph.</p>
              </a>
            </Link>
            <Link href="/graph-demo" legacyBehavior>
              <a className="block p-8 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-2">View a Demo</h2>
                <p className="text-gray-600">Explore a sample graph to see how the visualizer works.</p>
              </a>
            </Link>
          </div>

          <footer className="mt-16 text-gray-400">
            <p>Built with Next.js, TypeScript, and D3.js.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

