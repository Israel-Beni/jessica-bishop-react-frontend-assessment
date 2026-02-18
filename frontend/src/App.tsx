import React from 'react';
import RecordList from './components/RecordList';
import './App.css';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-xl">Q</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  <span className="text-blue-600">Q-</span>Centrix
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-500">Clinical Management System v1.0</span>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <RecordList />
      </main>

    </div>
  );
}