import axios from "axios";

// Use the Docker service name for backend
const API_URL = "http://backend:8000";
const API_BASE_URL = '/api'; // Relative path so Nginx handles the proxy

export const fetchRoot = async () => {
  const res = await axios.get(`${API_URL}/`);
  return res.data;
};

export const fetchRays = async () => {
  const res = await axios.get(`${API_URL}/rays`);
  return res.data;
};

export const fetchReport = async () => {
  const res = await axios.get(`${API_URL}/report`);
  return res.data;
};

export const fetchAbout = async () => {
  const res = await axios.get(`${API_URL}/about`);
  return res.data;
};

export const fetchAnalysis = async () => {
  const res = await axios.get(`${API_URL}/analysis`);
  return res.data;
};

export const fetchAskDoctor = async () => {
  const res = await axios.get(`${API_URL}/askdoctor`);
  return res.data;
};

export const fetchContact = async () => {
  const res = await axios.get(`${API_URL}/contact`);
  return res.data;
};

export const fetchNews = async (page = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/news?category=health&lang=en&page=${page}`);
    console.log('Cache Status:', response.headers.get('X-Cache-Status'));

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
};