'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBill, validateAgentCode } from '@/lib/api';

const inputStyle = "w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] placeholder-gray-400";

export default function HomePage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', phone: '', shieldType: 'MOTOR', agentCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agentName, setAgentName] = useState('');
  const [agentChecking, setAgentChecking] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setForm(prev => ({ ...prev, agentCode: ref }));
      checkAgentCode(ref);
    }
  }, []);

  const checkAgentCode = async (code) => {
    if (!code || code.length < 3) {
      setAgentName('');
      return;
    }
    setAgentChecking(true);
    try {
      const res = await validateAgentCode(code);
      if (res.data.valid) {
        setAgentName(res.data.agentName);
      } else {
        setAgentName('');
      }
    } catch {
      setAgentName('');
    } finally {
      setAgentChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.phone) {
      setError('Email and phone number are required');
      return;
    }

    setLoading(true);
    try {
      const res = await createBill({
        shieldType: form.shieldType,
        email: form.email,
        phone: form.phone,
        agentCode: form.agentCode || null
      });
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1a2e] p-6 text-center">
        <div className="text-3xl font-bold text-white tracking-wide">IKMR</div>
        <div className="text-sm text-gray-300 mt-1">I Know My Rights</div>
        <div className="text-xs text-gray-400 mt-1">by AWAS Premium Resources</div>
      </div>

      {/* Hero */}
      <div className="bg-gray-50 px-6 py-8 text-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Know Exactly What Your Insurer Owes You
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Upload your policy schedule. Our AI decodes your rights in plain language.
          Know what to say at the hospital counter or roadside — before crisis hits.
        </p>
        <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
          <span>✅ One-time payment</span>
          <span>✅ No account needed</span>
          <span>✅ Results in 30 seconds</span>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Get Your Rights Audit — RM14.99
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Shield Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Your Policy Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, shieldType: 'MOTOR' })}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  form.shieldType === 'MOTOR'
                    ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">🚗</div>
                <div className="text-sm font-semibold">Motor</div>
                <div className="text-xs opacity-75">Car Insurance</div>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, shieldType: 'MEDICAL' })}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  form.shieldType === 'MEDICAL'
                    ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">🏥</div>
                <div className="text-sm font-semibold">Medical</div>
                <div className="text-xs opacity-75">Health Insurance</div>
              </button>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputStyle}
              placeholder="yourname@email.com"
            />
            <p className="text-xs text-gray-400 mt-1">
              Payment confirmation will be sent here
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputStyle}
              placeholder="0123456789"
            />
          </div>

          {/* Agent Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent Code <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.agentCode}
              onChange={(e) => {
                setForm({ ...form, agentCode: e.target.value.toUpperCase() });
                checkAgentCode(e.target.value.toUpperCase());
              }}
              className={inputStyle}
              placeholder="e.g. AGT001AB"
            />
            {agentChecking && (
              <p className="text-xs text-gray-400 mt-1">Checking...</p>
            )}
            {agentName && !agentChecking && (
              <p className="text-xs text-green-600 mt-1">✅ Referred by {agentName}</p>
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">
                {form.shieldType === 'MOTOR' ? '🚗 Motor Rights Audit' : '🏥 Medical Rights Audit'}
              </span>
              <span className="font-bold text-gray-900">RM14.99</span>
            </div>
            <div className="text-xs text-gray-400">One-time payment. No subscription.</div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a2e] text-white py-4 rounded-xl font-bold text-base disabled:opacity-60"
          >
            {loading ? 'Redirecting to payment...' : 'Pay RM14.99 & Get My Rights Audit'}
          </button>
        </form>

        {/* Agent CTA */}
        <div className="mt-8 text-center border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 mb-2">
            Insurance agent or advisor?
          </p>
          <button
            onClick={() => router.push('/agent')}
            className="text-sm text-[#1a1a2e] font-semibold underline"
          >
            Join our agent referral programme →
          </button>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-100">
        © 2026 AWAS Premium Resources. All rights reserved.
      </div>
    </div>
  );
}