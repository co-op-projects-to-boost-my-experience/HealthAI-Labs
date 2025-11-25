import Layout from "../../components/Layout";
import { fetchNews } from "../../api";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchNews().then(res => setMessage(res.message));
  }, []);

  return (
    <Layout>
      <h1>News</h1>
      <p>{message}</p>
    </Layout>
  );
}
