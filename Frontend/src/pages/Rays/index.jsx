import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import RaysComponent from "./components/Rays";

export default function RaysPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <RaysComponent />
      </Layout>
    </ProtectedRoute>
  );
}