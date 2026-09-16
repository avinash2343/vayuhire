'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/api';

export default function NewCompany() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    await post('/admin/companies', data);
    router.push('/admin/companies');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Company</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Name</label><input {...register('name', { required: true })} className="w-full border p-2 rounded" /></div>
        <div><label className="block text-sm font-medium mb-1">Logo URL</label><input {...register('logo_url')} className="w-full border p-2 rounded" /></div>
        <div><label className="block text-sm font-medium mb-1">Career Page URL</label><input {...register('career_page_url', { required: true })} className="w-full border p-2 rounded" /></div>
        <div><label className="block text-sm font-medium mb-1">Website</label><input {...register('website')} className="w-full border p-2 rounded" /></div>
        <div><label className="block text-sm font-medium mb-1">Industry</label><input {...register('industry')} className="w-full border p-2 rounded" /></div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Save Company</button>
      </form>
    </div>
  );
}
