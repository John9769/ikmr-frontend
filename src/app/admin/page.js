'use client';
import { useState, useEffect } from 'react';
import { adminLogin, getAdminStats, getAdminParses, getAdminAgents, approveAgent, rejectAgent, markPayoutDone } from '@/lib/api';

const inputStyle = "w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] placeholder-gray-400";

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [parses, setParses] = useState([]);
  const [agents, setAgents] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    const saved = localStorage.getItem('ikmr_admin_token');
    if (saved) {
      setToken(saved);
      setLoggedIn(true);
      loadStats(saved);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminLogin(form);
      const t = res.data.token;
      localStorage.setItem('ikmr_admin_token', t);
      setToken(t);
      setLoggedIn(true);
      loadStats(t);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (t) => {
    try {
      const res = await getAdminStats(t);
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const loadParses = async () => {
    try {
      const res = await getAdminParses(token, 1, '', '');
      setParses(res.data.parses);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAgents = async () => {
    try {
      const res = await getAdminAgents(token);
      setAgents(res.data.agents);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'parses' && parses.length === 0) loadParses();
    if (tab === 'agents' && agents.length === 0) loadAgents();
  };

  const handlePayout = async (agentId, agentName) => {
    if (!confirm(`Mark payout done for ${agentName}?`)) return;
    try {
      await markPayoutDone(token, agentId);
      loadAgents();
      loadStats(token);
    } catch (err) {
      alert(err.response?.data?.message || 'Payout failed');
    }
  };

  const handleApprove = async (agentId, agentName) => {
    if (!confirm(`Approve ${agentName} as an active agent?`)) return;
    try {
      await approveAgent(token, agentId);
      loadAgents();
      loadStats(token);
    } catch (err) {
      alert(err.response?.data?.message || 'Approve failed');
    }
  };

  const handleReject = async (agentId, agentName) => {
    if (!confirm(`Reject and remove application from ${agentName}? This cannot be undone.`)) return;
    try {
      await rejectAgent(token, agentId);
      loadAgents();
      loadStats(token);
    } catch (err) {
      alert(err.response?.data?.message || 'Reject failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ikmr_admin_token');
    setLoggedIn(false);
    setToken('');
    setStats(null);
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="bg-[#1a1a2e] p-6 text-center">
          <div className="text-3xl font-bold text-white tracking-wide">IKMR</div>
          <div className="text-sm text-gray-300 mt-1">Admin Dashboard</div>
        </div>
        <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-md mx-auto w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Admin Login</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputStyle}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a2e] text-white py-3 rounded-lg font-semibold text-sm disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1a1a2e] text-white px-4 py-4 flex justify-between items-center">
        <div>
          <div className="text-lg font-bold">IKMR Admin</div>
          <div className="text-xs text-gray-400">AWAS Premium Resources</div>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-gray-300 border border-gray-600 px-3 py-1 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-6 max-w-4xl mx-auto overflow-x-auto">
          {['stats', 'parses', 'agents'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`py-3 text-sm font-medium capitalize border-b-2 whitespace-nowrap flex items-center gap-1 ${
                activeTab === tab
                  ? 'border-[#1a1a2e] text-[#1a1a2e]'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {tab}
              {tab === 'agents' && stats?.pendingAgents > 0 && (
                <span className="bg-orange-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {stats.pendingAgents}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">

        {/* STATS */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Total Parses</div>
                <div className="text-2xl font-bold text-[#1a1a2e]">{stats.totalParses}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Active Agents</div>
                <div className="text-2xl font-bold text-[#1a1a2e]">{stats.totalAgents}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Revenue MTD</div>
                <div className="text-2xl font-bold text-green-600">RM{stats.revenueMTD}</div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Revenue YTD</div>
                <div className="text-2xl font-bold text-green-600">RM{stats.revenueYTD}</div>
              </div>
            </div>

            {stats.pendingAgents > 0 && (
              <button
                onClick={() => handleTabChange('agents')}
                className="w-full bg-orange-50 border border-orange-200 text-orange-700 rounded-xl p-4 text-sm font-semibold text-left flex justify-between items-center"
              >
                <span>🔔 {stats.pendingAgents} agent application{stats.pendingAgents > 1 ? 's' : ''} pending approval</span>
                <span>Review →</span>
              </button>
            )}

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-sm font-bold text-[#1a1a2e] mb-3">Breakdown</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">🚗 Motor Parses</span>
                  <span className="font-semibold">{stats.motorCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">🏥 Medical Parses</span>
                  <span className="font-semibold">{stats.medicalCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">👤 Direct Parses</span>
                  <span className="font-semibold">{stats.directParses}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">🤝 Agent Parses</span>
                  <span className="font-semibold">{stats.agentParses}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2">
                  <span className="text-gray-500">💰 Pending Payouts</span>
                  <span className="font-semibold text-orange-500">
                    RM{stats.pendingPayouts?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => loadStats(token)}
              className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg text-sm"
            >
              Refresh Stats
            </button>
          </div>
        )}

        {/* PARSES */}
        {activeTab === 'parses' && (
          <div className="space-y-3">
            {parses.map((p) => (
              <div key={p.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-bold text-[#1a1a2e]">{p.email}</div>
                    <div className="text-xs text-gray-500">{p.phone}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                    p.status === 'PARSED' ? 'bg-green-100 text-green-700' :
                    p.status === 'PAID' ? 'bg-blue-100 text-blue-700' :
                    p.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {p.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>Type: <span className="font-medium text-[#1a1a2e]">{p.shieldType}</span></div>
                  <div>Agent: <span className="font-medium text-[#1a1a2e]">{p.agentCode || 'Direct'}</span></div>
                  <div className="col-span-2">
                    Date: <span className="font-medium text-[#1a1a2e]">
                      {new Date(p.createdAt).toLocaleDateString('en-MY')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AGENTS */}
        {activeTab === 'agents' && (
          <div className="space-y-3">
            {agents.filter(a => !a.isActive).length > 0 && (
              <div className="text-xs font-bold text-orange-600 uppercase tracking-wide pt-1">
                Pending Approval
              </div>
            )}
            {agents.filter(a => !a.isActive).map((agent) => (
              <div key={agent.id} className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-bold text-[#1a1a2e]">{agent.name}</div>
                    <div className="text-xs text-gray-500">{agent.email}</div>
                    <div className="text-xs text-gray-500">{agent.phone}</div>
                    <div className="text-xs text-gray-500">Code: {agent.agentCode}</div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full font-medium bg-orange-100 text-orange-700">
                    PENDING
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                  <div>License: <span className="font-medium text-[#1a1a2e]">{agent.licenseNumber || '—'}</span></div>
                  <div>Insurer: <span className="font-medium text-[#1a1a2e]">{agent.insurerName || '—'}</span></div>
                  <div className="col-span-2">Bank: <span className="font-medium text-[#1a1a2e]">{agent.bankName} — {agent.bankAccount}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApprove(agent.id, agent.name)}
                    className="bg-green-600 text-white py-2 rounded-lg text-xs font-bold"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleReject(agent.id, agent.name)}
                    className="bg-red-600 text-white py-2 rounded-lg text-xs font-bold"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}

            {agents.filter(a => a.isActive).length > 0 && (
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide pt-3">
                Active Agents
              </div>
            )}
            {agents.filter(a => a.isActive).map((agent) => (
              <div key={agent.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-bold text-[#1a1a2e]">{agent.name}</div>
                    <div className="text-xs text-gray-500">{agent.email}</div>
                    <div className="text-xs text-gray-500">Code: {agent.agentCode}</div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                    ACTIVE
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
                  <div>Parses: <span className="font-bold text-[#1a1a2e]">{agent._count?.parseRequests || 0}</span></div>
                  <div>Earned: <span className="font-bold text-green-600">RM{agent.totalEarned?.toFixed(2)}</span></div>
                  <div>Pending: <span className="font-bold text-orange-500">RM{agent.pendingBalance?.toFixed(2)}</span></div>
                </div>
                {agent.pendingBalance > 0 && (
                  <button
                    onClick={() => handlePayout(agent.id, agent.name)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg text-xs font-bold"
                  >
                    Mark Payout Done — RM{agent.pendingBalance?.toFixed(2)}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}