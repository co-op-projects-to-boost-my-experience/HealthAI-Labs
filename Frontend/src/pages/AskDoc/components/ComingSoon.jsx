import React from 'react';
import { Stethoscope, Sparkles, ArrowRight, Clock, Bell } from 'lucide-react';

const AskDoctor = ({ onNavigate }) => {
  // Function to handle navigation - will be replaced with actual router navigation
  const handleNav = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (window.navigate) {
      window.navigate(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon with animation */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <Stethoscope size={48} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Sparkles size={16} className="text-white" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
          <Clock size={16} />
          Coming Soon
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
            Ask a Doctor
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            Get instant medical information and guidance from our AI-powered medical assistant. Available 24/7 to answer your health questions.
          </p>
        </div>

        {/* Features preview */}
        <div className="grid md:grid-cols-2 gap-4 max-w-xl mx-auto pt-8">
          <div className="bg-white rounded-xl p-6 shadow-md text-left">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <Stethoscope size={20} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">AI Medical Assistant</h3>
            <p className="text-sm text-gray-600">Get reliable medical information instantly</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md text-left">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
              <Bell size={20} className="text-indigo-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">24/7 Availability</h3>
            <p className="text-sm text-gray-600">Healthcare guidance whenever you need it</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button
            onClick={() => handleNav('/analysis')}
            className="group flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Test Analysis
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium text-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Back to Home
          </button>
        </div>

        {/* Timeline hint */}
        <p className="text-gray-500 text-sm pt-8">
          We're working hard to bring you this feature. Check back soon!
        </p>
      </div>
    </div>
  );
};

export default AskDoctor;