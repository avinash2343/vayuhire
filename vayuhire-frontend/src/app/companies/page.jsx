import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CompanyCard from '@/components/companies/CompanyCard';
import { get } from '@/lib/api';

export default async function CompaniesPage() {
  let companies = [];
  try {
    const res = await get('/companies');
    companies = res.data || [];
  } catch (e) {}

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Companies</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {companies.map(company => <CompanyCard key={company.id} company={company} />)}
        </div>
      </main>
      <Footer />
    </>
  );
}
