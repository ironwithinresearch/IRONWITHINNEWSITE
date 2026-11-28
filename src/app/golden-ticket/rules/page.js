/* Golden Ticket — Official Rules (25 Days of Christmas, Dec 1-25 2026). Static, public (/golden-ticket is in
 * PUBLIC_PREFIXES in src/lib/gate.js) and server-rendered, so the rules are readable without an account.
 * The text is GENERATED from ~/iw-xmas-2026/copy/rules.md (rulesHtml.js, via tools/rules_to_js.py): edit the
 * markdown, regenerate, rebuild. iw-xmas.php implements these rules; change both together. Server component only
 * (no client hydration of the HTML string). */
import Link from 'next/link';
import { RULES_HTML } from './rulesHtml';

export const metadata = {
  title: 'Golden Ticket Official Rules | Iron Within Research',
  description: 'Official Rules for the Iron Within Golden Ticket Sweepstakes, December 1–25, 2026. No purchase necessary. 25 prizes, one drawn each day. Open to US residents 21+.',
  alternates: { canonical: 'https://www.ironwithin.io/golden-ticket/rules' },
};

const css = `
.gt-rules{font-size:0.9rem;line-height:1.75;color:var(--text-secondary)}
.gt-rules h2{color:var(--text-light);font-size:1rem;font-weight:700;margin:22px 0 6px}
.gt-rules p{margin:0 0 12px}
.gt-rules strong{color:var(--text-light)}
.gt-rules a{color:var(--primary-blue)}
.gt-rules hr{border:0;border-top:1px solid var(--glass-border);margin:20px 0}
.gt-rules table{width:100%;border-collapse:collapse;margin:6px 0 14px;font-size:0.88rem}
.gt-rules th,.gt-rules td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--glass-border)}
.gt-rules th{color:var(--text-light);font-weight:700}
`;

export default function GoldenTicketRules() {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '36px 16px 90px' }}>
      <p style={{ background: 'rgba(0,207,255,0.07)', border: '1px solid rgba(0,207,255,0.35)', borderRadius: 12, padding: '13px 16px', margin: '0 0 22px', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-light)' }}>
        <strong>NO PURCHASE NECESSARY TO ENTER OR WIN.</strong> A purchase will not improve your chance of winning. Void where prohibited.
        Open to legal residents of the 50 United States and D.C. who are 21 or older.{' '}
        <Link href="/golden-ticket#enter" style={{ color: 'var(--primary-blue)' }}>Enter free</Link>.
      </p>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,5vw,2.3rem)', fontWeight: 800, color: 'var(--text-light)', margin: '0 0 14px', lineHeight: 1.1 }}>
        Golden Ticket Sweepstakes: Official Rules
      </h1>
      <div style={{ background: 'var(--card-dark)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: '22px 20px' }}>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="gt-rules" dangerouslySetInnerHTML={{ __html: RULES_HTML }} />
      </div>
      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 18 }}>
        <Link href="/golden-ticket" style={{ color: 'var(--primary-blue)' }}>Back to Golden Tickets</Link> ·{' '}
        <Link href="/terms" style={{ color: 'var(--primary-blue)' }}>Terms</Link> ·{' '}
        <Link href="/privacy" style={{ color: 'var(--primary-blue)' }}>Privacy Policy</Link>
      </p>
    </div>
  );
}
