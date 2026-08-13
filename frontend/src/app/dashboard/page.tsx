'use client';

import * as React from 'react';
import Header from '@cloudscape-design/components/header';
import Container from '@cloudscape-design/components/container';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Link from '@cloudscape-design/components/link';
import Button from '@cloudscape-design/components/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({ hosted_zones: 0, dns_records: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/hosted-zones/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);
  
  return (
    <div style={{ padding: '24px' }}>
      <SpaceBetween direction="vertical" size="xl">
        <Header variant="h1" description="Highly available and scalable cloud Domain Name System (DNS) web service.">
          Route 53 Dashboard
        </Header>
        
        <ColumnLayout columns={2} variant="text-grid">
          <Container header={<Header variant="h2">DNS management</Header>}>
            <SpaceBetween direction="vertical" size="m">
              <Box variant="p">
                Route traffic to your resources. Manage your domain names and the IP addresses they map to.
              </Box>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eaeded' }}>
                <Link fontSize="heading-m" onFollow={() => router.push('/hosted-zones')}>Hosted zones</Link>
                <Box fontSize="heading-l" fontWeight="bold">{stats.hosted_zones}</Box>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eaeded' }}>
                <Box fontSize="heading-m" color="text-body-secondary">DNS records</Box>
                <Box fontSize="heading-l" fontWeight="bold">{stats.dns_records}</Box>
              </div>
              
              <Button onClick={() => router.push('/hosted-zones/create')}>Create hosted zone</Button>
            </SpaceBetween>
          </Container>

          <Container header={<Header variant="h2">Traffic management</Header>}>
            <SpaceBetween direction="vertical" size="m">
              <Box variant="p">
                Route traffic to multiple resources in configurations that can be as complex as you need.
              </Box>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eaeded' }}>
                <Link fontSize="heading-m">Traffic policies</Link>
                <Box fontSize="heading-l" fontWeight="bold">0</Box>
              </div>
              
              <Button disabled>Create traffic policy</Button>
            </SpaceBetween>
          </Container>
          
          <Container header={<Header variant="h2">Availability monitoring</Header>}>
            <SpaceBetween direction="vertical" size="m">
              <Box variant="p">
                Monitor the health and performance of your application servers, and other resources.
              </Box>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eaeded' }}>
                <Link fontSize="heading-m">Health checks</Link>
                <Box fontSize="heading-l" fontWeight="bold">0</Box>
              </div>
              
              <Button disabled>Create health check</Button>
            </SpaceBetween>
          </Container>

          <Container header={<Header variant="h2">Domain registration</Header>}>
            <SpaceBetween direction="vertical" size="m">
              <Box variant="p">
                Register domain names, or transfer domain registration from another registrar to Route 53.
              </Box>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eaeded' }}>
                <Link fontSize="heading-m">Registered domains</Link>
                <Box fontSize="heading-l" fontWeight="bold">0</Box>
              </div>
              
              <Button disabled>Register domain</Button>
            </SpaceBetween>
          </Container>
        </ColumnLayout>
      </SpaceBetween>
    </div>
  );
}
