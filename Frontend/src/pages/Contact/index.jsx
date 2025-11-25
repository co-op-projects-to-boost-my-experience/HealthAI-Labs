import Layout from "../../components/Layout";
import { fetchContact } from "../../api";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchContact().then(res => setMessage(res.message));
  }, []);

  return (
    <Layout>
      <h1>Contact US</h1>
      <p>{message}</p>
    </Layout>
  );
}
