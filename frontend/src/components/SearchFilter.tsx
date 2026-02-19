import React, { useState, useEffect } from 'react';
import { FilterState } from '../types';

interface SearchFilterProps {
  onFilterChange: (filters: FilterState) => void;
  departments: string[];
  statuses: string[];
}

function SearchFilter({ onFilterChange, departments, statuses }: SearchFilterProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [department, setDepartment] = useState('All');

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({ search, status, department });
    }, 300);

    return () => clearTimeout(handler);
  }, [search, status, department, onFilterChange]);

  return (
    <div className="glass p-6 rounded-[32px] mb-8 border border-white/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label htmlFor="search" className="text-xs font-extra-bold text-emerald-900/50 uppercase tracking-widest mb-2 ml-1">Search Database</label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Name, ID or Diagnosis..."
              className="w-full bg-white/50 border border-emerald-100 rounded-2xl px-4 py-3 text-sm font-medium text-emerald-950 placeholder-emerald-900/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all duration-300 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="status" className="text-xs font-extra-bold text-emerald-900/50 uppercase tracking-widest mb-2 ml-1">Filter by Status</label>
          <select
            id="status"
            className="w-full bg-white/50 border border-emerald-100 rounded-2xl px-4 py-3 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all duration-300 shadow-sm appearance-none cursor-pointer"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="department" className="text-xs font-extra-bold text-emerald-900/50 uppercase tracking-widest mb-2 ml-1">Filter by Department</label>
          <select
            id="department"
            className="w-full bg-white/50 border border-emerald-100 rounded-2xl px-4 py-3 text-sm font-medium text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all duration-300 shadow-sm appearance-none cursor-pointer"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="All">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
