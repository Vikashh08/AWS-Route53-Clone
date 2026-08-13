'use client';

import * as React from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import Flashbar from '@cloudscape-design/components/flashbar';
import Navigation from './Navigation';
import { usePathname } from 'next/navigation';
import { useNotification } from '../contexts/NotificationContext';

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const { notifications } = useNotification();

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <AppLayout
      navigation={<Navigation />}
      notifications={<Flashbar items={notifications} />}
      toolsHide={true}
      content={children}
    />
  );
}
