import Layout from "../../components/Layout";
import AboutHero from "./components/About";
import { fetchAbout } from "../../api";
import { useEffect, useState } from "react";

export default function About() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAbout().then(res => setMessage(res.message));
  }, []);

  return (
    <Layout>
      <AboutHero />
      {message && <p className="text-center py-4 text-gray-600">{message}</p>}
    </Layout>
  );
}