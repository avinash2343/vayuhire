import Link from 'next/link';

export default function CompanyCard({ company }) {
  return (
    <Link href={`/companies/${company.id}`} className="block">
      <div className="bg-white rounded-lg border p-6 hover:shadow-md transition text-center">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-md flex items-center justify-center mb-4">
          {company.logo_url ? <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" /> : <span className="text-2xl font-bold text-gray-400">{company.name?.[0]}</span>}
        </div>
        <h3 className="font-bold text-lg text-gray-900">{company.name}</h3>
        {company.industry && <span className="inline-block px-2 py-1 mt-2 text-xs rounded-full bg-gray-100 text-gray-600">{company.industry}</span>}
        {company.active_job_count !== undefined && (
          <p className="text-sm text-indigo-600 font-medium mt-3">{company.active_job_count} active jobs</p>
        )}
      </div>
    </Link>
  );
}
