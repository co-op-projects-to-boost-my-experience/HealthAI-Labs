import Layout from "../../components/Layout";
import { fetchReport } from "../../api";
import { useEffect, useState } from "react";

export default function Report() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchReport().then(res => setMessage(res.message));
  }, []);

  return (
    <Layout>
      <h1>Report</h1>
      <p>{message}</p>
    </Layout>
  );
}
