'use client';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/components/admin/DataTable';
import { get } from '@/lib/api';

export default function ScrapeLogs() {
  const { data, isLoading } = useQuery({ queryKey: ['scrapeLogs'], queryFn: () => get('/admin/scrape-logs') });

  const columns = [
    { header: 'Source', accessor: 'source' },
    { header: 'Status', cell: row => <span className={`px-2 py-1 rounded-full text-xs ${row.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{row.status}</span> },
    { header: 'Jobs', accessor: 'jobs_found' },
    { header: 'Time', cell: row => new Date(row.timestamp).toLocaleString() }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold">Scrape Logs</h1>
         <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Trigger Scrape</button>
      </div>
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
    </div>
  );
}
