'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const handleSend = async () => {
    setError('');
    if (!email || !message.trim()) {
      setError('Please enter your email and a message.');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus('sent');
        setName(''); setEmail(''); setMessage('');
      } else {
        setStatus('error');
        setError(data.error || 'Message could not be sent. Please email support@ironwithin.io directly.');
      }
    } catch {
      setStatus('error');
      setError('Something went wrong. Please email support@ironwithin.io directly.');
    }
  };

  const sending = status === 'sending';

  return (
    <div style={{
      minHeight: '100vh',
      padding: '80px 24px',
      background: 'var(--background-dark)',
    }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          fontWeight: 900,
          marginBottom: '16px',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>Contact Us</h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          marginBottom: '48px',
          lineHeight: 1.8,
        }}>
          Have questions about our peptides? We're here to help. Reach out to us and we'll respond within 24 hours.
        </p>

        {status === 'sent' ? (
          <div style={{
            padding: '24px',
            background: 'rgba(52,211,153,0.08)',
            border: '1px solid rgba(52,211,153,0.4)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-light)',
          }}>
            <p style={{ fontWeight: 700, marginBottom: '6px', color: '#34d399' }}>Message sent — thank you!</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              We've received your message and will respond within 24 hours.
            </p>
            <button onClick={() => setStatus('idle')} style={{
              marginTop: '16px',
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-light)',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}>Send another</button>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-light)',
                fontWeight: 600,
              }}>Name</label>
              <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                outline: 'none',
              }} />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-light)',
                fontWeight: 600,
              }}>Email</label>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                outline: 'none',
              }} />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'var(--text-light)',
                fontWeight: 600,
              }}>Message</label>
              <textarea placeholder="Your message..." rows={5} value={message} onChange={e => setMessage(e.target.value)} style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--card-dark)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
              }} />
            </div>

            {/* Honeypot — hidden from humans; bots that fill it are dropped */}
            <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)}
              aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />

            {error && (
              <p style={{ color: '#f87171', fontSize: '0.9rem', margin: 0 }}>{error}</p>
            )}

            <button onClick={handleSend} disabled={sending} style={{
              padding: '14px 32px',
              background: 'var(--gradient-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: sending ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all var(--transition-base)',
              boxShadow: 'var(--glow-blue)',
              opacity: sending ? 0.7 : 1,
            }}>
              {sending ? 'Sending…' : 'Send Message'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
