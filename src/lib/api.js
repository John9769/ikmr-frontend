import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// PAYMENT
export const createBill = (data) => api.post('/payment/create-bill', data);
export const checkPaymentStatus = (parseRequestId) => api.get(`/payment/status/${parseRequestId}`);

// PARSER
export const parsePolicy = (formData) => api.post('/parser/parse', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// AGENT
export const validateAgentCode = (agentCode) => api.get(`/agent/validate/${agentCode}`);
export const registerAgent = (data) => api.post('/agent/register', data);
export const getAgentStats = (agentCode) => api.get(`/agent/stats/${agentCode}`);

// ADMIN
export const adminLogin = (data) => api.post('/admin/login', data);
export const getAdminStats = (token) => api.get('/admin/stats', {
  headers: { Authorization: `Bearer ${token}` }
});
export const getAdminParses = (token, page, status, shieldType) => api.get(
  `/admin/parses?page=${page}&status=${status || ''}&shieldType=${shieldType || ''}`,
  { headers: { Authorization: `Bearer ${token}` } }
);
export const getAdminAgents = (token) => api.get('/admin/agents', {
  headers: { Authorization: `Bearer ${token}` }
});
export const markPayoutDone = (token, agentId) => api.post(`/admin/payout/${agentId}`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});

export default api;