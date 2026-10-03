import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/proposals/stats').then(({ data }) => data && setStats(data));
    api.get('/proposals').then(({ data }) => data && setRecent(data.slice(0, 5)));
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Proposals', value: stats.total },
        { label: 'Sent', value: stats.sent },
        { label: 'Accepted', value: stats.accepted },
        { label: 'Conversion Rate', value: `${stats.conversion_rate}%` },
        { label: 'This Month', value: `${stats.monthly_usage}/${stats.monthly_limit}` },
      ]
    : [];

  const statusColors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    viewed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    expired: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.full_name?.split(' ')[0]}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{user?.business?.name}</p>
        </div>
        <Link
          to="/proposals/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          New Proposal
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Proposals</h2>
          <Link to="/proposals" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
            No proposals yet.{' '}
            <Link to="/proposals/new" className="text-primary-600 dark:text-primary-400 hover:underline">
              Create your first
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recent.map((p) => (
              <Link
                key={p.id}
                to={`/proposals/${p.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{p.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {p.client_name || 'No client'} &middot; {p.client_company || ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {p.total && (
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      ${Number(p.total).toLocaleString()}
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status] || ''}`}>
                    {p.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
