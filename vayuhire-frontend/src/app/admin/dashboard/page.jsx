'use client';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Building2, RefreshCw, Megaphone } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import DataTable from '@/components/admin/DataTable';
import { get } from '@/lib/api';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: stats } = useQuery({ queryKey: ['adminStats'], queryFn: () => get('/admin/stats').catch(() => ({ data: { jobs: 0, companies: 0, scrapers: 0, ads: 0 } })) });
  const { data: logs } = useQuery({ queryKey: ['adminLogs'], queryFn: () => get('/admin/scrape-logs?limit=5').catch(() => ({ data: [] })) });

  const s = stats?.data || {};

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <Link href="/admin/companies/new" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Add Company</Link>
          <Link href="/admin/jobs" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">View All Jobs</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard icon={Briefcase} label="Total Jobs" value={s.jobs || 0} colorClass="bg-blue-500" />
        <StatsCard icon={Building2} label="Active Companies" value={s.companies || 0} colorClass="bg-green-500" />
        <StatsCard icon={RefreshCw} label="Active Scrapers" value={s.scrapers || 0} colorClass="bg-orange-500" />
        <StatsCard icon={Megaphone} label="Total Ads" value={s.ads || 0} colorClass="bg-purple-500" />
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Scrape Logs</h2>
      <DataTable 
        columns={[
          { header: 'Source', accessor: 'source' },
          { header: 'Status', cell: (row) => <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{row.status}</span> },
          { header: 'Jobs Found', accessor: 'jobs_found' },
          { header: 'Time', cell: (row) => new Date(row.timestamp).toLocaleString() }
        ]}
        data={logs?.data || []}
      />
    </div>
  );
}
