'use client';

import * as React from 'react';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import { usePathname, useRouter } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SideNavigation
      activeHref={pathname}
      header={{ href: '/', text: 'Route 53' }}
      onFollow={event => {
        if (!event.detail.external) {
          event.preventDefault();
          router.push(event.detail.href);
        }
      }}
      items={[
        { type: 'link', text: 'Dashboard', href: '/dashboard' },
        { type: 'link', text: 'Hosted zones', href: '/hosted-zones' },
        { type: 'link', text: 'Traffic policies', href: '/traffic-policies' },
        { type: 'link', text: 'Health checks', href: '/health-checks' },
        {
          type: 'section',
          text: 'Resolver',
          items: [
            { type: 'link', text: 'Dashboard', href: '/resolver' },
            { type: 'link', text: 'Query logging', href: '/resolver/query-logging' },
            { type: 'link', text: 'Endpoints', href: '/resolver/endpoints' },
            { type: 'link', text: 'Rules', href: '/resolver/rules' },
          ]
        },
        { type: 'link', text: 'Profiles', href: '/profiles' },
      ]}
    />
  );
}
