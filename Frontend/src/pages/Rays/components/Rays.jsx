import { useState } from "react";
import { uploadMri } from "../../../api";
import { Upload, Brain, Loader2, CheckCircle, AlertCircle, Activity } from "lucide-react";

const diseaseInfo = {
  glioma: {
    text: "Gliomas arise from glial cells and can infiltrate surrounding brain tissue.",
    impact: "High-grade gliomas are aggressive and can cause seizures, headaches, and cognitive decline due to rapid pressure increase in the skull.",
    color: "red"
  },
  meningioma: {
    text: "Meningiomas grow from the membranes surrounding the brain and spinal cord. They are often slow-growing.",
    impact: "While usually benign, large meningiomas can compress adjacent brain structures, leading to focal neurological deficits or seizures.",
    color: "yellow"
  },
  pituitary: {
    text: "Pituitary tumors develop in the pituitary gland at the base of the brain, regulating hormones.",
    impact: "They may disrupt hormone balance causing systemic issues, or compress the optic chiasm leading to visual field defects.",
    color: "purple"
  },
  notumor: {
    text: "No pathological abnormalities resembling a tumor were detected in this MRI scan.",
    impact: "The scan appears healthy based on the model's training parameters.",
    color: "green"
  },
  unknown: {
    text: "The detected pattern does not match known tumor classes with high certainty.",
    impact: "Please consult a medical professional for a detailed manual review.",
    color: "gray"
  },
};

export default function RaysComponent() {
  const [activeModel, setActiveModel] = useState("brain");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("normal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [confidencePercent, setConfidencePercent] = useState(0);

  const resetUI = () => {
    setFile(null);
    setPreviewUrl("");
    setStatus("");
    setStatusType("normal");
    setResult(null);
    setConfidencePercent(0);
  };

  const handleModelChange = (model) => {
    setActiveModel(model);
    resetUI();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setStatus("Invalid file format. Please upload an image file.");
      setStatusType("error");
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setStatus("Image ready for analysis.");
    setStatusType("normal");
    setResult(null);
    setConfidencePercent(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (!dropped.type.startsWith("image/")) {
      setStatus("Invalid file format. Please upload an image file.");
      setStatusType("error");
      return;
    }
    setFile(dropped);
    setPreviewUrl(URL.createObjectURL(dropped));
    setStatus("Image ready for analysis.");
    setStatusType("normal");
    setResult(null);
    setConfidencePercent(0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const analyzeBrainMri = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setStatus("Analyzing your medical image...");
      setStatusType("normal");
      setResult(null);
      setConfidencePercent(0);

      const formData = new FormData();
      formData.append("file", file);

      const data = await uploadMri(formData);

      const label = data.prediction || "Unknown";
      const confidence = typeof data.confidence === "number" ? data.confidence : 0;

      setResult({ label, confidence });
      const percent = Math.max(0, Math.min(100, confidence * 100));
      setConfidencePercent(percent);
      setStatus("Analysis complete.");
      setStatusType("success");
    } catch (err) {
      console.error("Analysis error:", err);
      setStatus("Failed to analyze image. Please ensure the API is running and try again.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeClick = () => {
    if (activeModel === "brain") {
      analyzeBrainMri();
    } else {
      setStatus("Chest X-ray analysis coming soon!");
      setStatusType("normal");
    }
  };

  const currentDiseaseInfo = (() => {
    if (!result?.label) return null;
    const normalized = result.label.toLowerCase().replace(/\s/g, "");
    return diseaseInfo[normalized] || diseaseInfo["unknown"];
  })();

  return (
    // CHANGED: Changed 'py-12' to 'pt-32 pb-12' to push content down
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Activity className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Medical Imaging Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your MRI scans for instant AI-powered analysis. Get accurate diagnostic insights in seconds.
          </p>
        </div>

        {/* Model Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          <button
            onClick={() => handleModelChange("brain")}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
              activeModel === "brain"
                ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${activeModel === "brain" ? "bg-blue-500" : "bg-blue-100"}`}>
                <Brain className={`w-6 h-6 ${activeModel === "brain" ? "text-white" : "text-blue-600"}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Brain MRI Analysis</h3>
                <p className="text-sm text-gray-600">
                  Advanced AI analysis of brain MRI scans for tumor detection and classification
                </p>
              </div>
            </div>
            {activeModel === "brain" && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="w-6 h-6 text-blue-500" />
              </div>
            )}
          </button>

          <button
            onClick={() => handleModelChange("chest")}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
              activeModel === "chest"
                ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${activeModel === "chest" ? "bg-blue-500" : "bg-purple-100"}`}>
                <Activity className={`w-6 h-6 ${activeModel === "chest" ? "text-white" : "text-purple-600"}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Chest X-Ray Analysis</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive chest X-ray analysis for respiratory conditions
                </p>
                <span className="inline-block mt-2 text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">
                  Coming Soon
                </span>
              </div>
            </div>
            {activeModel === "chest" && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="w-6 h-6 text-blue-500" />
              </div>
            )}
          </button>
        </div>

        {/* Main Analysis Area */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Upload Section */}
            <div className="p-8">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                  previewUrl
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />

                {!previewUrl ? (
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Upload Medical Image
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Drag and drop your file here, or click to browse
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="px-3 py-1 bg-white rounded-full border border-gray-200">PNG</span>
                        <span className="px-3 py-1 bg-white rounded-full border border-gray-200">JPG</span>
                        <span className="px-3 py-1 bg-white rounded-full border border-gray-200">JPEG</span>
                      </div>
                    </div>
                  </label>
                ) : (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full h-auto max-h-96 mx-auto rounded-xl shadow-md"
                    />
                    <div className="flex justify-center">
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Change Image
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyzeClick}
                disabled={!file || loading}
                className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  !file || loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-6 h-6" />
                    Start Analysis
                  </>
                )}
              </button>

              {/* Status Message */}
              {status && (
                <div
                  className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${
                    statusType === "error"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : statusType === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {statusType === "error" ? (
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : statusType === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Activity className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="flex-1">{status}</p>
                </div>
              )}
            </div>

            {/* Results Section */}
            {result && (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 border-t border-gray-200">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                    Analysis Results
                  </h2>

                  {/* Prediction Card */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Detected Condition</p>
                        <h3 className="text-3xl font-bold text-gray-900">{result.label}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Confidence Level</p>
                        <p className="text-3xl font-bold text-blue-600">{confidencePercent.toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Disease Information */}
                  {currentDiseaseInfo && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h4 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Clinical Information
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{currentDiseaseInfo.text}</p>
                      </div>

                      <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h4 className="font-semibold text-lg text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Clinical Impact
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{currentDiseaseInfo.impact}</p>
                      </div>

                      {/* Disclaimer */}
                      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-orange-900 mb-1">Medical Disclaimer</h4>
                            <p className="text-sm text-orange-800">
                              This AI analysis is for informational purposes only and should not replace professional medical advice. 
                              Please consult with a qualified healthcare provider for proper diagnosis and treatment.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        {!result && (
          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">
                Advanced deep learning models trained on thousands of medical images
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">
                Get diagnostic insights in seconds, not days
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Accurate Analysis</h3>
              <p className="text-sm text-gray-600">
                High accuracy rates validated through rigorous testing
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}