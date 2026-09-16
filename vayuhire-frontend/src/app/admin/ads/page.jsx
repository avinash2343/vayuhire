'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import { get } from '@/lib/api';

export default function AdminAds() {
  const { data, isLoading } = useQuery({ queryKey: ['adminAds'], queryFn: () => get('/admin/ads') });

  const columns = [
    { header: 'Advertiser', accessor: 'advertiser_name' },
    { header: 'Placement', accessor: 'placement' },
    { header: 'Impressions', accessor: 'impressions' },
    { header: 'Clicks', accessor: 'clicks' },
    { header: 'Actions', cell: row => <Link href={`/admin/ads/analytics?id=${row.id}`} className="text-indigo-600 hover:underline">Analytics</Link> }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ad Campaigns</h1>
        <Link href="/admin/ads/new" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Create Ad</Link>
      </div>
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
    </div>
  );
}
