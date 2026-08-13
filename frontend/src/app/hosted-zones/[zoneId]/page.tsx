import * as React from 'react';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import DNSRecordsTable from '../../../components/DNSRecordsTable';

export default function HostedZoneDetailsPage({ params }: { params: Promise<{ zoneId: string }> }) {
  const { zoneId } = React.use(params);
  
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
