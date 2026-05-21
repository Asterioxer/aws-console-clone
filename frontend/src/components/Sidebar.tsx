'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Server, Database, Users, CreditCard, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ec2', label: 'EC2 Instances', icon: Server },
  { href: '/s3', label: 'S3 Buckets', icon: Database },
  { href: '/iam', label: 'IAM', icon: Users },
  { href: '/billing', label: 'Billing', icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/login') return null;

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
  };

  return (
    <div className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col fixed border-r border-slate-800">
      <div className="p-6 font-bold text-2xl tracking-tight text-white flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
          <span className="text-white text-sm font-black">AWS</span>
        </div>
        Console
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
