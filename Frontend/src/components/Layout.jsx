// src/components/Layout.jsx
import { useState, useEffect, Suspense } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoadingFallback from "./LoadingFallback";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Main content with proper spacing */}
      <main className="flex-1 w-full">
        <div className="pt-24 pb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <Suspense fallback={<LoadingFallback />}>
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading...</p>
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn">
                {children}
              </div>
            )}
          </Suspense>
        </div>
      </main>

      {/* Footer appears ONLY ONCE here */}
      <Footer />
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}