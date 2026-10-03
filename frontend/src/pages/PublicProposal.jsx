import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

export default function PublicProposal() {
  const { token } = useParams();
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState('');
  const [signing, setSigning] = useState(false);
  const [signForm, setSignForm] = useState({ signer_name: '', signer_email: '', signature_data: '' });
  const [signResult, setSignResult] = useState(null);

  useEffect(() => {
    fetch(`/api/proposals/view/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.detail) setError(data.detail);
        else setProposal(data);
      })
      .catch(() => setError('Failed to load proposal'));
  }, [token]);

  const handleSign = async (accepted) => {
    setSigning(true);
    const res = await fetch(`/api/proposals/view/${token}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...signForm, accepted }),
    });
    const data = await res.json();
    setSigning(false);
    if (res.ok) {
      setSignResult(data);
    } else {
      setError(data.detail || 'Signing failed');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const alreadySigned = proposal.status === 'accepted' || proposal.status === 'rejected';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-primary-600 px-8 py-6 text-white">
            <p className="text-sm opacity-80">{proposal.business_name}</p>
            <h1 className="text-2xl font-bold mt-1">{proposal.title}</h1>
            <p className="text-sm mt-2 opacity-80">
              Prepared for {proposal.client_name}
              {proposal.client_company ? ` — ${proposal.client_company}` : ''}
            </p>
          </div>

          <div className="px-8 py-6 space-y-8">
            {proposal.sections?.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{section.title}</h2>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{section.content}</div>
              </div>
            ))}

            {proposal.pricing_items?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Pricing</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 text-gray-500 dark:text-gray-400">Item</th>
                      <th className="text-right py-2 text-gray-500 dark:text-gray-400">Qty</th>
                      <th className="text-right py-2 text-gray-500 dark:text-gray-400">Price</th>
                      <th className="text-right py-2 text-gray-500 dark:text-gray-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.pricing_items.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-2 text-gray-900 dark:text-white">{item.description}</td>
                        <td className="py-2 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                        <td className="py-2 text-right text-gray-700 dark:text-gray-300">${Number(item.unit_price).toLocaleString()}</td>
                        <td className="py-2 text-right text-gray-900 dark:text-white">${Number(item.amount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="pt-4 text-right font-semibold text-gray-900 dark:text-white">Total</td>
                      <td className="pt-4 text-right text-xl font-bold text-primary-600 dark:text-primary-400">
                        ${Number(proposal.total).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {proposal.terms && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Terms & Conditions</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{proposal.terms}</p>
              </div>
            )}
          </div>

          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            {signResult ? (
              <div className={`text-center py-4 ${signResult.status === 'accepted' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <p className="text-xl font-bold">Proposal {signResult.status}</p>
              </div>
            ) : alreadySigned ? (
              <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                This proposal has been <strong>{proposal.status}</strong>.
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Accept or Reject</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                    <input
                      value={signForm.signer_name}
                      onChange={(e) => setSignForm({ ...signForm, signer_name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Email</label>
                    <input
                      type="email"
                      value={signForm.signer_email}
                      onChange={(e) => setSignForm({ ...signForm, signer_email: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleSign(true)}
                    disabled={signing || !signForm.signer_name || !signForm.signer_email}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                  >
                    Accept Proposal
                  </button>
                  <button
                    onClick={() => handleSign(false)}
                    disabled={signing || !signForm.signer_name || !signForm.signer_email}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {proposal.business_email && (
          <div className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            {proposal.business_name} &middot; {proposal.business_email}
            {proposal.business_phone ? ` &middot; ${proposal.business_phone}` : ''}
          </div>
        )}
      </div>
    </div>
  );
}
