import React, { useState } from "react";
import { Menu, X, User, LogOut, LogIn, UserPlus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logoImage from "../assets/healthai-logo.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Analysis", path: "/analysis" },
  { name: "Rays", path: "/rays" },
  { name: "Ask Doctor", path: "/askdoctor" },
  { name: "News", path: "/news" },
  { name: "Report", path: "/report" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-4 left-0 w-full flex justify-center z-50 px-4">
      {/* Floating container with rounded design */}
      <div className="w-full max-w-[1400px] bg-white/95 backdrop-blur-sm shadow-xl rounded-full py-3 px-4 md:px-8 flex justify-between items-center transition-all duration-300">
        
        {/* Logo */}
        <div className="flex items-center space-x-2 min-w-[160px] flex-shrink-0 cursor-pointer" onClick={() => handleNavClick("/")}>
          <img src={logoImage} alt="HealthAI Lab" className="h-8 w-8 md:h-9 md:w-9" />
          <span className="font-bold text-gray-900 text-lg md:text-xl select-none tracking-tight leading-none whitespace-nowrap">
            HealthAI Lab
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center space-x-4 xl:space-x-6 font-semibold text-sm xl:text-base text-gray-700">
          {navLinks.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => handleNavClick(item.path)}
                className={`cursor-pointer transition-colors duration-200 whitespace-nowrap ${
                  isActive(item.path) ? "text-blue-600 font-extrabold" : "hover:text-blue-600"
                }`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop User Actions */}
        <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full">
                <User className="h-4 w-4" />
                <span className="font-medium text-sm max-w-[100px] truncate">
                  {user.full_name || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-800 font-medium px-3 py-1.5 text-sm rounded-full hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleNavClick('/login')}
                className="flex items-center space-x-1 text-blue-600 font-bold px-4 py-2 text-sm rounded-full hover:bg-blue-50 transition-all duration-300"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
              <button 
                onClick={() => handleNavClick('/signup')}
                className="flex items-center space-x-1 bg-blue-600 text-white rounded-full px-5 py-2 text-sm font-bold shadow-lg shadow-blue-500/50 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="lg:hidden p-2 rounded-md text-gray-800 hover:bg-gray-100 transition-colors duration-200"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full w-[calc(100%-2rem)] max-w-[1400px] mx-auto lg:hidden bg-white shadow-xl rounded-2xl mt-3 p-6 border border-gray-100 transition-all duration-300 ease-in-out">
          <ul className="flex flex-col space-y-2 font-medium text-gray-900">
            {navLinks.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-blue-600 font-bold bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}

            {/* Mobile User Actions */}
            <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-gray-200">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2 text-gray-700 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5" />
                    <span className="font-medium truncate">
                      {user.full_name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-2 text-red-600 font-bold py-2.5 rounded-full hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleNavClick('/login')}
                    className="flex items-center justify-center space-x-2 text-blue-600 font-bold py-2.5 rounded-full hover:bg-blue-50 transition-colors duration-200"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </button>
                  <button 
                    onClick={() => handleNavClick('/signup')}
                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white rounded-full py-2.5 font-bold hover:bg-blue-700 transition-colors duration-200"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </button>
                </>
              )}
            </div>
          </ul>
        </div>
      )}
    </header>
  );
}