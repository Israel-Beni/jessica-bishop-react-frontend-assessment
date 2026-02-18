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
    <div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="flex flex-col">
          <label htmlFor="search" className="text-xs font-semibold text-gray-500 uppercase mb-1">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Name, ID or Diagnosis..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-col">
          <label htmlFor="status" className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
          <select
            id="status"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex flex-col">
          <label htmlFor="department" className="text-xs font-semibold text-gray-500 uppercase mb-1">Department</label>
          <select
            id="department"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
