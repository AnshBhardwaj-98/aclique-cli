export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center text-center px-6 py-32">
        {/* Background Glow Effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-700/20 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px]"></div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Aclique CLI
        </h1>

        <p className="text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed">
          The AI-powered command line assistant built for developers who move
          fast. Generate, automate, deploy — all from your terminal.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex gap-4">
          <a
            href="/signIn"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition rounded-xl font-semibold shadow-lg shadow-purple-600/30"
          >
            Get Started
          </a>

          <a
            href="#"
            className="px-6 py-3 border border-gray-700 hover:bg-gray-900 transition rounded-xl font-semibold"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6 bg-[#0E0E11]">
        <h2 className="text-4xl font-bold text-center mb-16">
          What Aclique CLI Can Do
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="p-8 bg-[#141417]/50 border border-purple-700/20 rounded-2xl shadow-inner backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-3">
              🧠 AI-Generated Commands
            </h3>
            <p className="text-gray-400">
              Let the CLI think for you. Generate optimized commands instantly
              using natural language.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 bg-[#141417]/50 border border-blue-600/20 rounded-2xl shadow-inner backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-3">⚡ Automation Packs</h3>
            <p className="text-gray-400">
              Run workflows, scripts, and automation tasks with a single prompt.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 bg-[#141417]/50 border border-purple-600/20 rounded-2xl shadow-inner backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-3">🔐 Secure Auth</h3>
            <p className="text-gray-400">
              OAuth device flow with a seamless login experience built for CLI
              tools.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Build with AI?</h2>

        <p className="text-gray-400 max-w-xl mx-auto mb-10">
          Experience the future of command line productivity with Aclique CLI.
        </p>

        <a
          href="/signIn"
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 transition rounded-xl font-semibold shadow-xl shadow-purple-600/30 text-lg"
        >
          Authorize & Start
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm border-t border-gray-800">
        Aclique CLI • AI-Powered Developer Tools
      </footer>
    </div>
  );
}
