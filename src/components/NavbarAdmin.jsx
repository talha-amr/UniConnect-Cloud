import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="bg-white my-container relative z-40">
      <div className="mx-auto py-5 flex justify-between items-center px-4 md:px-0">

        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            U
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">UniConnect</h1>
            <p className="text-[10px] text-gray-500 leading-tight">Complaint System Portal</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link
            to="/adminDash"
            className={`font-medium text-xs ${isActive('/adminDash') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Dashboard
          </Link>
          <Link
            to="/adminComplaint"
            className={`font-medium text-xs ${isActive('/adminComplaint') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Complaints
          </Link>
          <Link
            to="/adminAccounts"
            className={`font-medium text-xs ${isActive('/adminAccounts') ? 'text-black border-b-2 border-black pb-1' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Accounts
          </Link>
        </nav>

        {/* Desktop Logout */}
        <button
          onClick={handleLogout}
          className="hidden md:block text-gray-500 text-sm cursor-pointer hover:text-red-500 transition-colors"
        >
          Logout
        </button>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white animate-slide-in-right flex flex-col md:hidden">
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
              to="/adminDash"
              onClick={() => setIsOpen(false)}
              className={`text-2xl font-medium ${isActive('/adminDash') ? 'text-black' : 'text-gray-500'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/adminComplaint"
              onClick={() => setIsOpen(false)}
              className={`text-2xl font-medium ${isActive('/adminComplaint') ? 'text-black' : 'text-gray-500'}`}
            >
              Complaints
            </Link>
            <Link
              to="/adminAccounts"
              onClick={() => setIsOpen(false)}
              className={`text-2xl font-medium ${isActive('/adminAccounts') ? 'text-black' : 'text-gray-500'}`}
            >
              Accounts
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="text-2xl font-medium text-red-500 mt-8"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarAdmin;