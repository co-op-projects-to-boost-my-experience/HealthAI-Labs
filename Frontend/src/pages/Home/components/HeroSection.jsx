import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, Heart, ArrowRight, Users, Activity, Microscope } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="container mx-auto px-6 pt-20 pb-16">
        {/* Trust badges */}
        <div className="flex items-center gap-6 mb-12 flex-wrap">
          <div className="flex items-center gap-2 text-blue-600">
            <CheckCircle size={20} />
            <span className="text-sm font-medium">AI-Powered</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Shield size={20} />
            <span className="text-sm font-medium">Secure & Private</span>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Heart size={20} />
            <span className="text-sm font-medium">Accurate Analysis</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your health insights,{' '}
              <span className="block mt-2">just one click away</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Advanced AI-powered medical diagnostics. Upload your tests and X-rays to receive instant AI analysis and stay informed with the latest medical news—all in one platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/analysis')}
                className="group flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Analysis
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => navigate('/rays')}
                className="group flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-medium text-lg border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                X-Ray Diagnosis
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right side - Floating Cards */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Main medical illustration placeholder */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center shadow-xl">
              <Activity size={120} className="text-blue-600 opacity-30" />
            </div>

            {/* Floating Card 1 - Test Analysis */}
            <div className="absolute left-0 top-12 bg-white rounded-2xl shadow-2xl p-6 w-80 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Microscope size={32} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Test Analysis</h3>
                  <p className="text-sm text-gray-600 mb-3">Upload medical tests for instant AI predictions</p>
                  <button
                    onClick={() => navigate('/analysis')}
                    className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Analyze Now
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Card 2 - Features */}
            <div className="absolute right-0 bottom-32 bg-white rounded-2xl shadow-2xl p-6 w-72 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center">
                  <Activity size={24} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">AI-Powered</h3>
                  <p className="text-sm text-gray-600">Instant diagnostics</p>
                </div>
                <button 
                  onClick={() => navigate('/analysis')}
                  className="ml-auto w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <ArrowRight size={20} className="text-white" />
                </button>
              </div>
              
              {/* User avatars */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">2M+</p>
                  <p className="text-xs text-gray-600">active users</p>
                </div>
              </div>
            </div>

            {/* Floating Card 3 - Ask Doctor (Coming Soon) */}
            <div className="absolute left-12 bottom-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl p-5 w-64 border border-amber-200">
              <div className="flex items-center gap-3">
                <Users size={24} className="text-amber-600" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Ask Doctor</p>
                  <p className="text-xs text-amber-700 font-medium bg-amber-100 px-2 py-1 rounded-full inline-block mt-1">
                    Coming Soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features grid below hero */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div 
            onClick={() => navigate('/analysis')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Microscope size={24} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Test Analysis</h3>
            <p className="text-gray-600 text-sm">Upload your medical tests and receive instant AI-powered predictions and insights.</p>
          </div>

          <div 
            onClick={() => navigate('/rays')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Activity size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">X-Ray Diagnosis</h3>
            <p className="text-gray-600 text-sm">Advanced AI analysis of X-ray images for accurate diagnostic predictions.</p>
          </div>

          <div 
            onClick={() => navigate('/news')}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Heart size={24} className="text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Medical News</h3>
            <p className="text-gray-600 text-sm">Stay updated with the latest medical news and health discoveries.</p>
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