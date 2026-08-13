'use client';

import * as React from 'react';
import AppLayout from '@cloudscape-design/components/app-layout';
import Flashbar from '@cloudscape-design/components/flashbar';
import Navigation from './Navigation';
import { usePathname } from 'next/navigation';
import { useNotification } from '../contexts/NotificationContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import Modal from '@cloudscape-design/components/modal';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const { notifications } = useNotification();
  const [isMounted, setIsMounted] = React.useState(false);
  const { isHelpOpen, setIsHelpOpen } = useKeyboardShortcuts();

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
    <>
      <Modal
        onDismiss={() => setIsHelpOpen(false)}
        visible={isHelpOpen}
        closeAriaLabel="Close modal"
        header="Keyboard shortcuts"
        footer={
          <Box float="right">
            <Button onClick={() => setIsHelpOpen(false)}>Close</Button>
          </Box>
        }
      >
        <Table
          columnDefinitions={[
            { id: 'key', header: 'Key', cell: item => <b>{item.key}</b> },
            { id: 'description', header: 'Description', cell: item => item.description }
          ]}
          items={[
            { key: '?', description: 'Show keyboard shortcuts' },
            { key: '/', description: 'Focus search input' },
            { key: 'c', description: 'Create resource (Hosted Zone or Record)' }
          ]}
          variant="embedded"
        />
      </Modal>
      <AppLayout
        navigation={<Navigation />}
        notifications={<Flashbar items={notifications} />}
        toolsHide={true}
        content={children}
      />
    </>
  );
}
