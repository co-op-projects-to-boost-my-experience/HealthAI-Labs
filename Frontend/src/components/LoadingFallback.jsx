// src/components/LoadingFallback.jsx
export default function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading HealthAI Lab</h2>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );
}