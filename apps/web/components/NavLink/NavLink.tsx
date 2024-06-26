"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

export default function NavLink({ label, href }: { label: string, href: string }) {
  const current = usePathname();

  return (
    <Link 
      href={href} 
      className={twMerge(
        'hidden px-4 py-1.5 md:block rounded text-nowrap text-center transition-colors',
        current === href ? 'text-pink-600 dark:text-pink-500' : 'hover:bg-pink-100 text-slate-500 dark:hover:bg-white/10 dark:text-slate-300'
      )}
    >
      {label}
    </Link>
  );
}
