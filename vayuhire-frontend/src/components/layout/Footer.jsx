import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500">VayuHire &copy; 2026</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/jobs" className="text-gray-500 hover:text-gray-900">Jobs</Link>
          <Link href="/companies" className="text-gray-500 hover:text-gray-900">Companies</Link>
        </div>
      </div>
    </footer>
  );
}
