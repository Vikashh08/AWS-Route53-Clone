'use client';

import * as React from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import Navigation from './Navigation';
import { usePathname } from 'next/navigation';

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AppLayout
      navigation={<Navigation />}
      toolsHide={true}
      content={children}
    />
  );
}
