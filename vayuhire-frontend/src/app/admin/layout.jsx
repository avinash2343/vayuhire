import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="bg-white rounded-lg shadow-sm min-h-full p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
