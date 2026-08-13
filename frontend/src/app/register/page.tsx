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
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

export default function SignupPage() {
  const [name, setName] = useState('');
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
      const response = await api.post('/auth/signup', { name, email, password });
      // The signup endpoint sets the cookie and returns the user, just like login.
      // We can manually trigger login flow in the context if it uses tokens,
      // or if it relies on cookies, we can just fetch /me.
      login('token_not_used_if_cookies');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg).join(', '));
      } else {
        setError(detail || 'An error occurred during signup');
      }
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
                Create account
              </Button>
            }
          >
            <Container header={<Header variant="h2">Create a new account</Header>}>
              <SpaceBetween direction="vertical" size="l">
                {error && (
                  <Alert type="error" header="Signup failed">
                    {error}
                  </Alert>
                )}
                <FormField label="Full Name">
                  <Input
                    value={name}
                    onChange={({ detail }) => setName(detail.value)}
                    placeholder="John Doe"
                  />
                </FormField>
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
          Already have an account? <Link href="/login" style={{ color: '#0972d3', textDecoration: 'none' }}>Sign in</Link>
        </Box>
      </div>
    </div>
  );
}
