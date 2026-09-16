'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { post } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function AdminLogin() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const res = await post('/admin/login', data);
      setToken(res.token);
      router.push('/admin/dashboard');
    } catch (e) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">Admin Login</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input {...register('email', { required: true })} type="email" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input {...register('password', { required: true })} type="password" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
