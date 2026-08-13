'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useKeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      
      if (isInput) return;

      if (e.key === '?') {
        e.preventDefault();
        setIsHelpOpen(true);
      }
      
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      if (e.key === 'c') {
        e.preventDefault();
        if (pathname === '/hosted-zones') {
          router.push('/hosted-zones/create');
        } else if (pathname.startsWith('/hosted-zones/') && pathname.split('/').length === 3) {
          // It's a hosted zone details page (e.g., /hosted-zones/123)
          router.push(`${pathname}/create-record`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, pathname]);

  return {
    isHelpOpen,
    setIsHelpOpen
  };
}
