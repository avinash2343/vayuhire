'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JobFilters from '@/components/jobs/JobFilters';
import JobCard from '@/components/jobs/JobCard';
import AdBanner from '@/components/ads/AdBanner';
import SponsoredJobCard from '@/components/ads/SponsoredJobCard';
import { get } from '@/lib/api';

export default function JobsPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', filters, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.companyId) params.append('companyId', filters.companyId);
      if (filters.type) filters.type.forEach(t => params.append('type', t));
      params.append('page', page);
      return get(`/jobs?${params.toString()}`);
    }
  });

  const { data: ads } = useQuery({
    queryKey: ['ads', 'listing'],
    queryFn: () => get('/ads/active?placement=listing'),
  });

  const jobs = data?.data || [];
  const listingAds = ads?.data || [];

  const renderJobs = () => {
    let result = [];
    let adIndex = 0;
    
    jobs.forEach((job, index) => {
      result.push(<JobCard key={job.id} job={job} />);
      if ((index + 1) % 5 === 0 && listingAds[adIndex]) {
        result.push(
          <div key={`ad-${adIndex}`} className="col-span-1">
             <SponsoredJobCard ad={listingAds[adIndex]} job={{...job, id: `spon-${job.id}`, title: 'Sponsored Job Example', is_featured: false}} />
          </div>
        );
        adIndex++;
      }
    });
    return result;
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <JobFilters filters={filters} onFilterChange={(f) => { setFilters(f); setPage(1); }} />
          <div className="mt-6">
            {listingAds[0] && <AdBanner ad={listingAds[0]} />}
          </div>
        </div>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Latest Jobs</h1>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>)}
            </div>
          ) : (
            <div className="space-y-4">
              {renderJobs()}
              {jobs.length === 0 && <p className="text-gray-500">No jobs found matching your criteria.</p>}
            </div>
          )}
          
          <div className="mt-8 flex justify-center space-x-4">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
