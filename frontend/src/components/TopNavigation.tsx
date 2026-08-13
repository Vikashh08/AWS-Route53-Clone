'use client';

import * as React from 'react';
import TopNavigation from '@cloudscape-design/components/top-navigation';

export default function AppTopNavigation() {
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
          iconName: 'location',
          items: [{ id: 'us-east-1', text: 'US East (N. Virginia)' }]
        },
        {
          type: 'menu-dropdown',
          text: 'Demo User',
          description: 'user@example.com',
          iconName: 'user-profile',
          items: [
            { id: 'profile', text: 'Profile' },
            { id: 'signout', text: 'Sign out' }
          ]
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
