import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import ComingSoon from "./components/ComingSoon";

export default function AskDocPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <ComingSoon />
      </Layout>
    </ProtectedRoute>
  );
}