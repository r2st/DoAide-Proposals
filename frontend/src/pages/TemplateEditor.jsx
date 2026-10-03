import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';

const emptySection = { title: '', content: '', order: 0, section_type: 'text' };

export default function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [form, setForm] = useState({
    name: '',
    description: '',
    default_terms: '',
    default_validity_days: 30,
    sections: [{ ...emptySection }],
    pricing_table: null,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/templates/${id}`).then(({ data, error: err }) => {
        if (err) {
          navigate('/templates');
        } else {
          setForm({
            name: data.name,
            description: data.description || '',
            default_terms: data.default_terms || '',
            default_validity_days: data.default_validity_days || 30,
            sections: data.sections?.length > 0 ? data.sections : [{ ...emptySection }],
            pricing_table: data.pricing_table,
          });
        }
      });
    }
  }, [id, navigate]);

  const updateSection = (idx, field, value) => {
    const updated = [...form.sections];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, sections: updated });
  };

  const addSection = () => {
    setForm({
      ...form,
      sections: [...form.sections, { ...emptySection, order: form.sections.length }],
    });
  };

  const removeSection = (idx) => {
    setForm({ ...form, sections: form.sections.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      sections: form.sections.map((s, i) => ({ ...s, order: i })),
    };

    const { error: err } = isNew
      ? await api.post('/templates', payload)
      : await api.patch(`/templates/${id}`, payload);

    setSaving(false);
    if (err) {
      setError(err.detail || 'Failed to save');
    } else {
      navigate('/templates');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isNew ? 'New Template' : 'Edit Template'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Terms</label>
              <input
                value={form.default_terms}
                onChange={(e) => setForm({ ...form, default_terms: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Validity (days)</label>
              <input
                type="number"
                value={form.default_validity_days}
                onChange={(e) => setForm({ ...form, default_validity_days: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sections</h2>
            <button
              type="button"
              onClick={addSection}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              + Add Section
            </button>
          </div>
          <div className="space-y-4">
            {form.sections.map((section, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Section {idx + 1}</span>
                  {form.sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(idx)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  placeholder="Section title"
                  value={section.title}
                  onChange={(e) => updateSection(idx, 'title', e.target.value)}
                  className="w-full mb-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Section content (use {client_name}, {client_company} as placeholders)"
                  value={section.content}
                  onChange={(e) => updateSection(idx, 'content', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium"
          >
            {saving ? 'Saving...' : isNew ? 'Create Template' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/templates')}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
