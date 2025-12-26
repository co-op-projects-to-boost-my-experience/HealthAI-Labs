// src/pages/Analysis/components/ASCVD.jsx

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { analyzeASCVDRisk } from "../../../api";
import { Heart, Upload, FileText, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

export default function ASCVDAnalysis() {
  // Manual Input State
  const [formData, setFormData] = useState({
    blood_glucose: "",
    HbA1C: "",
    Systolic_BP: "",
    Diastolic_BP: "",
    LDL: "",
    HDL: "",
    Triglycerides: "",
    Haemoglobin: "",
    MCV: ""
  });

  const [errorMessage, setErrorMessage] = useState(null);

  // TanStack Query mutation
  const mutation = useMutation({
    mutationFn: analyzeASCVDRisk,
    onSuccess: (data) => {
      console.log("✅ ASCVD Analysis Success:", data);
      setErrorMessage(null);
    },
    onError: (error) => {
      console.error("❌ ASCVD Analysis Error:", error);
      setErrorMessage(error?.message || "Analysis failed. Please try again.");
    }
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitAnalysis = async () => {
    console.log("🔄 Starting ASCVD Analysis...");
    console.log("📊 Form Data:", formData);

    // Reset any previous errors
    setErrorMessage(null);

    // Convert string values to numbers
    const numericData = {};
    for (const [key, value] of Object.entries(formData)) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setErrorMessage(`Invalid value for ${key}: ${value}`);
        return;
      }
      numericData[key] = numValue;
    }

    console.log("📤 Sending Data:", numericData);

    try {
      await mutation.mutateAsync(numericData);
    } catch (error) {
      console.error("Mutation error caught:", error);
    }
  };

  const handleReset = () => {
    setFormData({
      blood_glucose: "",
      HbA1C: "",
      Systolic_BP: "",
      Diastolic_BP: "",
      LDL: "",
      HDL: "",
      Triglycerides: "",
      Haemoglobin: "",
      MCV: ""
    });
    setErrorMessage(null);
    mutation.reset();
  };

  const isFormValid = () => {
    return Object.values(formData).every(val => val !== "" && !isNaN(parseFloat(val)));
  };

  const getDiseaseIcon = (disease) => {
    if (disease === 'Fit') return <CheckCircle className="w-6 h-6" />;
    return <AlertCircle className="w-6 h-6" />;
  };

  const result = mutation.data;
  const loading = mutation.isPending;

  // Debug logging
  console.log("🔍 Component State:", {
    loading,
    hasResult: !!result,
    hasError: mutation.isError,
    errorMessage,
    mutationStatus: mutation.status
  });

  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-red-50 p-6 md:p-10 rounded-3xl shadow-xl max-w-6xl mx-auto">

      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex w-20 h-20 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-pink-600 shadow-lg mb-6 animate-pulse-slow">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">ASCVD Risk Assessment</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Comprehensive cardiovascular disease risk prediction using advanced AI analysis of blood markers and vital signs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-8 bg-white shadow-xl shadow-pink-100/50 p-8 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-800">Enter Health Markers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood Sugar */}
            <InputGroup 
              label="Blood Glucose" 
              unit="mg/dL" 
              name="blood_glucose" 
              placeholder="70-100" 
              value={formData.blood_glucose}
              onChange={handleInput}
              icon="🩸"
            />
            <InputGroup 
              label="HbA1C" 
              unit="%" 
              name="HbA1C" 
              placeholder="4.0-6.0" 
              value={formData.HbA1C}
              onChange={handleInput}
              icon="📊"
            />

            {/* Blood Pressure */}
            <InputGroup 
              label="Systolic Blood Pressure" 
              unit="mmHg" 
              name="Systolic_BP" 
              placeholder="90-120" 
              value={formData.Systolic_BP}
              onChange={handleInput}
              icon="💓"
            />
            <InputGroup 
              label="Diastolic Blood Pressure" 
              unit="mmHg" 
              name="Diastolic_BP" 
              placeholder="60-80" 
              value={formData.Diastolic_BP}
              onChange={handleInput}
              icon="💓"
            />

            {/* Cholesterol */}
            <InputGroup 
              label="LDL Cholesterol" 
              unit="mg/dL" 
              name="LDL" 
              placeholder="< 100" 
              value={formData.LDL}
              onChange={handleInput}
              icon="🧪"
            />
            <InputGroup 
              label="HDL Cholesterol" 
              unit="mg/dL" 
              name="HDL" 
              placeholder="> 40" 
              value={formData.HDL}
              onChange={handleInput}
              icon="🧪"
            />
            <InputGroup 
              label="Triglycerides" 
              unit="mg/dL" 
              name="Triglycerides" 
              placeholder="< 150" 
              value={formData.Triglycerides}
              onChange={handleInput}
              icon="🧪"
            />

            {/* Blood Tests */}
            <InputGroup 
              label="Haemoglobin" 
              unit="g/dL" 
              name="Haemoglobin" 
              placeholder="12-16" 
              value={formData.Haemoglobin}
              onChange={handleInput}
              icon="🔬"
            />
            <InputGroup 
              label="MCV (Mean Corpuscular Volume)" 
              unit="fL" 
              name="MCV" 
              placeholder="80-100" 
              value={formData.MCV}
              onChange={handleInput}
              icon="🔬"
            />
          </div>

          {/* Error Message at Form Level */}
          {errorMessage && (
            <div className="mt-6 bg-red-50 p-4 rounded-xl border border-red-100 text-red-700 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Validation Error</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <button
              onClick={submitAnalysis}
              disabled={!isFormValid() || loading}
              className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-95 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Data...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Assess Cardiovascular Risk
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="px-6 py-4 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
          </div>

          {/* Debug Info (Remove in production) */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <strong>Debug:</strong> Status: {mutation.status} | 
            Has Result: {result ? 'Yes' : 'No'} | 
            Error: {mutation.isError ? 'Yes' : 'No'}
          </div>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="lg:col-span-4">
          <div className="bg-white shadow-xl shadow-red-100/50 p-8 rounded-2xl border border-gray-100 h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Risk Assessment</h2>

            {!result && !loading && !mutation.isError && (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                <Heart className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-500 font-medium">Enter your health markers to assess cardiovascular risk</p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <p className="text-red-600 font-semibold animate-pulse">Running AI Analysis...</p>
              </div>
            )}

            {mutation.isError && !loading && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-700 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Error</p>
                  <p className="text-sm">{mutation.error?.message || 'Analysis failed. Please try again.'}</p>
                </div>
              </div>
            )}

            {result && mutation.isSuccess && !loading && (
              <div className="mt-4 animate-fadeIn space-y-6">
                {/* Disease Prediction */}
                <div className={`p-6 rounded-2xl border ${
                  result.disease === 'Fit' 
                    ? 'bg-green-50 border-green-100' 
                    : 'bg-red-50 border-red-100'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    {getDiseaseIcon(result.disease)}
                    <span className={`font-bold uppercase tracking-wider text-sm ${
                      result.disease === 'Fit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Assessment Result
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${
                    result.disease === 'Fit' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.disease.replace(/_/g, ' ')}
                  </p>
                </div>

                {/* Recommendations Card */}
                {result.recommendation && (
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
                    <div>
                      <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">
                        Prevention
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {result.recommendation.prevention}
                      </p>
                    </div>

                    <div className="border-t border-blue-200 pt-4">
                      <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">
                        Treatment Plan
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {result.recommendation.treatment}
                      </p>
                    </div>

                    <div className="border-t border-blue-200 pt-4">
                      <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">
                        Suggested Action
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {result.recommendation.suggested_plan}
                      </p>
                    </div>
                  </div>
                )}

                {/* Info Note */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-xs text-yellow-800 leading-relaxed">
                    <strong>Note:</strong> This is an AI-assisted assessment. Always consult with a healthcare professional for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Info Footer */}
      <div className="mt-10 bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-600" />
          About ASCVD Risk Assessment
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          This tool uses machine learning to analyze multiple health markers including blood glucose, cholesterol levels, 
          blood pressure, and blood cell counts to predict cardiovascular disease risk. Early detection enables timely 
          intervention and lifestyle modifications to reduce risk factors.
        </p>
      </div>
    </div>
  );
}

// Helper component for cleaner inputs
function InputGroup({ label, unit, name, placeholder, value, onChange, icon }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        {label} <span className="text-xs text-gray-400 font-normal">({unit})</span>
      </label>
      <input
        type="number"
        step="0.01"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-gray-300"
        required
      />
    </div>
  );
}