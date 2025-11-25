import React from 'react';
import logo from '../assets/healthai-logo.png';

const Footer = () => {
  // Data-driven links make the JSX cleaner and easier to maintain
  const featuresLinks = [
    { name: "Test Analysis", href: "#" },
    { name: "X-Ray Diagnosis", href: "#" },
    { name: "Medical News", href: "#" },
    { name: "Ask Doctor", href: "#", badge: "Coming Soon" },
  ];

  const companyLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Privacy Policy", href: "#" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-0">
        
        {/* Left Section - Brand */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 max-w-md">
          <img
            src={logo}
            alt="HealthAI Lab Logo"
            className="h-14 flex-shrink-0" 
          />
          <div className="mt-4 md:mt-0">
            <h2 className="font-bold text-[28px] text-[#3d3d3d] leading-tight select-none">
              HealthAI Lab
            </h2>
            <p className="mt-2 text-gray-500 text-sm leading-relaxed">
              Advanced AI-powered medical diagnostics. Upload your tests and X-rays to receive instant AI analysis.
            </p>
          </div>
        </div>

        {/* Right Section - Navigation */}
        <div className="flex flex-col sm:flex-row gap-8 md:gap-20 text-gray-600 text-sm">
          {/* Features Column */}
          <div>
            <h3 className="text-sm font-semibold text-[#1f2937] mb-4 select-none">FEATURES</h3>
            <ul className="space-y-3">
              {featuresLinks.map((link, index) => (
                <li key={index} className="flex items-center gap-2">
                  <a href={link.href} className="hover:text-[#1e90ff] transition-colors duration-200">
                    {link.name}
                  </a>
                  {link.badge && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded select-none">
                      {link.badge}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-[#1f2937] mb-4 select-none">COMPANY</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-[#1e90ff] transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-8 py-6 text-center text-gray-500 text-xs select-none">
        Copyright 2025 © HealthAI Lab - All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;