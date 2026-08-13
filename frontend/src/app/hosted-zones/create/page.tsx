'use client';

import * as React from 'react';
import { useState } from 'react';
import Form from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Textarea from '@cloudscape-design/components/textarea';
import RadioGroup from '@cloudscape-design/components/radio-group';
import Alert from '@cloudscape-design/components/alert';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';

export default function CreateHostedZonePage() {
  const router = useRouter();
  const [domainName, setDomainName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/hosted-zones', {
        name: domainName,
        description: description || undefined,
        is_private: type === 'Private'
      });
      router.push('/hosted-zones');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred while creating the hosted zone');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <form onSubmit={handleSubmit}>
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button formAction="none" variant="link" onClick={() => router.push('/hosted-zones')}>
                Cancel
              </Button>
              <Button variant="primary" formAction="submit" loading={isSubmitting}>
                Create hosted zone
              </Button>
            </SpaceBetween>
          }
        >
          <Container
            header={
              <Header variant="h2" description="Create a public hosted zone to route traffic on the internet or a private hosted zone to route traffic within Amazon VPCs.">
                Hosted zone configuration
              </Header>
            }
          >
            <SpaceBetween direction="vertical" size="l">
              {error && (
                <Alert type="error" header="Creation failed">
                  {error}
                </Alert>
              )}
              
              <FormField
                label="Domain name"
                description="Enter the name of the domain. For example, example.com."
              >
                <Input
                  value={domainName}
                  onChange={({ detail }) => setDomainName(detail.value)}
                  placeholder="example.com"
                />
              </FormField>

              <FormField label="Description - optional">
                <Textarea
                  value={description}
                  onChange={({ detail }) => setDescription(detail.value)}
                  placeholder="Comments about this hosted zone"
                />
              </FormField>

              <FormField
                label="Type"
                description="A public hosted zone determines how traffic is routed on the internet. A private hosted zone determines how traffic is routed within one or more Amazon VPCs."
              >
                <RadioGroup
                  onChange={({ detail }) => setType(detail.value)}
                  value={type}
                  items={[
                    { value: 'Public', label: 'Public hosted zone' },
                    { value: 'Private', label: 'Private hosted zone' }
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
