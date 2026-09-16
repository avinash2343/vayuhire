import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JobCard from '@/components/jobs/JobCard';
import { get } from '@/lib/api';
import { MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  try {
    const res = await get(`/jobs/${params.id}`);
    const job = res.data;
    return { title: `${job.title} at ${job.company?.name} - VayuHire` };
  } catch (e) {
    return { title: 'Job Details - VayuHire' };
  }
}

export default async function JobDetail({ params }) {
  let job = null;
  let relatedJobs = [];
  
  try {
    const res = await get(`/jobs/${params.id}`);
    job = res.data;
    if (job?.company?.id) {
      const relRes = await get(`/jobs?companyId=${job.company.id}&limit=3`);
      relatedJobs = relRes.data.filter(j => j.id !== job.id);
    }
  } catch (e) {
    return <div>Job not found</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    datePosted: job.posted_at,
    description: job.description,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company?.name,
      logo: job.company?.logo_url
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col lg:flex-row gap-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        
        <div className="flex-1 bg-white p-8 rounded-lg border shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-8 pb-8 border-b">
            <div className="flex items-center"><MapPin className="w-5 h-5 mr-2" />{job.location}</div>
            <div className="flex items-center"><Briefcase className="w-5 h-5 mr-2" />{job.type}</div>
            {job.salary_range && <div className="flex items-center"><DollarSign className="w-5 h-5 mr-2" />{job.salary_range}</div>}
            <div className="flex items-center"><Calendar className="w-5 h-5 mr-2" />{new Date(job.posted_at).toLocaleDateString()}</div>
          </div>
          
          <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: job.description?.replace(/\\n/g, '<br/>') || '' }} />
          
          <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">
            Apply Now
          </a>
        </div>
        
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-lg border text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              {job.company?.logo_url ? <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-contain" /> : <span className="text-3xl font-bold text-gray-400">{job.company?.name?.[0]}</span>}
            </div>
            <h3 className="font-bold text-xl mb-2">{job.company?.name}</h3>
            {job.company?.website && <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-sm mb-4 block">Visit Website</a>}
            <Link href={`/companies/${job.company?.id}`} className="block w-full py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50">View Profile</Link>
          </div>
          
          {relatedJobs.length > 0 && (
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-bold mb-4">More from this company</h4>
              <div className="space-y-4">
                {relatedJobs.map(rj => <JobCard key={rj.id} job={rj} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
