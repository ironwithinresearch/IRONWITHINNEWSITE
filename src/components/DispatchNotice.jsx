'use client';

import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { dispatchStatus, formatLeft, PROCESSING_CAVEAT } from '@/lib/shipping-cutoff';
import { shipDaysLive, SHIPDAYS_LABEL } from '@/lib/shipDays';
import { shipPauseLive } from '@/lib/shipPause';

/**
 * "Order within 3h 12m for same-day shipping on most orders; processing can take up to 72
 * hours" — or "Most orders placed now ship Monday; processing can take up to 72 hours".
 * Never a bare "ships today" (Brian, 27 Nov 2026; FTC Mail Order Rule).
 *
 * `hideDuringPause`: for pages that already show <ShipPauseNote/> (cart), so the pause
 * message is not stated twice.
 *
 * Rendered only after mount. The cutoff depends on the current time, so a server render
 * would bake in whatever the clock said at build time and then disagree with the client
 * on hydration — the exact mismatch class that has taken this site down before.
 */
export default function DispatchNotice({ compact = false, style = {}, hideDuringPause = false }) {
  const [status, setStatus] = useState(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const tick = () => { setStatus(dispatchStatus()); setPaused(shipPauseLive()); };
    tick();
    const id = setInterval(tick, 30000); // keep the countdown honest
    return () => clearInterval(id);
  }, []);

  if (!status) return null;
  if (hideDuringPause && paused) return null;

  const urgent = status.todayPickup;
  const text = urgent
    ? null
    : status.plain
      ? `${status.message}.`
      : paused
      ? `Ships ${status.shipsLabel} once payment is confirmed. We're not shipping Tuesday, Nov 24 through Sunday, Nov 29.`
      : shipDaysLive()
      ? `Ships ${status.shipsLabel} — through Oct 31 we ship ${SHIPDAYS_LABEL} only`
      : status.message;

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
            for same-day shipping on most orders; {PROCESSING_CAVEAT}.
          </>
        ) : (
          text
        )}
      </span>
    </div>
  );
}
