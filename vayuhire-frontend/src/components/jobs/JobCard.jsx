import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function JobCard({ job }) {
  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'remote': return 'bg-green-100 text-green-800';
      case 'full-time': return 'bg-blue-100 text-blue-800';
      case 'intern': return 'bg-orange-100 text-orange-800';
      case 'contract': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/jobs/${job.id}`} className="block">
      <div className="bg-white rounded-lg border p-4 hover:shadow-md transition relative">
        {job.is_featured && <Star className="w-5 h-5 text-yellow-400 absolute top-4 right-4 fill-current" />}
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center shrink-0">
            {job.company?.logo_url ? <img src={job.company.logo_url} alt={job.company.name} className="w-full h-full object-contain" /> : <span className="text-xl font-bold text-gray-400">{job.company?.name?.[0]}</span>}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
            <p className="text-gray-600">{job.company?.name}</p>
            <div className="flex flex-wrap items-center mt-2 gap-2 text-sm">
              <span className="flex items-center text-gray-500"><MapPin className="w-4 h-4 mr-1"/>{job.location}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>{job.type}</span>
              {job.salary_range && <span className="text-gray-500">{job.salary_range}</span>}
            </div>
            <p className="text-xs text-gray-400 mt-2">{job.posted_at ? formatDistanceToNow(new Date(job.posted_at), { addSuffix: true }) : 'Recently'}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
