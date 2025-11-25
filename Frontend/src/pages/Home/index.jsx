import Layout from "../../components/Layout";
import HeroSection from "./components/HeroSection";
import { fetchRoot } from "../../api";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRoot().then(res => setMessage(res.message));
  }, []);

  return (
    <Layout>
      <HeroSection />
      {/* API test message - you can remove this later */}
      {message && (
        <div className="text-center text-gray-500 text-sm py-4">
          API Status: {message}
        </div>
      )}
    </Layout>
  );
}