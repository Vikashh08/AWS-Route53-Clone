'use client';

import * as React from 'react';
import { useState, use } from 'react';
import Form from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Textarea from '@cloudscape-design/components/textarea';
import Select from '@cloudscape-design/components/select';
import Alert from '@cloudscape-design/components/alert';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../lib/api';
import { useNotification } from '../../../../contexts/NotificationContext';
import { SelectProps } from '@cloudscape-design/components/select';
import { useQueryClient } from '@tanstack/react-query';

export default function CreateRecordPage() {
  const router = useRouter();
  const params = useParams();
  const zoneId = params.zoneId as string;
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();
  const [recordName, setRecordName] = useState('');
  const [recordType, setRecordType] = useState<SelectProps.Option>({ label: 'A - Routes traffic to an IPv4 address', value: 'A' });
  const [value, setValue] = useState('');
  const [ttl, setTtl] = useState('300');
  const [routingPolicy, setRoutingPolicy] = useState<SelectProps.Option>({ label: 'Simple routing', value: 'Simple' });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post(`/hosted-zones/${zoneId}/records`, {
        name: recordName,
        type: recordType.value,
        value: value,
        ttl: parseInt(ttl, 10),
        routing_policy: routingPolicy.value
      });
      addNotification({
        type: 'success',
        content: `Record ${recordName || '@'} created successfully.`,
      });
      await queryClient.invalidateQueries({ queryKey: ['dns-records', zoneId] });
      router.push(`/hosted-zones/${zoneId}`);
    } catch (err: any) {
      // Backend returns validation errors in detail array or string
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg).join(', '));
      } else {
        setError(detail || 'An error occurred while creating the record');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <form onSubmit={handleSubmit}>
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button formAction="none" variant="link" onClick={() => router.push(`/hosted-zones/${zoneId}`)}>
                Cancel
              </Button>
              <Button variant="primary" formAction="submit" loading={isSubmitting}>
                Create records
              </Button>
            </SpaceBetween>
          }
        >
          <Container header={<Header variant="h2">Quick create record</Header>}>
            <SpaceBetween direction="vertical" size="l">
              {error && (
                <Alert type="error" header="Creation failed">
                  {error}
                </Alert>
              )}
              
              <FormField
                label="Record name"
                description="Enter the name for the record (e.g. www, api, or leave blank for apex)"
              >
                <Input
                  value={recordName}
                  onChange={({ detail }) => setRecordName(detail.value)}
                  placeholder="www"
                />
              </FormField>

              <FormField label="Record type">
                <Select
                  selectedOption={recordType}
                  onChange={({ detail }) => {
                    if (detail.selectedOption) {
                      setRecordType({
                        label: detail.selectedOption.label || '',
                        value: detail.selectedOption.value || ''
                      });
                    }
                  }}
                  options={[
                    { label: 'A - Routes traffic to an IPv4 address', value: 'A' },
                    { label: 'AAAA - Routes traffic to an IPv6 address', value: 'AAAA' },
                    { label: 'CNAME - Routes traffic to another domain name', value: 'CNAME' },
                    { label: 'MX - Specifies mail servers', value: 'MX' },
                    { label: 'TXT - Text records', value: 'TXT' },
                    { label: 'NS - Name servers', value: 'NS' },
                    { label: 'PTR - Pointer to a canonical name', value: 'PTR' },
                    { label: 'SRV - Service locator', value: 'SRV' },
                    { label: 'CAA - Certificate Authority Authorization', value: 'CAA' }
                  ]}
                />
              </FormField>

              <FormField
                label="Value"
                description="Route traffic to an IP address or another record depending on record type."
              >
                <Textarea
                  value={value}
                  onChange={({ detail }) => setValue(detail.value)}
                  placeholder="Enter multiple IP addresses or values on separate lines"
                />
              </FormField>

              <FormField label="TTL (Seconds)">
                <Input
                  type="number"
                  value={ttl}
                  onChange={({ detail }) => setTtl(detail.value)}
                />
              </FormField>

              <FormField label="Routing policy">
                <Select
                  selectedOption={routingPolicy}
                  onChange={({ detail }) => {
                    if (detail.selectedOption) {
                      setRoutingPolicy({
                        label: detail.selectedOption.label || '',
                        value: detail.selectedOption.value || ''
                      });
                    }
                  }}
                  options={[
                    { label: 'Simple routing', value: 'Simple' },
                    { label: 'Weighted', value: 'Weighted' },
                    { label: 'Latency', value: 'Latency' },
                    { label: 'Failover', value: 'Failover' }
                  ]}
                />
              </FormField>
            </SpaceBetween>
          </Container>
        </Form>
      </form>
    </div>
  );
}
