import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, LayoutDashboard, Database } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

function Navbar() {
  const location = useLocation();
  const { isOnline } = useHealth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/records', label: 'Records', icon: ClipboardList },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-all duration-300">
                <Database className="text-white w-7 h-7" />
              </div>
              <div className="ml-4 flex flex-col">
                <span className="text-xl font-bold tracking-tight text-emerald-950 leading-none">
                  Q-Centrix
                </span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1.5 flex items-center">
                  <span className={`w-1.5 h-1.5 ${isOnline ? 'bg-emerald-500' : isOnline === null ? 'bg-amber-400' : 'bg-rose-500'} rounded-full mr-1.5 animate-pulse`}></span>
                  {isOnline === null ? 'Connecting…' : isOnline ? 'Clinical Intelligence' : 'Registry Offline'}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive(path)
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 translate-y-[-2px]'
                  : 'text-emerald-900/60 hover:bg-white/50 hover:text-emerald-900'
                  }`}
              >
                <Icon className={`w-4 h-4 mr-2.5 ${isActive(path) ? 'text-white' : 'text-emerald-400 group-hover:text-emerald-600'}`} />
                <span className="hidden sm:inline tracking-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
