'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Form from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import FormField from '@cloudscape-design/components/form-field';
import Textarea from '@cloudscape-design/components/textarea';
import Alert from '@cloudscape-design/components/alert';
import Spinner from '@cloudscape-design/components/spinner';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../lib/api';
import { useNotification } from '../../../../contexts/NotificationContext';
import { useQueryClient } from '@tanstack/react-query';

export default function EditHostedZonePage() {
  const router = useRouter();
  const params = useParams();
  const zoneId = params.zoneId as string;
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();
  
  const [description, setDescription] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!zoneId) return;
    
    api.get(`/hosted-zones/${zoneId}`)
      .then(res => {
        const zone = res.data.data;
        setDescription(zone.comment || '');
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to load hosted zone details');
        setIsLoading(false);
      });
  }, [zoneId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.patch(`/hosted-zones/${zoneId}`, {
        description: description
      });
      addNotification({
        type: 'success',
        content: `Hosted zone updated successfully.`,
      });
      await queryClient.invalidateQueries({ queryKey: ['hosted-zones'] });
      router.push('/hosted-zones');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred while updating the hosted zone');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Spinner size="large" />;
  }

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
                Save changes
              </Button>
            </SpaceBetween>
          }
        >
          <Container header={<Header variant="h2">Edit hosted zone</Header>}>
            <SpaceBetween direction="vertical" size="l">
              {error && (
                <Alert type="error" header="Update failed">
                  {error}
                </Alert>
              )}
              
              <FormField label="Description">
                <Textarea
                  value={description}
                  onChange={({ detail }) => setDescription(detail.value)}
                  placeholder="Optional description"
                />
              </FormField>
            </SpaceBetween>
          </Container>
        </Form>
      </form>
    </div>
  );
}
