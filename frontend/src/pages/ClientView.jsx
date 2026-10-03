import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';

export default function ClientView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/clients/${id}`).then(({ data, error }) => {
      if (error) return navigate('/clients');
      setClient(data);
      setForm(data);
    });
  }, [id, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { data } = await api.patch(`/clients/${id}`, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      address: form.address,
      notes: form.notes,
    });
    setSaving(false);
    if (data) {
      setClient(data);
      setEditing(false);
    }
  };

  if (!client) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  const fields = [
    { label: 'Name', key: 'name', required: true },
    { label: 'Email', key: 'email', type: 'email' },
    { label: 'Phone', key: 'phone' },
    { label: 'Company', key: 'company' },
    { label: 'Address', key: 'address' },
    { label: 'Notes', key: 'notes', textarea: true },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {f.label}{f.required && ' *'}
              </label>
              {f.textarea ? (
                <textarea
                  value={form[f.key] || ''}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <input
                  type={f.type || 'text'}
                  value={form[f.key] || ''}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  required={f.required}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              )}
            </div>
          ))}
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <p className="text-sm text-gray-500 dark:text-gray-400">{f.label}</p>
              <p className="text-gray-900 dark:text-white">{client[f.key] || '—'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
