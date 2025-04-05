// app/components/dashboard/Sidebar.tsx
'use client';

import { useState } from 'react';
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
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

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

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className={`flex flex-col ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center justify-between flex-shrink-0 px-4">
                {!isCollapsed && <span className="text-xl font-bold text-blue-600">QuizMe</span>}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="flex items-center justify-center h-8 w-8 rounded-full"
                >
                  {isCollapsed ? (
                    <Bars3Icon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                  ) : (
                    <XMarkIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                  )}
                </button>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                      ${(item.href === '/dashboard' ? pathname === item.href : pathname?.startsWith(item.href)) 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                      
                    `}
                    data-tooltip-id={item.name}
                    data-tooltip-content={item.name}
                    data-tooltip-place="right"
                  >
                    <item.icon
                      className={`
                        mr-3 flex-shrink-0 h-6 w-6
                        ${(item.href === '/dashboard' ? pathname === item.href : pathname?.startsWith(item.href)) 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                      `}
                      aria-hidden="true"
                    />
                    {!isCollapsed && item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Tooltip id="analytics"/>
    </>
  );
}