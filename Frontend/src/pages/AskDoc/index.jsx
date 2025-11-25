import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import ComingSoon from "./components/ComingSoon";

export default function AskDoc() {
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <Layout>
      <ComingSoon onNavigate={handleNav} />
    </Layout>
  );
}
