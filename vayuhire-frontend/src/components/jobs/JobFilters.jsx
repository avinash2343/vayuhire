'use client';
import { useState, useEffect } from 'react';
import { get } from '@/lib/api';

export default function JobFilters({ filters, onFilterChange }) {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    get('/companies').then(res => setCompanies(res.data || [])).catch(() => {});
  }, []);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleTypeChange = (type) => {
    const types = filters.type || [];
    if (types.includes(type)) {
      handleChange('type', types.filter(t => t !== type));
    } else {
      handleChange('type', [...types, type]);
    }
  };

  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Intern', 'Contract'];

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-bold mb-4">Filters</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input 
          type="text" 
          value={filters.location || ''} 
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full border rounded p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" 
          placeholder="e.g. New York" 
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
        <div className="space-y-2">
          {jobTypes.map(type => (
            <label key={type} className="flex items-center">
              <input 
                type="checkbox" 
                checked={(filters.type || []).includes(type)}
                onChange={() => handleTypeChange(type)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
              />
              <span className="ml-2 text-sm text-gray-600">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
        <select 
          value={filters.companyId || ''} 
          onChange={(e) => handleChange('companyId', e.target.value)}
          className="w-full border rounded p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Companies</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <button onClick={() => onFilterChange({})} className="w-full py-2 text-sm text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50">
        Clear Filters
      </button>
    </div>
  );
}
