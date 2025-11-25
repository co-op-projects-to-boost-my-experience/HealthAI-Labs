import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { fetchRays } from "../../api";

export default function Rays() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRays().then(res => setMessage(res.message));
  }, []);

  return (
    <Layout>
      <h1>Rays Page</h1>
      <p>{message}</p>
    </Layout>
  );
}
