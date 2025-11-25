import Layout from "../../components/Layout";
import { fetchAnalysis } from "../../api";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAnalysis().then(res => setMessage(res.message));
  }, []);

  return (
    <Layout>
      <h1>Analysis</h1>
      <p>{message}</p>
    </Layout>
  );
}
