'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-transparent rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
          placeholder="Job title, keywords, or company..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="absolute inset-y-2 right-2 px-6 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Search
        </button>
      </div>
    </form>
  );
}
