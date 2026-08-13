'use client';

import * as React from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import Navigation from './Navigation';

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout
      navigation={<Navigation />}
      toolsHide={true}
      content={children}
    />
  );
}
