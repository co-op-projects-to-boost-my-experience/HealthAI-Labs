import Layout from "../../components/Layout";
import { fetchAbout } from "../../api";
import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAbout().then(res => setMessage(res.message));
  }, []);

  return (
    <Layout>
      <h1>About</h1>
      <p>{message}</p>
    </Layout>
  );
}
