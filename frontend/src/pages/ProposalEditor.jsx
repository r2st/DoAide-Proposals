import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';

const emptySection = { title: '', content: '', order: 0, section_type: 'text' };
const emptyItem = { description: '', quantity: 1, unit_price: 0, amount: 0 };

export default function ProposalEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [templates, setTemplates] = useState([]);
  const [clients, setClients] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    client_id: '',
    template_id: '',
    client_name: '',
    client_email: '',
    client_company: '',
    sections: [{ ...emptySection }],
    pricing_items: [],
    discount_percent: 0,
    tax_percent: 0,
    terms: '',
    notes: '',
    validity_days: 30,
  });
  const [proposal, setProposal] = useState(null);

  useEffect(() => {
    api.get('/templates').then(({ data }) => data && setTemplates(data));
    api.get('/clients').then(({ data }) => data && setClients(data));

    if (id) {
      api.get(`/proposals/${id}`).then(({ data, error: err }) => {
        if (err) return navigate('/proposals');
        setProposal(data);
        setForm({
          title: data.title,
          client_id: data.client_id || '',
          template_id: data.template_id || '',
          client_name: data.client_name || '',
          client_email: data.client_email || '',
          client_company: data.client_company || '',
          sections: data.sections?.length > 0 ? data.sections : [{ ...emptySection }],
          pricing_items: data.pricing_items || [],
          discount_percent: data.discount_percent || 0,
          tax_percent: data.tax_percent || 0,
          terms: data.terms || '',
          notes: data.notes || '',
          validity_days: data.validity_days || 30,
        });
      });
    }
  }, [id, navigate]);

  const handleClientChange = (clientId) => {
    const client = clients.find((c) => c.id === Number(clientId));
    if (client) {
      setForm({
        ...form,
        client_id: client.id,
        client_name: client.name,
        client_email: client.email || '',
        client_company: client.company || '',
      });
    } else {
      setForm({ ...form, client_id: '' });
    }
  };

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

  const updateItem = (idx, field, value) => {
    const updated = [...form.pricing_items];
    updated[idx] = { ...updated[idx], [field]: value };
    if (field === 'quantity' || field === 'unit_price') {
      updated[idx].amount = updated[idx].quantity * updated[idx].unit_price;
    }
    setForm({ ...form, pricing_items: updated });
  };

  const addItem = () => {
    setForm({ ...form, pricing_items: [...form.pricing_items, { ...emptyItem }] });
  };

  const removeItem = (idx) => {
    setForm({ ...form, pricing_items: form.pricing_items.filter((_, i) => i !== idx) });
  };

  const handleGenerate = async () => {
    if (!form.template_id) {
      setError('Select a template first');
      return;
    }
    const brief = prompt('Describe what this proposal is for:');
    if (!brief) return;

    setGenerating(true);
    setError('');
    const { data, error: err } = await api.post('/proposals/generate', {
      template_id: Number(form.template_id),
      client_id: form.client_id ? Number(form.client_id) : null,
      brief,
      client_name: form.client_name,
      client_company: form.client_company,
    });
    setGenerating(false);

    if (err) {
      setError(err.detail || 'Generation failed');
    } else {
      navigate(`/proposals/${data.id}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      client_id: form.client_id ? Number(form.client_id) : null,
      template_id: form.template_id ? Number(form.template_id) : null,
      sections: form.sections.map((s, i) => ({ ...s, order: i })),
    };

    const { error: err } = isNew
      ? await api.post('/proposals', payload)
      : await api.patch(`/proposals/${id}`, payload);

    setSaving(false);
    if (err) {
      setError(err.detail || 'Failed to save');
    } else {
      navigate('/proposals');
    }
  };

  const handleSend = async () => {
    if (!id) return;
    setSending(true);
    const { data, error: err } = await api.post(`/proposals/${id}/send`);
    setSending(false);
    if (err) {
      setError(err.detail || 'Failed to send');
    } else {
      setProposal(data);
    }
  };

  const handleExportPdf = async () => {
    if (!id) return;
    const { data, error: err } = await api.get(`/proposals/${id}/pdf`);
    if (err) {
      setError(err.detail || 'PDF export failed');
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposal-${id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const subtotal = form.pricing_items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const discountAmount = subtotal * (form.discount_percent / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (form.tax_percent / 100);
  const total = taxableAmount + taxAmount;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isNew ? 'New Proposal' : 'Edit Proposal'}
        </h1>
        <div className="flex gap-2">
          {isNew && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:opacity-50 transition-colors"
            >
              {generating ? 'Generating...' : 'AI Generate'}
            </button>
          )}
          {proposal?.view_token && proposal.status !== 'draft' && (
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/p/${proposal.view_token}`)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Copy Link
            </button>
          )}
          {id && (
            <>
              <button
                onClick={handleExportPdf}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Export PDF
              </button>
              {proposal?.status === 'draft' && (
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {sending ? 'Sending...' : 'Mark as Sent'}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {proposal && proposal.status !== 'draft' && (
        <div className="mb-4 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-300">
          Status: <strong>{proposal.status}</strong>
          {proposal.sent_at && ` — Sent ${new Date(proposal.sent_at).toLocaleDateString()}`}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Template</label>
              <select
                value={form.template_id}
                onChange={(e) => setForm({ ...form, template_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">None</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
              <select
                value={form.client_id}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
              <input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Email</label>
              <input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Company</label>
              <input value={form.client_company} onChange={(e) => setForm({ ...form, client_company: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sections</h2>
            <button type="button" onClick={addSection} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              + Add Section
            </button>
          </div>
          <div className="space-y-4">
            {form.sections.map((section, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Section {idx + 1}</span>
                  {form.sections.length > 1 && (
                    <button type="button" onClick={() => removeSection(idx)} className="text-sm text-red-500 hover:text-red-700">Remove</button>
                  )}
                </div>
                <input
                  placeholder="Section title"
                  value={section.title}
                  onChange={(e) => updateSection(idx, 'title', e.target.value)}
                  className="w-full mb-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Section content"
                  value={section.content}
                  onChange={(e) => updateSection(idx, 'content', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing</h2>
            <button type="button" onClick={addItem} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              + Add Item
            </button>
          </div>
          {form.pricing_items.length > 0 && (
            <div className="space-y-3 mb-4">
              {form.pricing_items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input placeholder="Description" value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} className="col-span-5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))} className="col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  <input type="number" placeholder="Price" value={item.unit_price} onChange={(e) => updateItem(idx, 'unit_price', Number(e.target.value))} className="col-span-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  <span className="col-span-2 text-sm text-gray-700 dark:text-gray-300 text-right">${item.amount?.toLocaleString()}</span>
                  <button type="button" onClick={() => removeItem(idx)} className="col-span-1 text-red-500 text-sm">X</button>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount %</label>
              <input type="number" step="0.01" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax %</label>
              <input type="number" step="0.01" value={form.tax_percent} onChange={(e) => setForm({ ...form, tax_percent: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div className="flex items-end">
              <div className="text-right w-full">
                <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal: ${subtotal.toLocaleString()}</p>
                {form.discount_percent > 0 && <p className="text-sm text-gray-500 dark:text-gray-400">Discount: -${discountAmount.toLocaleString()}</p>}
                {form.tax_percent > 0 && <p className="text-sm text-gray-500 dark:text-gray-400">Tax: +${taxAmount.toLocaleString()}</p>}
                <p className="text-lg font-bold text-gray-900 dark:text-white">Total: ${total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Terms</label>
              <textarea value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Validity (days)</label>
            <input type="number" value={form.validity_days} onChange={(e) => setForm({ ...form, validity_days: parseInt(e.target.value) || 30 })} className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors font-medium">
            {saving ? 'Saving...' : isNew ? 'Create Proposal' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/proposals')} className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
