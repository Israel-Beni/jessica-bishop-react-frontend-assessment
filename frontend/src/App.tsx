import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Records from './pages/Records';
import Dashboard from './pages/Dashboard';
import { ClinicalRecordProvider } from './context/ClinicalRecordContext';
import { ModalProvider } from './context/ModalContext';
import { HealthProvider } from './context/HealthContext';
import { NotificationProvider } from './context/NotificationContext';
import { DeleteProvider } from './context/DeleteContext';
import RecordForm from './components/RecordForm';
import { useClinicalRecordsContext } from './context/ClinicalRecordContext';
import './App.css';

// Inner component that can access ClinicalRecordContext for delete handler
function AppContent() {
  const { removeRecord } = useClinicalRecordsContext();
  return (
    <DeleteProvider onConfirm={removeRecord}>
      <ModalProvider>
        <Router>
          <div className="min-h-screen bg-emerald-50/20 font-sans text-emerald-950 antialiased selection:bg-emerald-200 selection:text-emerald-900">
            <Navbar />

            <main className="relative">
              <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse duration-[10s]" />
              <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-400/10 blur-[150px] rounded-full pointer-events-none -z-10" />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/records" element={<Records />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>

            <footer className="mt-20 py-16 border-t border-emerald-100/50">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <span className="ml-3 text-xl font-black text-emerald-950 tracking-tighter">Q-Centrix</span>
                <p className="text-sm text-emerald-900/40 font-bold max-w-md mx-auto leading-relaxed">
                  &copy; {new Date().getFullYear()} Jessica B. &amp; Isra (Ben D.) . All rights reserved.
                </p>
              </div>
            </footer>
          </div>

          <RecordForm />
        </Router>
      </ModalProvider>
    </DeleteProvider>
  );
}

export default function App() {
  return (
    <ClinicalRecordProvider>
      <HealthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </HealthProvider>
    </ClinicalRecordProvider>
  );
}