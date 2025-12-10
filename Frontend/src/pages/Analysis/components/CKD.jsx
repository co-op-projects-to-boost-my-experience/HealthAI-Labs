import { useState } from "react";
import { Activity, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function CKDAnalysis() {
  const [activeTab, setActiveTab] = useState("manual"); // 'manual' or 'csv'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // File state
  const [selectedFile, setSelectedFile] = useState(null);

  // Manual Input State - Matching backend variable names exactly
  const [formData, setFormData] = useState({
    gfr: "",
    blood_pressure: "",
    serum_calcium: "",
    urine_ph: "",
    c3_c4: "",
    serum_creatinine: "",
    bun: "",
    oxalate_levels: ""
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const submitManual = async () => {
    setLoading(true);
    setResult(null);

    // IMPORTANT: Your backend accepts these as Query Parameters, not JSON Body
    const params = new URLSearchParams(formData).toString();

    try {
      // Note: Added /api prefix to match app.py router
      const res = await fetch(`http://localhost:8000/api/analysis/ckd/manual?${params}`, {
        method: "POST",
        headers: { "Accept": "application/json" }
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Failed to connect to analysis server." });
    }
    setLoading(false);
  };

  const submitFile = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResult(null);

    const formDataToSend = new FormData();
    formDataToSend.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:8000/api/analysis/ckd/file", {
        method: "POST",
        body: formDataToSend
      });

      if (!res.ok) throw new Error("File analysis failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Server error during file upload." });
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 md:p-10 rounded-3xl shadow-xl max-w-6xl mx-auto">

      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex w-20 h-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg mb-6 animate-pulse-slow">
          <Activity className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Chronic Kidney Disease Analysis</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Advanced AI-powered analysis for CKD diagnosis and staging. Enter lab values manually or upload a CSV file.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center mb-10">
        <div className="bg-white p-1.5 rounded-xl shadow-md border border-gray-100 inline-flex">
          <button
            onClick={() => setActiveTab("manual")}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === "manual"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Manual Input
          </button>
          <button
            onClick={() => setActiveTab("csv")}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === "csv"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Upload CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-8 bg-white shadow-xl shadow-purple-100/50 p-8 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">
              {activeTab === "manual" ? "Enter Lab Values" : "Upload Data File"}
            </h2>
          </div>

          {activeTab === "manual" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="GFR (Glomerular Filtration Rate)" unit="mL/min/1.73m²" name="gfr" placeholder="60-120" onChange={handleInput} />
                <InputGroup label="C3/C4 Ratio" unit="ratio" name="c3_c4" placeholder="0.5-2.0" onChange={handleInput} />
                <InputGroup label="Blood Pressure" unit="mmHg" name="blood_pressure" placeholder="120" onChange={handleInput} />
                <InputGroup label="Serum Creatinine" unit="mg/dL" name="serum_creatinine" placeholder="0.7-1.3" onChange={handleInput} />
                <InputGroup label="Serum Calcium" unit="mg/dL" name="serum_calcium" placeholder="8.5-10.5" onChange={handleInput} />
                <InputGroup label="BUN (Blood Urea Nitrogen)" unit="mg/dL" name="bun" placeholder="7-20" onChange={handleInput} />
                <InputGroup label="Urine pH" unit="pH" name="urine_ph" placeholder="4.5-8.0" onChange={handleInput} />
                <InputGroup label="Oxalate Levels" unit="mg/24h" name="oxalate_levels" placeholder="0-40" onChange={handleInput} />
              </div>

              <button
                onClick={submitManual}
                disabled={loading}
                className="mt-8 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-95 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Analyzing Data..." : "Analyze Data"}
              </button>
            </>
          ) : (
            <div className="py-10">
              <div className="border-2 border-dashed border-blue-200 rounded-2xl p-10 text-center hover:bg-blue-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-700">
                    {selectedFile ? selectedFile.name : "Click to upload CSV file"}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">Maximum file size: 5MB</p>
                </div>
              </div>

              <button
                onClick={submitFile}
                disabled={loading || !selectedFile}
                className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-95 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing File..." : "Run Batch Analysis"}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="lg:col-span-4">
          <div className="bg-white shadow-xl shadow-blue-100/50 p-8 rounded-2xl border border-gray-100 h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Analysis Results</h2>

            {!result && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                <Activity className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-500 font-medium">Enter data and click analyze to see results</p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-blue-600 font-semibold animate-pulse">Running AI Model...</p>
              </div>
            )}

            {result && !loading && (
              <div className="mt-4 animate-fadeIn">
                {result.error ? (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-700 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Error</p>
                      <p className="text-sm">{result.error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border ${result.diagnosis_code === 1 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                      <div className="flex items-center gap-3 mb-2">
                         {result.diagnosis_code === 1 ? <AlertCircle className="text-red-600"/> : <CheckCircle className="text-green-600"/>}
                         <span className={`font-bold uppercase tracking-wider text-sm ${result.diagnosis_code === 1 ? 'text-red-600' : 'text-green-600'}`}>
                           Diagnosis
                         </span>
                      </div>
                      <p className={`text-2xl font-bold ${result.diagnosis_code === 1 ? 'text-red-900' : 'text-green-900'}`}>
                        {result.prediction}
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                      <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">CKD Stage</p>
                      <p className="text-3xl font-bold text-blue-900">{result.ckd_stage}</p>
                      <p className="text-sm text-blue-600/80 mt-2">Based on GFR and input parameters</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper component for cleaner inputs
function InputGroup({ label, unit, name, placeholder, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} <span className="text-xs text-gray-400 font-normal">({unit})</span>
      </label>
      <input
        type="number"
        step="0.01"
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-300"
      />
    </div>
  );
}