import React, { useEffect, useState } from "react";
import {
  fetchRoot,
  fetchRays,
  fetchReport,
  fetchAbout,
  fetchNews,
  fetchAnalysis,
  fetchAskDoctor,
} from "./api";

function App() {
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const root = await fetchRoot();
      const rays = await fetchRays();
      const report = await fetchReport();
      const about = await fetchAbout();
      const news = await fetchNews();
      const analysis = await fetchAnalysis();
      const askDoctor = await fetchAskDoctor();

      setMessages({
        root: root.message,
        rays: rays.message,
        report: report.message,
        about: about.message,
        news: news.message,
        analysis: analysis.message,
        askDoctor: askDoctor.message,
      });
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Health API Dashboard</h1>
      <ul>
        <li>Root: {messages.root}</li>
        <li>Rays: {messages.rays}</li>
        <li>Report: {messages.report}</li>
        <li>About: {messages.about}</li>
        <li>News: {messages.news}</li>
        <li>Analysis: {messages.analysis}</li>
        <li>Ask Doctor: {messages.askDoctor}</li>
      </ul>
    </div>
  );
}

export default App;
