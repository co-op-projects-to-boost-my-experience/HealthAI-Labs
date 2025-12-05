import Layout from "../../components/Layout";
import CKDAnalysis from "./components/CKD";
import { fetchAnalysis } from "../../api";
import { useEffect, useState } from "react";
import { Activity, Brain, Stethoscope } from "lucide-react";

export default function Home() {
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    fetchAnalysis().then((res) => setAnalysisData(res));
  }, []);

  // If CKD is selected, show the CKD component
  if (selectedAnalysis === "ckd-analysis") {
    return (
      <Layout>
        <div className="pt-24 pb-8 px-4">
          <button
            onClick={() => setSelectedAnalysis(null)}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 hover:gap-3 transition-all"
          >
            ← Back to Analysis Options
          </button>
        </div>
        <CKDAnalysis />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Medical Analysis Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our AI-powered medical analysis tools for accurate diagnostic insights
            </p>
          </div>

          {/* Analysis Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brain MRI Analysis */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 border-2 border-blue-100 hover:border-blue-300 cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Brain MRI Analysis
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Advanced AI analysis of brain MRI scans for tumor detection and classification
                  </p>
                  <a
                    href="/rays"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Start Analysis →
                  </a>
                </div>
              </div>
            </div>

            {/* CKD Analysis */}
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
                    <h2 className="text-2xl font-bold text-gray-900">
                      CKD Analysis
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Comprehensive Chronic Kidney Disease analysis from laboratory data and medical history
                  </p>
                  <span className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold">
                    Start Analysis →
                  </span>
                </div>
              </div>
            </div>

            {/* Chest X-Ray Analysis - Coming Soon */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 opacity-75 relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Chest X-Ray Analysis
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Comprehensive chest X-ray analysis for respiratory conditions
                  </p>
                  <span className="inline-flex items-center text-gray-400 font-semibold">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>

            {/* Future Analysis Placeholder */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 opacity-75 relative overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      More Coming Soon
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Additional medical analysis tools are in development
                  </p>
                  <span className="inline-flex items-center text-gray-400 font-semibold">
                    Stay Tuned
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              About Our Analysis Tools
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Our AI-powered medical analysis tools use state-of-the-art machine learning
              algorithms trained on comprehensive medical datasets. Each tool provides instant,
              accurate insights to support healthcare professionals in making informed diagnostic
              decisions. These tools are designed to complement, not replace, professional
              medical judgment.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}