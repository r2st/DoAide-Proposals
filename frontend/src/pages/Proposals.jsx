import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

const statusColors = {
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  viewed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  expired: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

export default function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const url = filter ? `/proposals?status_filter=${filter}` : '/proposals';
    api.get(url).then(({ data }) => {
      if (data) setProposals(data);
      setLoading(false);
    });
  }, [filter]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this proposal?')) return;
    await api.delete(`/proposals/${id}`);
    setProposals(proposals.filter((p) => p.id !== id));
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Proposals</h1>
        <Link
          to="/proposals/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          New Proposal
        </Link>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['', 'draft', 'sent', 'viewed', 'accepted', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === s
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {proposals.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No proposals found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          {proposals.map((p) => (
            <div key={p.id} className="px-6 py-4 flex items-center justify-between">
              <Link to={`/proposals/${p.id}`} className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">{p.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {p.client_name || 'No client'}{p.client_company ? ` — ${p.client_company}` : ''}
                </p>
              </Link>
              <div className="flex items-center gap-3 ml-4">
                {p.total && (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ${Number(p.total).toLocaleString()}
                  </span>
                )}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[p.status] || ''}`}>
                  {p.status}
                </span>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-sm text-red-500 hover:text-red-700 dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
