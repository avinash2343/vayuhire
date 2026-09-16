'use client';
import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">VayuHire</Link>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link href="/jobs" className="text-gray-700 hover:text-indigo-600">Jobs</Link>
            <Link href="/companies" className="text-gray-700 hover:text-indigo-600">Companies</Link>
            <Link href="/search" className="text-gray-500 hover:text-indigo-600"><Search className="w-5 h-5" /></Link>
          </div>
          <div className="flex items-center sm:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link href="/jobs" className="block text-gray-700 hover:text-indigo-600 py-2">Jobs</Link>
            <Link href="/companies" className="block text-gray-700 hover:text-indigo-600 py-2">Companies</Link>
            <Link href="/search" className="block text-gray-700 hover:text-indigo-600 py-2">Search</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
