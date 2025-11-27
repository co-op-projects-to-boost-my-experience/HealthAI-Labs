import { useState } from "react";
import Layout from "../../components/Layout";

const diseaseInfo = {
  glioma: {
    text: "Gliomas arise from glial cells and can infiltrate surrounding brain tissue.",
    impact:
      "High-grade gliomas are aggressive and can cause seizures, headaches, and cognitive decline due to rapid pressure increase in the skull.",
  },
  meningioma: {
    text: "Meningiomas grow from the membranes surrounding the brain and spinal cord. They are often slow-growing.",
    impact:
      "While usually benign, large meningiomas can compress adjacent brain structures, leading to focal neurological deficits or seizures.",
  },
  pituitary: {
    text: "Pituitary tumors develop in the pituitary gland at the base of the brain, regulating hormones.",
    impact:
      "They may disrupt hormone balance causing systemic issues, or compress the optic chiasm leading to visual field defects.",
  },
  notumor: {
    text: "No pathological abnormalities resembling a tumor were detected in this MRI scan.",
    impact: "The scan appears healthy based on the model's training parameters.",
  },
  unknown: {
    text: "The detected pattern does not match known tumor classes with high certainty.",
    impact:
      "Please consult a medical professional for a detailed manual review.",
  },
};

export default function Rays() {
  const [activeModel, setActiveModel] = useState("brain"); // "brain" | "chest"
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("normal"); // "normal" | "error" | "success"
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { label, confidence }
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
      setStatus("Sending image to MRI model...");
      setStatusType("normal");
      setResult(null);
      setConfidencePercent(0);

      const formData = new FormData();
      // IMPORTANT: must be "file" to match FastAPI endpoint
      formData.append("file", file);

      // const response = await fetch("http://localhost:8000/rays/mri", {
      //   method: "POST",
      //   body: formData,
      // });

      // if (!response.ok) {
      //   throw new Error(`Server error: ${response.status}`);
      // }

      // const data = await response.json();

      ////////////////////////////////////
      const response = await fetch("http://localhost:8000/rays/mri", {
        method: "POST",
        body: formData,
      });

      console.log("MRI response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("MRI response JSON:", data);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        throw new Error("Invalid JSON from API");
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      // ////////////////////



      const label = data.label || "Unknown";
      const confidence = typeof data.confidence === "number" ? data.confidence : 0;

      setResult({ label, confidence });
      const percent = Math.max(0, Math.min(100, confidence * 100));
      setConfidencePercent(percent);
      setStatus("Analysis complete.");
      setStatusType("success");
    } catch (err) {
      console.error(err);
      setStatus("Failed to analyze image. Please make sure the API is running.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeClick = () => {
    if (activeModel === "brain") {
      analyzeBrainMri();
    } else {
      setStatus("Chest X-ray model is not implemented yet.");
      setStatusType("normal");
    }
  };

  const currentDiseaseInfo = (() => {
    if (!result?.label) return null;
    const normalized = result.label.toLowerCase().replace(/\s/g, "");
    return diseaseInfo[normalized] || diseaseInfo["unknown"];
  })();

  return (
    <Layout>
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              X-Rays
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Upload a scan and let the AI model provide a preliminary analysis.
              This is <span className="font-semibold">not</span> a medical
              diagnosis and must be reviewed by a qualified physician.
            </p>
          </div>

          {/* Model selector */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleModelChange("brain")}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeModel === "brain"
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Brain MRI
            </button>
            <button
              type="button"
              onClick={() => handleModelChange("chest")}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeModel === "chest"
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Chest X-ray <span className="text-xs opacity-70">(coming soon)</span>
            </button>
          </div>

          {/* Main Card */}
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
            {/* Left: Upload + Actions */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-50 text-xs font-medium text-blue-700 border border-blue-100">
                  {activeModel === "brain" ? "Brain MRI model" : "Chest X-ray model"}
                </span>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">
                  Upload scan
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Supported formats: JPEG, PNG. Max recommended size ~10MB.
                </p>
              </div>

              {/* Upload area */}
              <label
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="group relative flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-blue-50/40 hover:border-blue-400 transition cursor-pointer overflow-hidden"
              >
                {!previewUrl && (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10 transition-opacity duration-300">
                    <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                      <span className="text-blue-500 text-xl">☁️</span>
                    </div>
                    <p className="mb-1 text-sm text-slate-700 font-medium">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-slate-400">
                      MRI DICOM export (as image), JPEG, PNG
                    </p>
                  </div>
                )}

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Scan preview"
                    className="absolute inset-0 w-full h-full object-contain bg-slate-100 p-2"
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* Status text */}
              <div className="mt-3 min-h-[20px] text-center text-sm font-medium">
                {status && (
                  <p
                    className={
                      statusType === "error"
                        ? "text-red-500"
                        : statusType === "success"
                        ? "text-emerald-600"
                        : "text-slate-500"
                    }
                  >
                    {status}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={handleAnalyzeClick}
                  disabled={!file || loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg text-sm shadow-sm transition"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing…</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze scan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetUI}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Right: Result */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Diagnosis result
                  </p>
                  {/* <p className="mt-1 text-xs text-slate-400 font-mono">
                    API: <span className="font-semibold">/rays/mri</span>
                  </p> */}
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-900 text-white text-[10px] font-medium tracking-wide">
                  PRELIMINARY • NOT CLINICAL
                </span>
              </div>

              {result ? (
                <>
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {result.label}
                    </h3>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">
                      Classification
                    </p>
                  </div>

                  {currentDiseaseInfo && (
                    <div className="mb-4 px-3 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 space-y-2">
                      <p>
                        <span className="font-semibold text-slate-900">
                          Description:
                        </span>{" "}
                        {currentDiseaseInfo.text}
                      </p>
                      <p>
                        <span className="font-semibold text-red-600">
                          Impact:
                        </span>{" "}
                        {currentDiseaseInfo.impact}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        Confidence score
                      </span>
                      <span className="text-slate-900 font-bold font-mono">
                        {confidencePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-700"
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-sm text-slate-500">
                  <p className="mb-1 font-medium text-slate-600">
                    No analysis yet
                  </p>
                  <p className="text-xs">
                    Upload a scan and run the model to see the predicted class
                    and confidence score here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
            This tool is for educational and experimental purposes only. It does
            not provide medical advice, diagnosis, or treatment and must not be
            used as a substitute for professional medical judgment.
          </p>
        </div>
      </div>
    </Layout>
  );
}
