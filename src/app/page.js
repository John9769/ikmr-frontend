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
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setForm(prev => ({ ...prev, agentCode: ref }));
      checkAgentCode(ref);
    }
  }, []);

  const checkAgentCode = async (code) => {
    if (!code || code.length < 3) { setAgentName(''); return; }
    setAgentChecking(true);
    try {
      const res = await validateAgentCode(code);
      if (res.data.valid) { setAgentName(res.data.agentName); } else { setAgentName(''); }
    } catch { setAgentName(''); } finally { setAgentChecking(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.phone) { setError('Email and phone number are required'); return; }
    setLoading(true);
    try {
      const res = await createBill({ shieldType: form.shieldType, email: form.email, phone: form.phone, agentCode: form.agentCode || null });
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
      <div className="bg-gray-50 px-6 py-10 border-b border-gray-200">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900 mb-2 text-center">
            This Is What You Get For RM14.99
          </h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Your insurance policy decoded into a Crisis Screen —
            ready to show at hospital or roadside in seconds.
          </p>

          {/* Mobile Phone Mockup */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-64 bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl border-4 border-gray-800">
                <div className="flex justify-center mb-1">
                  <div className="w-16 h-4 bg-gray-800 rounded-full"></div>
                </div>
                <div className="bg-gray-50 rounded-[2rem] overflow-hidden">
                  <div className="bg-[#1a1a2e] px-3 py-2">
                    <div className="text-white text-xs font-bold">IKMR</div>
                    <div className="text-gray-400 text-[10px]">🏥 Medical Rights Audit</div>
                  </div>
                  <div className="p-2 space-y-2 bg-gray-50">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-1.5 text-center">
                      <p className="text-[9px] font-bold text-yellow-800">📸 SCREENSHOT & SAVE</p>
                    </div>
                    <div className="bg-[#1a1a2e] rounded-lg p-2">
                      <div className="text-[8px] text-gray-400">OFFICIAL POLICY RIGHTS HOLDER</div>
                      <div className="text-[10px] font-bold text-white">Syarikat Insurans Malaysia</div>
                      <div className="text-[8px] text-gray-300">Policy: MED-2024-XXXX</div>
                      <div className="text-[8px] text-gray-300">Valid until: 31/12/2026</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-2">
                      <div className="text-[9px] font-bold text-[#1a1a2e] mb-1">🛏️ WARD ENTITLEMENT</div>
                      <div className="flex justify-between">
                        <span className="text-[8px] text-gray-500">Room & Board</span>
                        <span className="text-[8px] font-bold text-green-600">RM250/DAY</span>
                      </div>
                      <div className="bg-blue-50 rounded p-1 mt-1">
                        <p className="text-[8px] text-blue-800">You qualify for Standard Single Room. Reject any lower ward offer.</p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-2">
                      <div className="text-[9px] font-bold text-[#1a1a2e] mb-1">🛑 CO-PAYMENT</div>
                      <div className="flex justify-between">
                        <span className="text-[8px] text-gray-500">Status</span>
                        <span className="text-[8px] font-bold text-green-600">NONE ✅</span>
                      </div>
                      <div className="bg-blue-50 rounded p-1 mt-1">
                        <p className="text-[8px] text-blue-800">You pay RM0 at discharge. 100% cashless.</p>
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                      <div className="text-[9px] font-bold text-red-700 mb-1">⚠️ WARNING DETECTED</div>
                      <p className="text-[8px] text-red-700">Premium escalation clause detected. Review at next renewal.</p>
                    </div>
                    <div className="bg-white border-2 border-[#1a1a2e] rounded-lg p-2">
                      <div className="text-[9px] font-bold text-[#1a1a2e] mb-1">🚨 EMERGENCY ACTION</div>
                      <p className="text-[8px] text-gray-700">1. Show this screen at counter. 2. Request Single Room. 3. Call insurer if denied.</p>
                    </div>
                    <div className="bg-[#1a1a2e] rounded-lg p-2 text-center">
                      <p className="text-[8px] font-bold text-white">📞 Call Insurer Hotline</p>
                    </div>
                    <div className="bg-[#1a1a2e] rounded-lg p-1.5 text-center">
                      <p className="text-[8px] text-gray-300">⚡ Accident? Launch AWAS Core →</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-1">
                  <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="text-xl mb-1">⚖️</div>
              <div className="text-xs font-bold text-gray-900">Rights Brief</div>
              <div className="text-xs text-gray-500 mt-1">Plain language. No jargon.</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="text-xl mb-1">⚠️</div>
              <div className="text-xs font-bold text-gray-900">Clause Alerts</div>
              <div className="text-xs text-gray-500 mt-1">Hidden clauses flagged.</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="text-xl mb-1">🚨</div>
              <div className="text-xs font-bold text-gray-900">Action Plan</div>
              <div className="text-xs text-gray-500 mt-1">What to say. Who to call.</div>
            </div>
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Your Policy Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setForm({ ...form, shieldType: 'MOTOR' })}
                className={`p-4 rounded-xl border-2 text-center transition-all ${form.shieldType === 'MOTOR' ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white' : 'border-gray-200 text-gray-700'}`}>
                <div className="text-2xl mb-1">🚗</div>
                <div className="text-sm font-semibold">Motor</div>
                <div className="text-xs opacity-75">Car Insurance</div>
              </button>
              <button type="button" onClick={() => setForm({ ...form, shieldType: 'MEDICAL' })}
                className={`p-4 rounded-xl border-2 text-center transition-all ${form.shieldType === 'MEDICAL' ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white' : 'border-gray-200 text-gray-700'}`}>
                <div className="text-2xl mb-1">🏥</div>
                <div className="text-sm font-semibold">Medical</div>
                <div className="text-xs opacity-75">Health Insurance</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputStyle} placeholder="yourname@email.com" />
            <p className="text-xs text-gray-400 mt-1">Payment confirmation will be sent here</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" required value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputStyle} placeholder="0123456789" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agent Code <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input type="text" value={form.agentCode}
              onChange={(e) => { setForm({ ...form, agentCode: e.target.value.toUpperCase() }); checkAgentCode(e.target.value.toUpperCase()); }}
              className={inputStyle} placeholder="e.g. AGT001AB" />
            {agentChecking && <p className="text-xs text-gray-400 mt-1">Checking...</p>}
            {agentName && !agentChecking && <p className="text-xs text-green-600 mt-1">✅ Referred by {agentName}</p>}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{form.shieldType === 'MOTOR' ? '🚗 Motor Rights Audit' : '🏥 Medical Rights Audit'}</span>
              <span className="font-bold text-gray-900">RM14.99</span>
            </div>
            <div className="text-xs text-gray-400">One-time payment. No subscription.</div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#1a1a2e] text-white py-4 rounded-xl font-bold text-base disabled:opacity-60">
            {loading ? 'Redirecting to payment...' : 'Pay RM14.99 & Get My Rights Audit'}
          </button>
        </form>

        {/* Agent CTA */}
        <div className="mt-8 text-center border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 mb-2">Insurance agent or advisor?</p>
          <button onClick={() => router.push('/agent')} className="text-sm text-[#1a1a2e] font-semibold underline">
            Join our agent referral programme →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-100 px-4">
        <p>© 2026 AWAS Premium Resources (SSM 202603141446). All rights reserved.</p>
        <p className="mt-1">
          By proceeding with payment you agree to our{' '}
          <button onClick={() => setShowTerms(true)} className="underline text-[#1a1a2e]">Terms of Service</button>
          {' '}and{' '}
          <button onClick={() => setShowPrivacy(true)} className="underline text-[#1a1a2e]">Privacy Policy</button>
        </p>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Terms of Service</h2>
              <button onClick={() => setShowTerms(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            <div className="text-xs text-gray-600 space-y-3">
              <p><strong>Last updated: June 2026</strong></p>
              <p>IKMR — I Know My Rights is operated by AWAS Premium Resources (SSM 202603141446), Seremban, Negeri Sembilan, Malaysia.</p>
              <p><strong>1. Service Description</strong><br/>IKMR provides an AI-powered insurance policy decoding service. We extract and translate key policy information into plain language for your personal reference.</p>
              <p><strong>2. Not Legal Advice</strong><br/>The information provided by IKMR is for informational purposes only. It does not constitute legal advice. IKMR is not a licensed insurance advisor, legal practitioner, or financial advisor. For formal disputes, consult a qualified professional.</p>
              <p><strong>3. Accuracy</strong><br/>IKMR uses AI to decode your policy. While we strive for accuracy, results depend on the quality of the uploaded document. IKMR is not liable for errors arising from unclear, incomplete, or incorrectly uploaded documents.</p>
              <p><strong>4. Payment</strong><br/>Payment of RM14.99 per policy audit is non-refundable once the parsing process has been completed. If parsing fails due to a technical error on our side, a re-parse will be offered at no additional cost.</p>
              <p><strong>5. Limitation of Liability</strong><br/>IKMR shall not be held liable for any loss, claim rejection, financial damage, or disputes arising from reliance on information provided. Users are advised to verify all information directly with their insurer.</p>
              <p><strong>6. Governing Law</strong><br/>These terms are governed by the laws of Malaysia.</p>
              <p><strong>Contact:</strong> hello@awas.asia</p>
            </div>
            <button onClick={() => setShowTerms(false)}
              className="w-full bg-[#1a1a2e] text-white py-3 rounded-xl font-semibold text-sm mt-6">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Privacy Policy</h2>
              <button onClick={() => setShowPrivacy(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            <div className="text-xs text-gray-600 space-y-3">
              <p><strong>Last updated: June 2026</strong></p>
              <p>AWAS Premium Resources (SSM 202603141446) is committed to protecting your personal data in accordance with the Personal Data Protection Act 2010 (PDPA) of Malaysia.</p>
              <p><strong>1. Data We Collect</strong><br/>We collect your email address and phone number solely for the purpose of processing your payment and sending your payment confirmation.</p>
              <p><strong>2. Policy Documents</strong><br/>Your uploaded policy document is sent directly to our AI parsing engine and permanently deleted from our servers immediately after analysis is complete. We do not retain any copy of your policy document.</p>
              <p><strong>3. Parsed Data</strong><br/>The decoded results of your policy are returned to your device and stored locally in your browser only. We do not store your decoded policy data on our servers.</p>
              <p><strong>4. Data Sharing</strong><br/>We do not sell, share, or disclose your personal data to any third party except as required by Malaysian law or for the purpose of processing your payment via ToyyibPay.</p>
              <p><strong>5. ToyyibPay</strong><br/>Payment processing is handled by ToyyibPay Sdn Bhd. Their privacy policy applies to data shared during payment processing.</p>
              <p><strong>6. Data Retention</strong><br/>We retain only your email, phone number, payment reference, and shield type for a period of 7 years as required for accounting and audit purposes under Malaysian law.</p>
              <p><strong>7. Your Rights</strong><br/>You have the right to access, correct, or request deletion of your personal data. Contact us at hello@awas.asia.</p>
              <p><strong>Contact:</strong> hello@awas.asia</p>
            </div>
            <button onClick={() => setShowPrivacy(false)}
              className="w-full bg-[#1a1a2e] text-white py-3 rounded-xl font-semibold text-sm mt-6">
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}