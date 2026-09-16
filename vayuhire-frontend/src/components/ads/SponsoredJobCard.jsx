'use client';
import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { post } from '@/lib/api';

export default function SponsoredJobCard({ ad, job }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ad) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        post(`/ads/${ad.id}/impression`).catch(() => {});
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ad]);

  const handleClick = () => {
    if (!ad) return;
    post(`/ads/${ad.id}/click`).catch(() => {});
    window.open(ad.target_url, '_blank');
  };

  if (!job) return null;

  return (
    <div ref={ref} onClick={handleClick} className="block cursor-pointer">
      <div className="bg-indigo-50 rounded-lg border border-indigo-100 p-4 hover:shadow-md transition relative">
        <span className="absolute top-4 right-4 bg-indigo-200 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">Sponsored</span>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shrink-0 border">
            {job.company?.logo_url ? <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-contain" /> : <span className="text-xl font-bold text-gray-400">{job.company?.name?.[0]}</span>}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-indigo-900">{job.title}</h3>
            <p className="text-indigo-700">{job.company?.name}</p>
            <div className="flex flex-wrap items-center mt-2 gap-2 text-sm">
              <span className="flex items-center text-indigo-600"><MapPin className="w-4 h-4 mr-1"/>{job.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
