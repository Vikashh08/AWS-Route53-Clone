import * as React from 'react';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import DNSRecordsTable from '../../../components/DNSRecordsTable';
import { useParams } from 'next/navigation';

export default function HostedZoneDetailsPage() {
  const params = useParams();
  const zoneId = params.zoneId as string;
  
  return (
    <div style={{ padding: '24px' }}>
      <Header variant="h1">
        Hosted zone details
      </Header>
      <div style={{ marginTop: '24px' }}>
        <DNSRecordsTable zoneId={zoneId} />
      </div>
    </div>
  );
}
