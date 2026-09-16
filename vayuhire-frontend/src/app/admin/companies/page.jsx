'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { get, del } from '@/lib/api';

export default function AdminCompanies() {
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['adminCompanies'], queryFn: () => get('/admin/companies') });

  const deleteMutation = useMutation({
    mutationFn: (id) => del(`/admin/companies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCompanies']);
      setDeleteId(null);
    }
  });

  const columns = [
    { header: 'Name', cell: row => <div className="flex items-center"><img src={row.logo_url} className="w-8 h-8 mr-2 rounded bg-gray-100 object-contain"/>{row.name}</div> },
    { header: 'Industry', accessor: 'industry' },
    { header: 'Status', cell: row => <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span> },
    { header: 'Actions', cell: row => (
      <div className="space-x-3">
        <Link href={`/admin/companies/${row.id}/edit`} className="text-indigo-600 hover:underline">Edit</Link>
        <button onClick={() => setDeleteId(row.id)} className="text-red-600 hover:underline">Delete</button>
      </div>
    )}
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Companies</h1>
        <Link href="/admin/companies/new" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add Company</Link>
      </div>
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId)} title="Delete Company" message="Are you sure you want to delete this company?" />
    </div>
  );
}
