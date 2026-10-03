import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      '10 proposals per month',
      'AI-powered generation',
      'PDF export',
      'Client management',
      'E-signatures',
      'Proposal tracking',
    ],
    cta: 'Get Started',
    primary: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    features: [
      'Unlimited proposals',
      'Everything in Free',
      'Custom branding',
      'Priority AI generation',
      'Advanced analytics',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    primary: true,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
          DoAide Proposals
        </Link>
        <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          Login
        </Link>
      </nav>

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Simple Pricing</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          Start free, upgrade when you need more.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border-2 p-8 ${
                plan.primary
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 text-left">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={`block w-full py-2.5 text-center rounded-lg font-medium transition-colors ${
                  plan.primary
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
