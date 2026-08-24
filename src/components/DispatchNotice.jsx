'use client';

import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { dispatchStatus, formatLeft, ZONE_LABEL, CUTOFF_HOUR } from '@/lib/shipping-cutoff';

/**
 * "Order within 3h 12m for today's 4pm pickup" — or "Ships Monday" once that has gone.
 *
 * Rendered only after mount. The cutoff depends on the current time, so a server render
 * would bake in whatever the clock said at build time and then disagree with the client
 * on hydration — the exact mismatch class that has taken this site down before.
 */
export default function DispatchNotice({ compact = false, style = {} }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const tick = () => setStatus(dispatchStatus());
    tick();
    const id = setInterval(tick, 30000); // keep the countdown honest
    return () => clearInterval(id);
  }, []);

  if (!status) return null;

  const urgent = status.todayPickup;
  const text = urgent
    ? `Order within ${formatLeft(status.minutesLeft)} for today's 4pm pickup`
    : `Ships ${status.shipsLabel} — orders after ${CUTOFF_HOUR - 12}pm ${ZONE_LABEL} go out the next working day`;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        padding: compact ? '9px 12px' : '12px 14px',
        borderRadius: '10px',
        background: urgent ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${urgent ? 'rgba(52,211,153,0.35)' : 'var(--glass-border)'}`,
        fontSize: compact ? '0.78rem' : '0.83rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        ...style,
      }}
    >
      <Truck size={compact ? 15 : 17} color={urgent ? '#34d399' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
      <span>
        {urgent ? (
          <>
            <strong style={{ color: '#34d399' }}>Order within {formatLeft(status.minutesLeft)}</strong>{' '}
            for today&rsquo;s 4pm pickup
          </>
        ) : (
          text
        )}
      </span>
    </div>
  );
}
