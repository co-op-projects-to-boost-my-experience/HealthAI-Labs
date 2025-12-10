import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import logoImage from "../assets/healthai-logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-white/50 backdrop-blur-sm border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logoImage} alt="HealthAI Lab" className="h-8 w-8" />
              <span className="font-bold text-gray-900 text-lg">HealthAI Lab</span>
            </div>
            <p className="text-gray-600 text-sm">
              Advanced AI-powered medical diagnostics for better health outcomes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/analysis" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Analysis</Link></li>
              <li><Link to="/rays" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">X-Ray Diagnosis</Link></li>
              <li><Link to="/askdoctor" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Ask Doctor</Link></li>
              <li><Link to="/news" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Medical News</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © {currentYear} HealthAI Lab. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" /> for better health
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}