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
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid Hydration mismatch from Cloudscape AppLayout
  }

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
