'use client';
import { useState } from 'react';
import { registerAgent, getAgentStats } from '@/lib/api';

const inputStyle = "w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] placeholder-gray-400";

export default function AgentPage() {
  const [tab, setTab] = useState('register');
  const [form, setForm] = useState({ name: '', email: '', phone: '', licenseNumber: '', insurerName: '', bankName: '', bankAccount: '' });
  const [statsCode, setStatsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agentData, setAgentData] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await registerAgent(form);
      setSuccess(`${res.data.message} Your agent code is: ${res.data.agentCode}`);
      setForm({ name: '', email: '', phone: '', licenseNumber: '', insurerName: '', bankName: '', bankAccount: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStats = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAgentData(null);
    try {
      const res = await getAgentStats(statsCode);
      setAgentData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Agent code not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1a2e] p-6 text-center">
        <div className="text-3xl font-bold text-white tracking-wide">IKMR</div>
        <div className="text-sm text-gray-300 mt-1">Agent Referral Programme</div>
        <div className="text-xs text-gray-400 mt-1">by AWAS Premium Resources</div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex max-w-md mx-auto">
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              tab === 'register'
                ? 'border-[#1a1a2e] text-[#1a1a2e]'
                : 'border-transparent text-gray-500'
            }`}
          >
            Join Programme
          </button>
          <button
            onClick={() => setTab('stats')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              tab === 'stats'
                ? 'border-[#1a1a2e] text-[#1a1a2e]'
                : 'border-transparent text-gray-500'
            }`}
          >
            My Stats
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 max-w-md mx-auto w-full">

        {/* REGISTER TAB */}
        {tab === 'register' && (
          <>
            {/* How it works */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-bold text-[#1a1a2e] mb-3">
                How the Agent Programme Works
              </h3>
              <div className="space-y-2">
                <div className="flex gap-3 text-xs text-gray-600">
                  <span className="text-lg">1️⃣</span>
                  <span>Register below and get your unique agent code</span>
                </div>
                <div className="flex gap-3 text-xs text-gray-600">
                  <span className="text-lg">2️⃣</span>
                  <span>Share your code with clients via WhatsApp or any channel</span>
                </div>
                <div className="flex gap-3 text-xs text-gray-600">
                  <span className="text-lg">3️⃣</span>
                  <span>Client pays RM14.99 and enters your code at checkout</span>
                </div>
                <div className="flex gap-3 text-xs text-gray-600">
                  <span className="text-lg">4️⃣</span>
                  <span>You earn RM5.00 commission per successful audit</span>
                </div>
                <div className="flex gap-3 text-xs text-gray-600">
                  <span className="text-lg">5️⃣</span>
                  <span>Payout on 15th and 30th of each month via bank transfer</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm font-semibold">
                ✅ {success}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputStyle}
                  placeholder="Ahmad bin Abdullah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputStyle}
                  placeholder="ahmad@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputStyle}
                  placeholder="0123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tied Agent / License Number
                </label>
                <input
                  type="text"
                  required
                  value={form.licenseNumber}
                  onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                  className={inputStyle}
                  placeholder="e.g. PIAM/LIAM registration number"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Required for verification. Your account will be activated after review.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Company
                </label>
                <input
                  type="text"
                  required
                  value={form.insurerName}
                  onChange={(e) => setForm({ ...form, insurerName: e.target.value })}
                  className={inputStyle}
                  placeholder="e.g. Allianz, AIA, Etiqa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name <span className="text-gray-400 font-normal">(for payout)</span>
                </label>
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  className={inputStyle}
                  placeholder="Maybank / CIMB / RHB etc"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Account Number <span className="text-gray-400 font-normal">(for payout)</span>
                </label>
                <input
                  type="text"
                  value={form.bankAccount}
                  onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
                  className={inputStyle}
                  placeholder="1234567890"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a2e] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60"
              >
                {loading ? 'Registering...' : 'Register as Agent'}
              </button>
            </form>
          </>
        )}

        {/* STATS TAB */}
        {tab === 'stats' && (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleCheckStats} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Your Agent Code
                </label>
                <input
                  type="text"
                  required
                  value={statsCode}
                  onChange={(e) => setStatsCode(e.target.value.toUpperCase())}
                  className={inputStyle}
                  placeholder="e.g. AGT001AB"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1a2e] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60"
              >
                {loading ? 'Loading...' : 'Check My Stats'}
              </button>
            </form>

            {agentData && (
              <div className="space-y-4">
                <div className="bg-[#1a1a2e] text-white rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1">AGENT</div>
                  <div className="text-lg font-bold">{agentData.agent.name}</div>
                  <div className="text-xs text-gray-300">{agentData.agent.email}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    Code: {agentData.agent.agentCode}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">Total Parses</div>
                    <div className="text-2xl font-bold text-[#1a1a2e]">{agentData.totalParses}</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">Total Earned</div>
                    <div className="text-2xl font-bold text-green-600">
                      RM{agentData.agent.totalEarned?.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 text-center col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Pending Payout</div>
                    <div className="text-2xl font-bold text-orange-500">
                      RM{agentData.agent.pendingBalance?.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Paid on 15th and 30th of each month
                    </div>
                  </div>
                </div>

                {/* Recent activity */}
                {agentData.recentRequests?.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-[#1a1a2e] mb-3">Recent Activity</h3>
                    <div className="space-y-2">
                      {agentData.recentRequests.slice(0, 5).map((req) => (
                        <div key={req.id} className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">
                            {req.shieldType} — {new Date(req.createdAt).toLocaleDateString('en-MY')}
                          </span>
                          <span className={`font-medium px-2 py-0.5 rounded-full ${
                            req.status === 'PARSED'
                              ? 'bg-green-100 text-green-700'
                              : req.status === 'PAID'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-100">
        © 2026 AWAS Premium Resources. All rights reserved.
      </div>
    </div>
  );
}