'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import Alert from '@cloudscape-design/components/alert';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('/auth/signup', { name, email, password });
      login('token_not_used_if_cookies');
      router.push('/dashboard');
    } catch (err: any) {
      const apiError = err.response?.data?.error?.message;
      const detail = err.response?.data?.detail;
      
      if (apiError) {
        setError(apiError);
      } else if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg).join(', '));
      } else {
        setError(detail || 'An error occurred during signup');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f2f3f3', 
      fontFamily: '"Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif',
      backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Nav */}
      <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px', gap: '24px', fontSize: '13px', fontWeight: 700, color: '#0972d3' }}>
        <span style={{ cursor: 'pointer' }}>Provide feedback</span>
        <span style={{ cursor: 'pointer' }}>English ▼</span>
      </header>

      {/* Logo Area */}
      <div style={{ textAlign: 'center', padding: '20px 0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'inherit', letterSpacing: '-0.5px' }}>
          <span style={{ color: '#232f3e' }}>AWS </span>
          <span style={{ color: '#ff9900' }}>Route 53 </span>
          <span style={{ color: '#232f3e' }}>Clone</span>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '30px', padding: '0 20px', flexWrap: 'wrap' }}>
        
        {/* Left Card - Sign Up */}
        <div style={{ 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          padding: '32px', 
          width: '100%', 
          maxWidth: '380px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          border: '1px solid #e9ebed'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', color: '#16191f' }}>Sign up for AWS</h1>
          <p style={{ fontSize: '14px', margin: '0 0 24px 0', color: '#16191f' }}>Create your Route53 Clone account.</p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ marginBottom: '16px' }}>
                <Alert type="error">{error}</Alert>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#16191f' }}>Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #879596',
                  borderRadius: '2px',
                  fontSize: '14px',
                  color: '#16191f',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#16191f' }}>Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@example.com"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #879596',
                  borderRadius: '2px',
                  fontSize: '14px',
                  color: '#16191f',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#16191f' }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #879596',
                  borderRadius: '2px',
                  fontSize: '14px',
                  color: '#16191f',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                backgroundColor: '#ff9900',
                color: '#16191f',
                border: '1px solid #ff9900',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                marginBottom: '16px'
              }}
            >
              Sign up
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#5f6b7a', fontSize: '14px', fontWeight: 700 }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e9ebed' }}></div>
            <span style={{ padding: '0 12px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e9ebed' }}></div>
          </div>

          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button 
              type="button"
              style={{
                width: '100%',
                backgroundColor: '#fff',
                color: '#16191f',
                border: '1px solid #879596',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Sign in to an existing AWS account
            </button>
          </Link>

          <div style={{ marginTop: '24px', fontSize: '11px', color: '#5f6b7a', textAlign: 'center', lineHeight: '1.4' }}>
            By continuing, you agree to <span style={{color:'#0972d3'}}>AWS Customer Agreement</span> or other agreement for AWS services, and the <span style={{color:'#0972d3'}}>Privacy Notice</span>. This site uses essential cookies. See our <span style={{color:'#0972d3'}}>Cookie Notice</span> for more information.
          </div>
        </div>

        {/* Right Card - Promo */}
        <div style={{ 
          width: '100%', 
          maxWidth: '450px',
          background: 'linear-gradient(135deg, #dcf8fc 0%, #e8fcff 100%)',
          borderRadius: '8px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignSelf: 'stretch'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: 300, color: '#16191f', margin: '0 0 16px 0', lineHeight: 1.2 }}>
            AWS Local Zones<br/>now in Athens
          </h2>
          <p style={{ fontSize: '18px', color: '#16191f', margin: '0 0 32px 0', lineHeight: 1.4 }}>
            Local AWS infrastructure in Greece for data residency and low-latency access
          </p>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#16191f', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            Explore AWS Local Zones <span style={{ marginLeft: '4px', fontSize: '18px' }}>→</span>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', padding: '40px 20px', textAlign: 'center', fontSize: '12px', color: '#5f6b7a' }}>
        © 2026 Amazon Web Services, Inc. or its affiliates. All rights reserved.
      </footer>
    </div>
  );
}
