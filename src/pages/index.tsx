import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <main className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-3xl w-full text-center">
          <header className="mb-8">
            <h1 className="text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Cartocoder
            </h1>
            <p className="mt-4 text-2xl text-gray-500">
              Instantly map any code repository.
            </p>
          </header>

          <p className="max-w-xl mx-auto text-lg text-gray-700 mb-10">
            Paste a GitHub URL to generate a beautiful, interactive dependency graph. Understand codebases, identify key files, and untangle complex relationships with ease.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/repo-input" legacyBehavior>
              <a className="w-full sm:w-auto bg-black text-white font-semibold py-4 px-10 rounded-full text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                Analyze a Repository
              </a>
            </Link>
            <Link href="/graph-demo" legacyBehavior>
              <a className="w-full sm:w-auto text-black font-semibold py-4 px-8 rounded-full text-lg hover:bg-gray-100 transition-colors duration-300">
                View Demo
              </a>
            </Link>
          </div>
        </div>
        <footer className="absolute bottom-8 text-gray-400">
          <p>Built with Next.js, TypeScript, and D3.js.</p>
        </footer>
      </main>
    </div>
  );
}

