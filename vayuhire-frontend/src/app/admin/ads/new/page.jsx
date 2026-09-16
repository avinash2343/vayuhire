'use client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/api';

export default function NewAd() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    await post('/admin/ads', data);
    router.push('/admin/ads');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Ad</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Advertiser Name</label><input {...register('advertiser_name', { required: true })} className="w-full border p-2 rounded" /></div>
        <div><label className="block text-sm font-medium mb-1">Banner URL</label><input {...register('banner_url', { required: true })} className="w-full border p-2 rounded" /></div>
        <div><label className="block text-sm font-medium mb-1">Target URL</label><input {...register('target_url', { required: true })} className="w-full border p-2 rounded" /></div>
        <div>
           <label className="block text-sm font-medium mb-1">Placement</label>
           <select {...register('placement')} className="w-full border p-2 rounded">
             <option value="listing">Listing (Inline)</option>
             <option value="sidebar">Sidebar</option>
             <option value="top">Top Banner</option>
           </select>
        </div>
        <div className="flex gap-4">
           <div className="flex-1"><label className="block text-sm font-medium mb-1">Start Date</label><input type="date" {...register('start_date')} className="w-full border p-2 rounded" /></div>
           <div className="flex-1"><label className="block text-sm font-medium mb-1">End Date</label><input type="date" {...register('end_date')} className="w-full border p-2 rounded" /></div>
        </div>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Create Ad</button>
      </form>
    </div>
  );
}
