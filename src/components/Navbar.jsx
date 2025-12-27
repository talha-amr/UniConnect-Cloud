import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Menu } from 'lucide-react'; // Assuming lucide-react is available given SlideNavbar uses it

export default function Navbar({ theme = "blue" }) {
  const [isOpen, setIsOpen] = useState(false);

  // Text color logic
  const textColor = theme === "login" ? "text-black" : theme === "white" ? "text-black" : "text-white";
  const hoverColor = theme === "login" ? "hover:text-gray-700" : theme === "white" ? "hover:text-gray-700" : "hover:text-gray-300";

  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className={`font-bold text-xl ${textColor}`}>UniConnect</Link>
          </div>

          {theme !== "login" && (
            <div className="hidden md:flex space-x-8">
              <Link to="/" className={`${textColor} ${hoverColor}`}>Home</Link>
              <Link to="/about" className={`${textColor} ${hoverColor}`}>About</Link>
              <Link to="/contact" className={`${textColor} ${hoverColor}`}>Contact</Link>
            </div>
          )}

          {theme !== "login" && (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className={`${textColor} ${hoverColor}`}>Login</Link>
              <Link
                to="/register"
                className={`px-4 py-2 rounded ${theme === "white" ? "bg-black text-white hover:bg-gray-800" : "bg-white text-gray-800 hover:bg-gray-200"}`}
              >
                Register
              </Link>
            </div>
          )}

          {theme !== "login" && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(true)}
                className={`${textColor} focus:outline-none`}
              >
                <Menu size={24} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white animate-slide-in-right flex flex-col">
          {/* Close Button Header */}
          <div className="flex justify-end p-6">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-800 focus:outline-none"
            >
              <X size={32} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col items-center justify-center flex-1 space-y-8">
            <Link
              to="/"
              className="text-2xl font-semibold text-gray-800 hover:text-orange-500"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-2xl font-semibold text-gray-800 hover:text-orange-500"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-2xl font-semibold text-gray-800 hover:text-orange-500"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="text-2xl font-semibold text-gray-800 hover:text-orange-500"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-2xl font-semibold text-[#E09B04] hover:text-[#C88903]"
              onClick={() => setIsOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
