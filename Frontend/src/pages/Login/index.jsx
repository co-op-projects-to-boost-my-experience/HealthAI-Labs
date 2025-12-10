import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import LoginComponent from "./components/login"; // Changed from "./components/Login"
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't show login if already authenticated
  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <LoginComponent />
    </Layout>
  );
}