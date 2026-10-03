import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', address: '', notes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/clients').then(({ data }) => {
      if (data) setClients(data);
      setLoading(false);
    });
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { data } = await api.post('/clients', form);
    setSaving(false);
    if (data) {
      setClients([...clients, data]);
      setForm({ name: '', email: '', phone: '', company: '', address: '', notes: '' });
      setShowAdd(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this client?')) return;
    await api.delete(`/clients/${id}`);
    setClients(clients.filter((c) => c.id !== id));
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showAdd ? 'Cancel' : 'Add Client'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {saving ? 'Adding...' : 'Add Client'}
          </button>
        </form>
      )}

      {clients.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No clients yet. Add your first client above.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          {clients.map((c) => (
            <div key={c.id} className="px-6 py-4 flex items-center justify-between">
              <Link to={`/clients/${c.id}`} className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{c.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {c.company || ''}{c.email ? ` — ${c.email}` : ''}
                </p>
              </Link>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 ml-4"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
