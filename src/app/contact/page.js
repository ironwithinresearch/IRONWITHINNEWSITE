'use client';

import { useState, useEffect, useCallback } from 'react';
import IWChatWidget from '../../components/IWChatWidget';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  // Captcha
  const [question, setQuestion] = useState('');
  const [token, setToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const loadChallenge = useCallback(async () => {
    setCaptchaAnswer('');
    try {
      const res = await fetch('/api/contact-challenge', { cache: 'no-store' });
      const data = await res.json();
      setQuestion(data.question || '');
      setToken(data.token || '');
    } catch {
      setQuestion(''); setToken('');
    }
  }, []);

  useEffect(() => { loadChallenge(); }, [loadChallenge]);

  const handleSend = async () => {
    setError('');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 2) {
      setError('Please enter a message.');
      return;
    }
    if (!captchaAnswer.trim()) {
      setError('Please answer the verification question.');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website, captcha_token: token, captcha_answer: captchaAnswer }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus('sent');
        setName(''); setEmail(''); setMessage('');
      } else {
        setStatus('error');
        setError(data.error || 'Message could not be sent. Please email support@ironwithin.io directly.');
        loadChallenge(); // tokens are single-use / time-limited — always refresh after a failure
      }
    } catch {
      setStatus('error');
      setError('Something went wrong. Please email support@ironwithin.io directly.');
      loadChallenge();
    }
  };

  const sending = status === 'sending';

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--card-dark)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-light)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    outline: 'none',
  };
  const labelStyle = { display: 'block', marginBottom: '8px', color: 'var(--text-light)', fontWeight: 600 };

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px', background: 'var(--background-dark)' }}>
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
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '48px', lineHeight: 1.8 }}>
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
            <button onClick={() => { setStatus('idle'); loadChallenge(); }} style={{
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Message</label>
              <textarea placeholder="Your message..." rows={5} value={message} onChange={e => setMessage(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* Honeypot — hidden from humans */}
            <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)}
              aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} />

            {/* Captcha */}
            <div>
              <label style={labelStyle}>
                Verification{question ? ` — ${question}` : ''}
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder={question ? 'Your answer' : 'Loading…'}
                value={captchaAnswer}
                onChange={e => setCaptchaAnswer(e.target.value)}
                disabled={!question}
                style={{ ...inputStyle, maxWidth: '220px' }}
              />
            </div>

            {error && <p style={{ color: '#f87171', fontSize: '0.9rem', margin: 0 }}>{error}</p>}

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
      <IWChatWidget autoOpen />
    </div>
  );
}
