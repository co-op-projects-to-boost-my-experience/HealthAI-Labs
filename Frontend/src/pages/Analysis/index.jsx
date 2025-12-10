import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import CKDAnalysis from "./components/CKD";
import { fetchAnalysis } from "../../api";
import { useQuery } from '@tanstack/react-query';
import { useState } from "react";
import { Activity, Brain, Stethoscope } from "lucide-react";

export default function AnalysisPage() {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useQuery({
    queryKey: ['analysis'],
    queryFn: fetchAnalysis,
    retry: 1
  });

  // When CKD is selected → open CKD page
  if (selectedAnalysis === "ckd-analysis") {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
            <button
              onClick={() => setSelectedAnalysis(null)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 hover:gap-3 transition-all mb-6"
            >
              ← Back to Analysis Options
            </button>

            <CKDAnalysis />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Main Analysis Dashboard
  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-20 px-4">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="text-center mt-8 mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
                <Activity className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Medical Analysis Dashboard
              </h1>

              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose from our AI-powered medical analysis tools for accurate diagnostic insights.
              </p>
            </div>

            {/* Analysis Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Brain MRI */}
              <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 border-2 border-blue-100 hover:border-blue-300 cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Brain className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">Brain MRI Analysis</h2>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">
                      Advanced AI analysis of brain MRI scans for tumor detection and classification.
                    </p>

                    <a href="/rays" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Start Analysis →
                    </a>
                  </div>
                </div>
              </div>

              {/* CKD */}
              <div
                onClick={() => setSelectedAnalysis("ckd-analysis")}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 border-2 border-purple-100 hover:border-purple-300 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Activity className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">CKD Analysis</h2>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">
                      AI-powered Chronic Kidney Disease prediction from medical data.
                    </p>

                    <span className="text-purple-600 hover:text-purple-700 font-semibold">
                      Start Analysis →
                    </span>
                  </div>
                </div>
              </div>

              {/* Coming Soon Cards */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 opacity-75">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">Chest X-Ray Analysis</h2>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                        Coming Soon
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">
                      Comprehensive chest X-ray analysis for respiratory conditions.
                    </p>

                    <span className="text-gray-400 font-semibold">Coming Soon</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 opacity-75">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">More Coming Soon</h2>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                        Coming Soon
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">
                      Additional medical analysis tools are in development.
                    </p>

                    <span className="text-gray-400 font-semibold">Stay Tuned</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Info Section */}
            <div className="mt-16 bg-blue-50 border border-blue-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                About Our Analysis Tools
              </h3>

              <p className="text-gray-700 leading-relaxed">
                Our AI-powered tools use advanced machine learning models trained on large medical datasets.
                These tools support healthcare providers by offering quick insights and analysis. They complement
                — not replace — professional medical judgment.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
