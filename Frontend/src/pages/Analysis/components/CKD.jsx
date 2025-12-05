import { useState } from "react";
import { Upload, Activity, FileText, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function CKDAnalysis() {
  const [activeTab, setActiveTab] = useState("manual"); // 'manual' or 'file'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Manual input form state
  const [formData, setFormData] = useState({
    gfr: "",
    c3_c4: "",
    blood_pressure: "",
    serum_creatinine: "",
    serum_calcium: "",
    bun: "",
    urine_ph: "",
    oxalate_levels: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
        setError("Please upload a CSV file");
        return;
      }
      setSelectedFile(file);
      setError(null);
      setResult(null);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams(formData);
      const response = await fetch(
        `http://localhost:8000/api/analysis/ckd/manual?${params}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || "Analysis failed");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append("file", selectedFile);

      const response = await fetch(
        "http://localhost:8000/api/analysis/ckd/file",
        {
          method: "POST",
          body: formDataObj,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || "Analysis failed");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const inputFields = [
    { name: "gfr", label: "GFR (Glomerular Filtration Rate)", unit: "mL/min/1.73m²", placeholder: "60-120" },
    { name: "c3_c4", label: "C3/C4 Ratio", unit: "", placeholder: "0.5-2.0" },
    { name: "blood_pressure", label: "Blood Pressure", unit: "mmHg", placeholder: "120" },
    { name: "serum_creatinine", label: "Serum Creatinine", unit: "mg/dL", placeholder: "0.7-1.3" },
    { name: "serum_calcium", label: "Serum Calcium", unit: "mg/dL", placeholder: "8.5-10.5" },
    { name: "bun", label: "BUN (Blood Urea Nitrogen)", unit: "mg/dL", placeholder: "7-20" },
    { name: "urine_ph", label: "Urine pH", unit: "", placeholder: "4.5-8.0" },
    { name: "oxalate_levels", label: "Oxalate Levels", unit: "mg/24h", placeholder: "0-40" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chronic Kidney Disease Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered analysis for CKD diagnosis and staging. Enter lab values manually or upload a CSV file.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setActiveTab("manual")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "manual"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Manual Input
            </button>
            <button
              onClick={() => setActiveTab("file")}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === "file"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Upload CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {activeTab === "manual" ? (
                <form onSubmit={handleManualSubmit}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    Enter Lab Values
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {inputFields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {field.unit && (
                            <span className="text-gray-500 text-xs ml-1">({field.unit})</span>
                          )}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity className="w-5 h-5" />
                        Analyze Data
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleFileSubmit}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Upload className="w-6 h-6 text-blue-600" />
                    Upload CSV File
                  </h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <label className="cursor-pointer">
                      <span className="text-blue-600 font-semibold hover:text-blue-700">
                        Click to upload
                      </span>
                      <span className="text-gray-600"> or drag and drop</span>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">CSV file with 8 columns required</p>
                    {selectedFile && (
                      <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                        <FileText className="w-4 h-4" />
                        {selectedFile.name}
                      </div>
                    )}
                  </div>
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Expected columns:</p>
                    <p className="text-xs text-gray-600 font-mono">
                      gfr, c3_c4, blood_pressure, serum_creatinine, serum_calcium, bun, urine_ph, oxalate_levels
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isAnalyzing || !selectedFile}
                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Activity className="w-5 h-5" />
                        Analyze File
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  <div
                    className={`rounded-lg p-6 ${
                      result.diagnosis_code === 1
                        ? "bg-red-50 border border-red-200"
                        : "bg-green-50 border border-green-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.diagnosis_code === 1 ? (
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Diagnosis</p>
                        <p
                          className={`text-sm ${
                            result.diagnosis_code === 1 ? "text-red-700" : "text-green-700"
                          }`}
                        >
                          {result.prediction}
                        </p>
                      </div>
                    </div>
                  </div>

                  {result.diagnosis_code === 1 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <p className="font-semibold text-gray-900 mb-1">CKD Stage</p>
                      <p className="text-2xl font-bold text-orange-700">{result.ckd_stage}</p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> This analysis is for informational purposes only.
                      Please consult with a healthcare professional for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>
              )}

              {!result && !error && (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Enter data and click analyze to see results
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600">
              Advanced machine learning algorithms for accurate predictions
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Instant Results</h3>
            <p className="text-sm text-gray-600">
              Get diagnosis and stage classification in seconds
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Accurate Analysis</h3>
            <p className="text-sm text-gray-600">
              Trained on comprehensive medical datasets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}