import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/jobs/SearchBar';
import JobCard from '@/components/jobs/JobCard';
import CompanyCard from '@/components/companies/CompanyCard';
import { get } from '@/lib/api';

async function fetchFeaturedJobs() {
  try {
    const res = await get('/jobs?is_featured=true&limit=6');
    return res.data || [];
  } catch (e) {
    return [];
  }
}

async function fetchTrendingCompanies() {
  try {
    const res = await get('/companies?limit=4');
    return res.data || [];
  } catch (e) {
    return [];
  }
}

export default async function Home() {
  const jobs = await fetchFeaturedJobs();
  const companies = await fetchTrendingCompanies();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Find Your Dream Job</h1>
          <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">Discover opportunities at the world's most innovative companies.</p>
          <SearchBar />
        </section>
        
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Companies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {companies.map(company => <CompanyCard key={company.id} company={company} />)}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center space-x-12 border-t">
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">10k+</p>
            <p className="text-gray-500">Jobs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-indigo-600">500+</p>
            <p className="text-gray-500">Companies</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
