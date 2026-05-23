import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * SectionHeader — reusable section title block
 *
 * Props:
 *  eyebrow      : string  — small label above title
 *  eyebrowIcon  : ReactNode — lucide icon next to eyebrow
 *  eyebrowColor : string  — css color var (default primary-blue)
 *  title        : string  — main heading (supports <span> for gradient word)
 *  gradientWord : string  — word inside title to apply gradient to
 *  subtitle     : string  — paragraph below title
 *  align        : 'left' | 'center' | 'right'
 *  viewAllHref  : string  — renders "View All" link on right side
 *  viewAllLabel : string
 */

export default function SectionHeader({
  eyebrow,
  eyebrowIcon,
  eyebrowColor = 'var(--primary-blue)',
  title = '',
  gradientWord = '',
  subtitle,
  align = 'center',
  viewAllHref,
  viewAllLabel = 'View All',
}) {
  const textAlign = align;

  /* Split title around the gradient word */
  let titleContent;
  if (gradientWord && title.includes(gradientWord)) {
    const parts = title.split(gradientWord);
    titleContent = (
      <>
        {parts[0]}
        <span style={{
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {gradientWord}
        </span>
        {parts[1]}
      </>
    );
  } else {
    titleContent = title;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: align === 'left' ? 'flex-start' : 'center',
      justifyContent: align === 'left' ? 'space-between' : 'center',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '48px',
    }}>
      {/* Left / Center block */}
      <div style={{ textAlign, flex: 1 }}>

        {/* Eyebrow */}
        {eyebrow && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: eyebrowColor,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            {eyebrowIcon && <span style={{ display: 'flex' }}>{eyebrowIcon}</span>}
            {eyebrow}
          </div>
        )}

        {/* Title */}
        {title && (
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.7rem, 4vw, 2.6rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: subtitle ? '14px' : 0,
            letterSpacing: '-0.02em',
          }}>
            {titleContent}
          </h2>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.7,
            maxWidth: align === 'center' ? '520px' : '100%',
            margin: align === 'center' ? '0 auto' : '0',
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* View All link — only on left-aligned headers */}
      {viewAllHref && align === 'left' && (
        <Link href={viewAllHref} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '9px 20px',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          fontWeight: 500,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'all var(--transition-fast)',
          flexShrink: 0,
        }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--primary-blue)';
            e.currentTarget.style.borderColor = 'var(--primary-blue)';
            e.currentTarget.style.background = 'rgba(0,207,255,0.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--glass-border)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {viewAllLabel} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}