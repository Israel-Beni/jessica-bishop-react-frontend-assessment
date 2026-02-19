import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, LayoutDashboard, ShieldCheck, Activity, Users } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

function Home() {
  const { isOnline } = useHealth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
      <div className="text-center mb-24 relative z-10 animate-fade-in">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-sm font-bold mb-8 glass">
          <span className="relative flex h-2 w-2 mr-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </span>
          {isOnline ? 'Clinical Records v1.0 by (Isra) Ben Degbe' : 'Backend Connection Offline'}
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold text-emerald-950 mb-8 tracking-tight leading-tight">
          Precision Care, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            Intelligently Managed
          </span>
        </h1>
        <p className="text-xl text-emerald-900/60 max-w-2xl mx-auto leading-relaxed font-medium">
          Experience the next generation of clinical record management.
          Sleek, secure, and focused on patient outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24 relative z-10">
        <Link
          to="/records"
          className="group p-10 glass rounded-[40px] hover:bg-white/60 transition-all duration-500 animate-slide-up"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-emerald-200">
            <ClipboardList className="text-white w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold text-emerald-950 mb-4 tracking-tight">Clinical Records</h3>
          <p className="text-emerald-900/60 mb-8 text-lg font-medium leading-relaxed">
            Manage comprehensive patient records with emerald-class precision and real-time synchronization.
          </p>
          <div className="flex items-center text-emerald-600 font-bold text-lg group-hover:translate-x-2 transition-transform">
            Launch Records <ArrowRight className="ml-2 w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/dashboard"
          className="group p-10 glass rounded-[40px] hover:bg-white/60 transition-all duration-500 animate-slide-up delay-100"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-teal-200">
            <LayoutDashboard className="text-white w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold text-emerald-950 mb-4 tracking-tight">Health Analytics</h3>
          <p className="text-emerald-900/60 mb-8 text-lg font-medium leading-relaxed">
            Visualize department efficiency and patient volumes with our high-fidelity monitoring tools.
          </p>
          <div className="flex items-center text-teal-600 font-bold text-lg group-hover:translate-x-2 transition-transform">
            Open Dashboard <ArrowRight className="ml-2 w-5 h-5" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
        {[
          { icon: ShieldCheck, label: 'Secure Data', desc: 'Clinical-grade privacy', color: 'bg-emerald-50 text-emerald-600' },
          { icon: Activity, label: 'Real-time', desc: 'Instant live updates', color: 'bg-teal-50 text-teal-600' },
          { icon: Users, label: 'Patient Centric', desc: 'Designed for care', color: 'bg-green-50 text-green-600' },
        ].map(({ icon: Icon, label, desc, color }, i) => (
          <div key={i} className="flex flex-col items-center p-8 glass rounded-[32px] text-center group hover:translate-y-[-5px] transition-all duration-300">
            <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <Icon className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-emerald-950 mb-2">{label}</h4>
            <p className="text-emerald-900/50 font-medium">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
