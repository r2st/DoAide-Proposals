import { Link } from 'react-router-dom';

const features = [
  { title: 'AI-Powered Generation', desc: 'Generate professional proposals from templates and a brief using AI.' },
  { title: 'Template Builder', desc: 'Create reusable templates with sections, pricing, and terms.' },
  { title: 'Client Management', desc: 'Keep track of all your clients in one place.' },
  { title: 'Pricing Engine', desc: 'Itemized quotes with tax calculation and discount logic.' },
  { title: 'PDF Export', desc: 'Export polished, branded proposals as PDF documents.' },
  { title: 'E-Signatures', desc: 'Clients can view, accept, or reject proposals with a digital signature.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">DoAide Proposals</span>
        <div className="space-x-4">
          <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Pricing
          </Link>
          <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Professional Proposals,{' '}
          <span className="text-primary-600 dark:text-primary-400">Powered by AI</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Create, send, and track beautiful business proposals in minutes. Let AI handle the writing while you close deals.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-3 bg-primary-600 text-white text-lg rounded-lg hover:bg-primary-700 transition-colors"
          >
            Start Free
          </Link>
          <Link
            to="/pricing"
            className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-lg rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Everything You Need
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} DoAide Proposals. All rights reserved.
      </footer>
    </div>
  );
}
