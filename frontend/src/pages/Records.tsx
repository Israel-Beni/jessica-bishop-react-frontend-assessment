import React from 'react';
import RecordList from '../components/RecordList';

function Records() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-emerald-950 tracking-tight">Patient Records</h1>
          <p className="text-emerald-900/50 font-medium mt-1">Audit and update clinical data</p>
        </div>
      </div>
      <RecordList />
    </div>
  );
};

export default Records;
