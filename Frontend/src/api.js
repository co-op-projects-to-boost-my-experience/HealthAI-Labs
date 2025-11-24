import axios from "axios";

// Use the Docker service name for backend
const API_URL = "http://backend:8000";

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

export const fetchNews = async () => {
  const res = await axios.get(`${API_URL}/news`);
  return res.data;
};

export const fetchAnalysis = async () => {
  const res = await axios.get(`${API_URL}/analysis`);
  return res.data;
};

export const fetchAskDoctor = async () => {
  const res = await axios.get(`${API_URL}/ask-doctor`);
  return res.data;
};
