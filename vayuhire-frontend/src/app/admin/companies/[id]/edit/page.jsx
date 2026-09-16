'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { get, put } from '@/lib/api';

export default function EditCompany({ params }) {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  
  const { data } = useQuery({ queryKey: ['company', params.id], queryFn: () => get(`/admin/companies/${params.id}`) });

  useEffect(() => {
    if (data?.data) reset(data.data);
  }, [data, reset]);

  const onSubmit = async (formData) => {
    await put(`/admin/companies/${params.id}`, formData);
    router.push('/admin/companies');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Company</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Name</label><input {...register('name', { required: true })} className="w-full border p-2 rounded" /></div>
        <div><label className="block text-sm font-medium mb-1">Logo URL</label><input {...register('logo_url')} className="w-full border p-2 rounded" /></div>
        <div><label className="block text-sm font-medium mb-1">Career Page URL</label><input {...register('career_page_url', { required: true })} className="w-full border p-2 rounded" /></div>
        <div><label className="block text-sm font-medium mb-1">Website</label><input {...register('website')} className="w-full border p-2 rounded" /></div>
        <div><label className="block text-sm font-medium mb-1">Industry</label><input {...register('industry')} className="w-full border p-2 rounded" /></div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Update Company</button>
      </form>
    </div>
  );
}
