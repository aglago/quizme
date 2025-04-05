// app/components/dashboard/BottomNavigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  AcademicCapIcon, 
  CalendarIcon, 
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Documents', href: '/dashboard/documents', icon: DocumentTextIcon },
  { name: 'Quizzes', href: '/dashboard/quizzes', icon: AcademicCapIcon },
  { name: 'Study Plans', href: '/dashboard/study-plans', icon: CalendarIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 py-2">
      <div className="flex justify-around">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              flex flex-col items-center text-gray-600 hover:text-blue-600
              ${pathname === item.href || pathname?.startsWith(`${item.href}/`) ? 'text-blue-600' : ''}
            `}
          >
            <item.icon className="h-6 w-6 mb-1" aria-hidden="true" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}