import Layout from "../../components/Layout";
import NewsList from "./components/News"; 

export default function Home() {
  return (
    <Layout>
      {/* No extra padding needed as NewsList component handles its own spacing */}
      <NewsList />
    </Layout>
  );
}
