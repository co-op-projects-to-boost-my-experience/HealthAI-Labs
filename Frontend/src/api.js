import axios from "axios";

// =========================
// API Base URL Configuration
// =========================
// In development: uses VITE_API_URL from .env (http://localhost:8000/api)
// In production: uses relative path /api (nginx proxies to backend)
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// =========================
// Axios Global Config
// =========================
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Accept'] = 'application/json';

// =========================
// Generic GET Helper
// =========================
async function get(endpoint, params = {}) {
  try {
    const res = await axios.get(`${API_BASE_URL}${endpoint}`, { params });
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] GET ${endpoint}:`, error.message || error);
    throw error;
  }
}

// =========================
// Generic POST Helper
// =========================
async function post(endpoint, data = {}, config = {}) {
  try {
    const res = await axios.post(`${API_BASE_URL}${endpoint}`, data, config);
    return res.data;
  } catch (error) {
    console.error(`[API ERROR] POST ${endpoint}:`, error.message || error);
    throw error;
  }
}

// =========================
// API Endpoints
// =========================
export const fetchRoot = () => get('/');
export const fetchRays = () => get('/rays');
export const fetchReport = () => get('/report');
export const fetchAbout = () => get('/about');
export const fetchAnalysis = () => get('/analysis');
export const fetchAskDoctor = () => get('/askdoctor');
export const fetchContact = () => get('/contact');

export const fetchNews = (page = 1, category = "health", lang = "en") => 
  get('/news', { category, lang, page });

// ✅ MRI Upload - matches backend endpoint /api/rays/mri
export const uploadMri = (formData) =>
  post('/rays/mri', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });