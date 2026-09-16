import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JobCard from '@/components/jobs/JobCard';
import { get } from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    const res = await get(`/companies/${params.id}`);
    return { title: `${res.data.name} - VayuHire` };
  } catch (e) {
    return { title: 'Company - VayuHire' };
  }
}

export default async function CompanyProfile({ params }) {
  let company = null;
  let jobs = [];
  try {
    const res = await get(`/companies/${params.id}`);
    company = res.data;
    const jobsRes = await get(`/jobs?companyId=${params.id}`);
    jobs = jobsRes.data || [];
  } catch (e) {
    return <div>Company not found</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-lg border p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
           <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
             {company.logo_url ? <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" /> : <span className="text-4xl font-bold text-gray-400">{company.name?.[0]}</span>}
           </div>
           <div className="flex-1 text-center md:text-left">
             <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
             <p className="text-gray-600 mb-4">{company.industry}</p>
             <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               {company.website && <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Website</a>}
               {company.career_page_url && <a href={company.career_page_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Careers Page</a>}
             </div>
           </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Open Positions ({jobs.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      </main>
      <Footer />
    </>
  );
}
