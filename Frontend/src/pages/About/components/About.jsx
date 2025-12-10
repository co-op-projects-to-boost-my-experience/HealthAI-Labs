// src/pages/About/components/About.jsx
import { Heart, Brain, Zap, Shield, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutHero() {
  const navigate = useNavigate();

  return (
    <div className="py-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Revolutionizing Healthcare with AI
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          HealthAI Lab combines cutting-edge artificial intelligence with medical expertise 
          to provide instant, accurate health insights accessible to everyone, anywhere.
        </p>
      </div>

      {/* Mission Statement Card */}
      <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-12">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-2xl">
            <Heart className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed">
          We believe everyone deserves access to quality healthcare insights. Our AI-powered 
          platform analyzes medical tests, X-rays, and health questions to provide accurate, 
          instant predictions and guidance, empowering you to make informed decisions about your health.
        </p>
      </div>

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Test Analysis */}
          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Test Analysis</h3>
            <p className="text-gray-600 leading-relaxed">
              Upload your medical tests and receive instant AI-powered predictions and insights 
              about your health conditions with detailed explanations.
            </p>
          </div>

          {/* X-Ray Diagnosis */}
          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">X-Ray Diagnosis</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced AI analysis of X-ray images for accurate diagnostic predictions, 
              helping you understand potential health issues quickly.
            </p>
          </div>

          {/* Ask Doctor AI */}
          <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ask Doctor AI</h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant medical information and guidance from our AI chatbot, available 24/7 
              to answer your health questions and concerns.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl shadow-xl p-8 md:p-12 mb-12 text-white">
        <h2 className="text-3xl font-bold text-center mb-10">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Privacy & Security</h3>
            <p className="text-blue-100 leading-relaxed">
              Your health data is encrypted and secure. We prioritize your privacy at every step.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI-Powered Accuracy</h3>
            <p className="text-blue-100 leading-relaxed">
              Trained on vast medical datasets, our AI delivers reliable and accurate health insights.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Continuous Innovation</h3>
            <p className="text-blue-100 leading-relaxed">
              We constantly improve our platform with the latest medical AI research and technology.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="text-4xl font-bold text-blue-600 mb-2">2M+</div>
          <div className="text-gray-600 font-medium">Active Users</div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="text-4xl font-bold text-blue-600 mb-2">5M+</div>
          <div className="text-gray-600 font-medium">Tests Analyzed</div>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
          <div className="text-gray-600 font-medium">AI Support</div>
        </div>
      </div>

      {/* CTA Section - This is NOT a footer */}
      <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Take Control of Your Health?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join millions of users who trust HealthAI Lab for instant, accurate health insights.
        </p>
        <button 
          onClick={() => navigate('/analysis')}
          className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
        >
          Start Analysis Now
        </button>
      </div>
    </div>
  );
}