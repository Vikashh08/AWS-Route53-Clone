'use client';

import * as React from 'react';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function AppTopNavigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <TopNavigation
      identity={{
        href: '/',
        title: 'AWS Route53 Clone',
      }}
      utilities={[
        {
          type: 'menu-dropdown',
          text: 'us-east-1',
          description: 'US East (N. Virginia)',
          items: [{ id: 'us-east-1', text: 'US East (N. Virginia)' }]
        },
        {
          type: 'menu-dropdown',
          text: user ? user.name : 'Demo User',
          description: user ? user.email : 'user@example.com',
          iconName: 'user-profile',
          items: [
            { id: 'profile', text: 'Profile' },
            { id: 'signout', text: 'Sign out' }
          ],
          onItemClick: (e) => {
            if (e.detail.id === 'signout') {
              logout();
            }
          }
        }
      ]}
      i18nStrings={{
        searchIconAriaLabel: 'Search',
        searchDismissIconAriaLabel: 'Close search',
        overflowMenuTriggerText: 'More'
      }}
    />
  );
}
