import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, Heart, ArrowRight, Users, Activity, Microscope } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    // Added flex & items-center to vertically center content on large screens
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden flex items-center">
      
      {/* Decorative background elements - Scaled up */}
      <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 left-10 w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      {/* CRITICAL CHANGE: Changed 'container' to 'max-w-screen-2xl' for ultra-wide layout */}
      <div className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 pt-24 pb-16">
        
        {/* Trust badges */}
        <div className="flex items-center gap-8 mb-12 flex-wrap">
          <div className="flex items-center gap-2 text-blue-600 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm border border-blue-100">
            <CheckCircle size={20} />
            <span className="text-sm font-semibold">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm border border-blue-100">
            <Shield size={20} />
            <span className="text-sm font-semibold">Secure & Private</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600 bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm border border-blue-100">
            <Heart size={20} />
            <span className="text-sm font-semibold">Accurate Analysis</span>
          </div>
        </div>

        {/* Grid Layout - Increased gap to separate text and image in wide view */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left content - Typography Scaled Up */}
          <div className="space-y-10">
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Your health insights,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block mt-2">
                just one click away
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl font-light">
              Advanced AI-powered medical diagnostics. Upload your tests and X-rays to receive instant AI analysis and stay informed with the latest medical news.
            </p>

            {/* CTA Buttons - Made larger */}
            <div className="flex flex-wrap gap-5 pt-4">
              <button
                onClick={() => navigate('/analysis')}
                className="group flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Start Analysis
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate('/rays')}
                className="group flex items-center gap-3 bg-white text-gray-900 px-10 py-5 rounded-full font-bold text-lg border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1"
              >
                X-Ray Diagnosis
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right side - Floating Cards - Scaled dimensions to fill height */}
          <div className="relative h-[750px] hidden lg:block w-full">
            {/* Main Background Circle */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center">
               <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-full"></div>
            </div>

            {/* Floating Card 1 - Test Analysis (Top Left) */}
            <div className="absolute left-0 top-24 bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 w-96 transform hover:scale-105 transition-transform duration-300 border border-white/50">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
                  <Microscope size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-xl mb-1">Test Analysis</h3>
                  <p className="text-gray-600 mb-4 text-base">Instant AI predictions for blood tests & reports</p>
                  <button onClick={() => navigate('/analysis')} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    Analyze Now <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Card 2 - Stats (Bottom Right) */}
            <div className="absolute right-4 bottom-48 bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 w-80 transform hover:scale-105 transition-transform duration-300 border border-white/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
                  <Activity size={28} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">AI Accuracy</h3>
                  <p className="text-sm text-gray-600">Verified Results</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">99.9%</div>
              <p className="text-sm text-gray-500">Precision in diagnostics</p>
            </div>

            {/* Floating Card 3 - Ask Doctor (Bottom Left) */}
            <div className="absolute left-16 bottom-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-6 w-72 border border-amber-100">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                   <Users size={24} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base">Ask Doctor</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid - Wider spacing */}
        <div className="grid md:grid-cols-3 gap-10 mt-32">
          {/* Card 1 */}
          <div 
            onClick={() => navigate('/analysis')}
            className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-transparent hover:border-blue-100 transform hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
              <Microscope size={32} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Test Analysis</h3>
            <p className="text-gray-600 text-lg leading-relaxed">Upload your medical tests and receive instant AI-powered predictions.</p>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => navigate('/rays')}
            className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-transparent hover:border-indigo-100 transform hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
              <Activity size={32} className="text-indigo-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">X-Ray Diagnosis</h3>
            <p className="text-gray-600 text-lg leading-relaxed">Advanced AI analysis of X-ray images for accurate diagnostic predictions.</p>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => navigate('/news')}
            className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-transparent hover:border-purple-100 transform hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
              <Heart size={32} className="text-purple-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Medical News</h3>
            <p className="text-gray-600 text-lg leading-relaxed">Stay updated with the latest medical news and health discoveries.</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;