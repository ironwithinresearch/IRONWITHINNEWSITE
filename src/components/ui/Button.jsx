'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';

/**
 * Universal Button component
 *
 * Props:
 *  variant  : 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
 *  size     : 'sm' | 'md' | 'lg'
 *  href     : string  → renders as <Link>
 *  loading  : boolean
 *  icon     : ReactNode (left icon)
 *  iconRight: ReactNode (right icon)
 *  full     : boolean → full width
 *  disabled : boolean
 */

const variants = {
  primary: {
    background: 'var(--gradient-primary)',
    color: '#fff',
    border: 'none',
    boxShadow: 'var(--glow-sm)',
    hoverShadow: 'var(--glow-blue)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--text-light)',
    border: '1px solid var(--primary-blue)',
    boxShadow: 'none',
    hoverShadow: 'var(--glow-sm)',
  },
  ghost: {
    background: 'var(--glass-bg)',
    color: 'var(--text-light)',
    border: '1px solid var(--glass-border)',
    boxShadow: 'none',
    hoverShadow: 'none',
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 0 16px rgba(239,68,68,0.3)',
    hoverShadow: '0 0 24px rgba(239,68,68,0.5)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--primary-blue)',
    border: '1px solid var(--glass-border)',
    boxShadow: 'none',
    hoverShadow: 'var(--glow-sm)',
  },
};

const sizes = {
  sm: { padding: '7px 16px',  fontSize: '0.82rem', gap: '6px',  iconSize: 14 },
  md: { padding: '11px 24px', fontSize: '0.92rem', gap: '8px',  iconSize: 16 },
  lg: { padding: '14px 32px', fontSize: '1rem',    gap: '10px', iconSize: 18 },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  loading = false,
  icon,
  iconRight,
  full = false,
  disabled = false,
  onClick,
  type = 'button',
  style: extraStyle = {},
}) {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--transition-base)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    width: full ? '100%' : 'auto',
    background: v.background,
    color: v.color,
    border: v.border,
    boxShadow: v.boxShadow,
    letterSpacing: '0.01em',
    ...extraStyle,
  };

  const handleMouseEnter = (e) => {
    if (disabled || loading) return;
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = v.hoverShadow;
    if (variant === 'ghost') {
      e.currentTarget.style.borderColor = 'rgba(0,207,255,0.3)';
    }
    if (variant === 'outline') {
      e.currentTarget.style.borderColor = 'var(--primary-blue)';
      e.currentTarget.style.background = 'rgba(0,207,255,0.06)';
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = v.boxShadow;
    if (variant === 'ghost') {
      e.currentTarget.style.borderColor = 'var(--glass-border)';
    }
    if (variant === 'outline') {
      e.currentTarget.style.borderColor = 'var(--glass-border)';
      e.currentTarget.style.background = 'transparent';
    }
  };

  const content = (
    <>
      {loading
        ? <Loader2 size={s.iconSize} style={{ animation: 'spin 1s linear infinite' }} />
        : icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      }
      {children}
      {!loading && iconRight && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{iconRight}</span>
      )}
    </>
  );

  if (href && !disabled && !loading) {
    return (
      <Link
        href={href}
        style={baseStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </Link>
    );
  }

  return (
    <>
      <button
        type={type}
        onClick={!disabled && !loading ? onClick : undefined}
        disabled={disabled || loading}
        style={baseStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </button>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}