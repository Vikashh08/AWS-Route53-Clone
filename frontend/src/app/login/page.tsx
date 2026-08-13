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
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.data.access_token);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred during login');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f2f3f3' }}>
      <div style={{ width: '400px' }}>
        <form onSubmit={handleSubmit}>
          <Form
            actions={
              <Button variant="primary" formAction="submit" loading={isSubmitting}>
                Sign in
              </Button>
            }
          >
            <Container header={<Header variant="h2">Sign in to AWS Route 53 Clone</Header>}>
              <SpaceBetween direction="vertical" size="l">
                {error && (
                  <Alert type="error" header="Sign in failed">
                    {error}
                  </Alert>
                )}
                <FormField label="Email address">
                  <Input
                    value={email}
                    onChange={({ detail }) => setEmail(detail.value)}
                    type="email"
                    placeholder="user@example.com"
                  />
                </FormField>
                <FormField label="Password">
                  <Input
                    value={password}
                    onChange={({ detail }) => setPassword(detail.value)}
                    type="password"
                    placeholder="••••••••"
                  />
                </FormField>
              </SpaceBetween>
            </Container>
          </Form>
        </form>
        <Box textAlign="center" margin={{ top: 'l' }} color="text-body-secondary">
          Not implemented: "Create an account" (backend only supports manual seeds right now or use a default)
        </Box>
      </div>
    </div>
  );
}
