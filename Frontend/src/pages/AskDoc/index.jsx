import Layout from "../../components/Layout";
import { fetchAskDoctor } from "../../api";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAskDoctor().then(res => setMessage(res.message));
  }, []);

  return (
    <Layout>
      <h1>AskDoctor</h1>
      <p>{message}</p>
    </Layout>
  );
}
