'use client'

import Link from 'next/link';
import Logo from './logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const routes = [
  {
    label: 'Dashboard',
    path: '/app/dashboard',
  },
  {
    label: 'Account',
    path: '/app/account',
  },
];

const AppHeader = () => {
  const activePathname = usePathname();
  return (
    <header className='flex items-center justify-between py-2 border-b border-white/10'>
      <Logo />
      <nav className=''>
        <ul className='flex gap-2 text-xs'>
          {routes.map((route) => (
            <li key={route.path}>
              <Link href={route.path} className={cn('px-2 py-1 transition rounded-sm text-white/70 hover:text-white focus:text-white', {
                'bg-black/10 text-white': activePathname === route.path,
                })}>{route.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
