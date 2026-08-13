import DNSRecordsTable from "../../../components/DNSRecordsTable";
import Header from '@cloudscape-design/components/header';

export default function HostedZoneDetailsPage({ params }: { params: { zoneId: string } }) {
  // In a full implementation we would also fetch the Zone details here
  
  return (
    <div style={{ padding: '24px' }}>
      <Header variant="h1" description="Hosted zone details and records">
        Hosted Zone
      </Header>
      <div style={{ marginTop: '24px' }}>
        <DNSRecordsTable zoneId={params.zoneId} />
      </div>
    </div>
  );
}
