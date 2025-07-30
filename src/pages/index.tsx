import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
      <main className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-6xl font-extrabold text-gray-800 leading-tight">
              Welcome to Cartocoder
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              The ultimate tool for visualizing code repository structures as interactive mindmaps.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Link href="/repo-input" legacyBehavior>
              <a className="block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">Analyze a Repo</h2>
                <p className="text-gray-600">Paste a link to any public GitHub repository and see its dependency graph come to life.</p>
              </a>
            </Link>
            <Link href="/graph-demo" legacyBehavior>
              <a className="block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-purple-600 mb-2">View a Demo</h2>
                <p className="text-gray-600">Explore a pre-built sample graph to see how the interactive visualization works.</p>
              </a>
            </Link>
          </div>

          <footer className="mt-16 text-gray-500">
            <p>Built with Next.js, TypeScript, and D3.js. Styled with Tailwind CSS.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

