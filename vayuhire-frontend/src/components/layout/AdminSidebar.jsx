'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, Briefcase, RefreshCw, Megaphone, LogOut } from 'lucide-react';
import { removeToken } from '@/lib/auth';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Companies', href: '/admin/companies', icon: Building2 },
    { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
    { name: 'Scrape Logs', href: '/admin/scrape-logs', icon: RefreshCw },
    { name: 'Ads', href: '/admin/ads', icon: Megaphone },
  ];

  const handleLogout = () => {
    removeToken();
    router.push('/admin/login');
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-400">Admin Panel</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map(link => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link key={link.name} href={link.href} className={`flex items-center space-x-3 px-3 py-2 rounded-md ${isActive ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}>
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4">
        <button onClick={handleLogout} className="flex items-center space-x-3 px-3 py-2 w-full rounded-md hover:bg-slate-800 text-red-400">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
