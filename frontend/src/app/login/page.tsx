'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import Alert from '@cloudscape-design/components/alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('root');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred during login');
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('user@example.com');
    setPassword('password123');
    setTimeout(() => {
      const form = document.getElementById('login-form') as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 50);
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
        <span style={{ cursor: 'pointer' }}>Multi-session disabled ▼</span>
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
        
        {/* Left Card - Sign In */}
        <div style={{ 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          padding: '32px', 
          width: '100%', 
          maxWidth: '380px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          border: '1px solid #e9ebed'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', color: '#16191f' }}>Sign In</h1>
          <p style={{ fontSize: '14px', margin: '0 0 24px 0', color: '#16191f' }}>Access your Route53 Clone account.</p>

          <form id="login-form" onSubmit={handleSubmit}>
            {error && (
              <div style={{ marginBottom: '16px' }}>
                <Alert type="error">{error}</Alert>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#16191f' }}>
                User type <span style={{ color: '#0972d3', fontWeight: 400, cursor: 'pointer' }}>(not sure?)</span>
              </div>
              
              <div 
                onClick={() => setUserType('root')}
                style={{
                  border: userType === 'root' ? '2px solid #0972d3' : '1px solid #879596',
                  backgroundColor: userType === 'root' ? '#f1f8fa' : '#fff',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ 
                  width: '16px', height: '16px', borderRadius: '50%', border: userType === 'root' ? '5px solid #0972d3' : '1px solid #879596', 
                  marginTop: '2px', marginRight: '12px', flexShrink: 0
                }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#16191f' }}>Root user</div>
                  <div style={{ fontSize: '12px', color: '#5f6b7a', marginTop: '2px' }}>Account owner that performs tasks requiring unrestricted access.</div>
                </div>
              </div>

              <div 
                onClick={() => setUserType('iam')}
                style={{
                  border: userType === 'iam' ? '2px solid #0972d3' : '1px solid #879596',
                  backgroundColor: userType === 'iam' ? '#f1f8fa' : '#fff',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ 
                  width: '16px', height: '16px', borderRadius: '50%', border: userType === 'iam' ? '5px solid #0972d3' : '1px solid #879596', 
                  marginTop: '2px', marginRight: '12px', flexShrink: 0
                }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#16191f' }}>IAM user</div>
                  <div style={{ fontSize: '12px', color: '#5f6b7a', marginTop: '2px' }}>User within an account that performs daily tasks.</div>
                </div>
              </div>
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
              Sign in
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#5f6b7a', fontSize: '14px', fontWeight: 700 }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e9ebed' }}></div>
            <span style={{ padding: '0 12px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e9ebed' }}></div>
          </div>

          <Link href="/register" style={{ textDecoration: 'none' }}>
            <button 
              type="button"
              style={{
                width: '100%',
                backgroundColor: '#fff',
                color: '#0972d3',
                border: '1px solid #879596',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              New to AWS? Sign up
            </button>
          </Link>
          
          <button 
            type="button"
            onClick={handleDemoLogin}
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
            Demo Login
          </button>

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
