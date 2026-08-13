'use client';

import * as React from 'react';
import { useState, use, useEffect } from 'react';
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
import Spinner from '@cloudscape-design/components/spinner';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import { useNotification } from '../../../../../contexts/NotificationContext';
import { SelectProps } from '@cloudscape-design/components/select';
import { useQueryClient } from '@tanstack/react-query';

const RECORD_TYPES = [
  { label: 'A - Routes traffic to an IPv4 address', value: 'A' },
  { label: 'AAAA - Routes traffic to an IPv6 address', value: 'AAAA' },
  { label: 'CNAME - Routes traffic to another domain name', value: 'CNAME' },
  { label: 'MX - Specifies mail servers', value: 'MX' },
  { label: 'TXT - Text records', value: 'TXT' },
  { label: 'NS - Name servers', value: 'NS' },
  { label: 'PTR - Pointer to a canonical name', value: 'PTR' },
  { label: 'SRV - Service locator', value: 'SRV' },
  { label: 'CAA - Certificate Authority Authorization', value: 'CAA' }
];

const ROUTING_POLICIES = [
  { label: 'Simple routing', value: 'Simple' },
  { label: 'Weighted', value: 'Weighted' },
  { label: 'Latency', value: 'Latency' },
  { label: 'Failover', value: 'Failover' }
];

export default function EditRecordPage() {
  const router = useRouter();
  const params = useParams();
  const zoneId = params.zoneId as string;
  const recordId = params.recordId as string;
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();
  
  const [recordName, setRecordName] = useState('');
  const [recordType, setRecordType] = useState<SelectProps.Option>(RECORD_TYPES[0]);
  const [value, setValue] = useState('');
  const [ttl, setTtl] = useState('300');
  const [routingPolicy, setRoutingPolicy] = useState<SelectProps.Option>(ROUTING_POLICIES[0]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await api.get(`/hosted-zones/${zoneId}/records/${recordId}`);
        const record = response.data.data;
        
        setRecordName(record.name);
        setRecordType(RECORD_TYPES.find(t => t.value === record.type) || RECORD_TYPES[0]);
        setValue(record.value);
        setTtl(record.ttl.toString());
        setRoutingPolicy(ROUTING_POLICIES.find(p => p.value === record.routing_policy) || ROUTING_POLICIES[0]);
      } catch (err: any) {
        setError('Failed to fetch record details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecord();
  }, [zoneId, recordId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.patch(`/hosted-zones/${zoneId}/records/${recordId}`, {
        name: recordName,
        type: recordType.value,
        value: value,
        ttl: parseInt(ttl, 10),
        routing_policy: routingPolicy.value
      });
      addNotification({
        type: 'success',
        content: `Record ${recordName || '@'} updated successfully.`,
      });
      await queryClient.invalidateQueries({ queryKey: ['dns-records', zoneId] });
      router.push(`/hosted-zones/${zoneId}`);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg).join(', '));
      } else {
        setError(detail || 'An error occurred while updating the record');
      }
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}><Spinner size="large" /></div>;
  }

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
                Save changes
              </Button>
            </SpaceBetween>
          }
        >
          <Container header={<Header variant="h2">Edit record</Header>}>
            <SpaceBetween direction="vertical" size="l">
              {error && (
                <Alert type="error" header="Error">
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
                  options={RECORD_TYPES}
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
                  options={ROUTING_POLICIES}
                />
              </FormField>
            </SpaceBetween>
          </Container>
        </Form>
      </form>
    </div>
  );
}
