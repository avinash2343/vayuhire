'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '@/components/admin/DataTable';
import { get, put } from '@/lib/api';

export default function AdminJobs() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['adminJobs'], queryFn: () => get('/admin/jobs') });

  const toggleMutation = useMutation({
    mutationFn: ({ id, field, value }) => put(`/admin/jobs/${id}`, { [field]: value }),
    onSuccess: () => queryClient.invalidateQueries(['adminJobs'])
  });

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Company', cell: row => row.company?.name },
    { header: 'Featured', cell: row => (
      <input type="checkbox" checked={row.is_featured} onChange={(e) => toggleMutation.mutate({ id: row.id, field: 'is_featured', value: e.target.checked })} />
    )},
    { header: 'Active', cell: row => (
      <input type="checkbox" checked={row.is_active !== false} onChange={(e) => toggleMutation.mutate({ id: row.id, field: 'is_active', value: e.target.checked })} />
    )}
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Jobs Management</h1>
      <DataTable columns={columns} data={data?.data || []} isLoading={isLoading} />
    </div>
  );
}
