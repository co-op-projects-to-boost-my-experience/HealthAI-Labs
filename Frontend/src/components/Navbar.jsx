import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

// Using the clean icon image (blue graphic only)
import logoIcon from "../assets/healthai-logo.png"; 

const navLinks = ["Home", "Analysis", "Rays", "Ask Doctor", "News", "Report", "About"];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-4 left-0 w-full flex justify-center z-50">
      
      {/* Main 'pill' container */}
      <div className="w-[95%] max-w-6xl bg-white shadow-xl rounded-full py-4 px-6 md:px-10 flex justify-between items-center transition-all duration-300">

        {/* Logo (Icon and Text - Final Styling) */}
        <Link to="/" className="flex items-center space-x-2 min-w-[200px]">
          
          {/* Logo Icon Wrapper (Ensures high quality and alignment) */}
          <div className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0 flex items-center justify-center">
             <img 
                src={logoIcon} 
                alt="HealthAI Lab Icon" 
                className="h-full w-auto" 
            />
          </div>
          
          {/* Logo Text: Changed from font-extrabold to font-bold */}
          <span className="font-bold text-gray-900 text-xl select-none tracking-tight leading-none">
            HealthAI Lab
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center space-x-8 lg:space-x-10 font-semibold text-base text-gray-700">
          {navLinks.map((name) => {
            const path = name === "Home" 
                         ? "/" 
                         : "/" + name.toLowerCase().replace(/\s+/g, "");

            const isActive = location.pathname === path;

            return (
              <li key={name}>
                <Link
                  to={path}
                  className={`cursor-pointer transition-colors duration-200 ${
                    isActive ? "text-blue-600 font-extrabold" : "hover:text-blue-600"
                  }`}
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Contact Link (Routes to /contact) */}
        <div className="hidden md:block">
          <Link 
            to="/contact" 
            className="bg-blue-600 text-white rounded-full px-6 py-2.5 text-sm font-bold shadow-lg shadow-blue-500/50 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Contact US
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-md text-gray-800 hover:bg-gray-100 transition-colors duration-200"
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full w-[95%] max-w-6xl mx-auto md:hidden bg-white shadow-xl rounded-xl mt-3 p-6 border border-gray-100 transition-all duration-300 ease-in-out">
          <ul className="flex flex-col space-y-4 font-medium text-gray-900">
            {navLinks.map((name) => {
              const path = name === "Home" 
                         ? "/" 
                         : "/" + name.toLowerCase().replace(/\s+/g, "");
                         
              const isActive = location.pathname === path;

              return (
                <li key={name}>
                  <Link
                    to={path}
                    className={`block px-3 py-2 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600 font-bold bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {name}
                  </Link>
                </li>
              );
            })}

            {/* Mobile Contact Link (Routes to /contact) */}
            <Link 
                to="/contact" 
                className="mt-4 bg-blue-600 text-white rounded-full py-2.5 font-bold hover:bg-blue-700 transition-colors duration-200 text-center"
                onClick={() => setMenuOpen(false)} // Close menu on click
            >
              Contact US
            </Link>
          </ul>
        </div>
      )}
    </header>
  );
}