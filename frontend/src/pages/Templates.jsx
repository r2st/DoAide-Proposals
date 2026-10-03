import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/templates').then(({ data }) => {
      if (data) setTemplates(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return;
    await api.delete(`/templates/${id}`);
    setTemplates(templates.filter((t) => t.id !== id));
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Templates</h1>
        <Link
          to="/templates/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          New Template
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No templates yet.</p>
          <Link to="/templates/new" className="text-primary-600 dark:text-primary-400 hover:underline">
            Create your first template
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{t.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t.description || 'No description'}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                {t.sections?.length || 0} sections &middot; {t.default_validity_days} days validity
              </p>
              <div className="flex gap-2">
                <Link
                  to={`/templates/${t.id}`}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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
