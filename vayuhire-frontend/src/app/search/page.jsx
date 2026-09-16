'use client';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JobCard from '@/components/jobs/JobCard';
import { get } from '@/lib/api';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => get(`/jobs?keyword=${encodeURIComponent(q)}`),
    enabled: !!q
  });

  const jobs = data?.data || [];

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-2xl font-bold mb-6">Search Results for "{q}"</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <p className="text-gray-500">No results found.</p>
        )}
      </main>
      <Footer />
    </>
  );
}
