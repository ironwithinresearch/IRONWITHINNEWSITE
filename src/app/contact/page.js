'use client';

export default function ContactPage() {
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
            <input type="text" placeholder="Your name" style={{
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
            <input type="email" placeholder="your@email.com" style={{
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
            <textarea placeholder="Your message..." rows={5} style={{
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

          <button style={{
            padding: '14px 32px',
            background: 'var(--gradient-primary)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            transition: 'all var(--transition-base)',
            boxShadow: 'var(--glow-blue)',
          }}>
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
