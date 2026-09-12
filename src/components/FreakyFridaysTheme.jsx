'use client';
import { useEffect, useState } from 'react';
import { ffSeason, ffLive } from '@/lib/freakyFridays';

/* Freaky Fridays — site-wide Halloween re-skin, orange on black.
   Same mechanism as QueenTheme: inject a <style> tag that rewrites the ACCENT TOKENS every
   other component already reads. There are ~2,000 var(--…) references across the app and they
   all resolve through the six variables below, so a whole-site recolour is this one file.
   Nothing else is edited and nothing needs undoing — the component returns null outside the
   season and the site is blue again.

   TWO INTENSITIES:
     season  (11 Sep – 2 Nov)  orange accents, warm-black surfaces. The site wears the costume
                               all season so the campaign reads as a season, not a one-off.
     live    (Fri 8:30 – Mon)  adds the deeper blood-red gradient and a stronger glow, so a
                               live window is visibly hotter than a quiet Tuesday.

   Specificity note: Navbar.jsx injects its own [data-theme="light"] block AFTER this one in
   document order, so a bare :root selector would lose to it in light mode. We qualify with
   html:root, which outranks it, and repeat the accent tokens inside the light selector so the
   costume survives a theme toggle. */

/* --purple and --pink are the OLD names for the two far stops of the brand gradient. Several
   components compose their own gradients from them (SiteGate's CTA is
   linear-gradient(135deg, var(--primary-blue), var(--purple), var(--pink))), so leaving
   --purple an actual purple puts a violet band through every one of those buttons and the
   costume reads half-changed. They are re-pointed at ember and blood, keeping every
   composed gradient inside the Halloween palette without touching the components. */
const ACCENTS = `
  --primary-blue:   #FF7A18;
  --secondary-blue: #FFB020;
  --purple:         #C2410C;
  --pink:           #B4121B;
`;

const CSS_SEASON = `
  html:root, html:root[data-theme="light"], html:root[data-theme="dark"] {
    ${ACCENTS}
    --gradient-primary: linear-gradient(135deg,#FFB020 0%,#FF7A18 50%,#FF3D00 100%);
    --gradient-blue:    linear-gradient(135deg,#FFB020 0%,#FF7A18 100%);
    --glow-blue: 0 0 22px rgba(255,122,24,0.45);
    --glow-sm:   0 0 10px rgba(255,122,24,0.28);
  }
  /* Surfaces go sooty black for the season — in BOTH themes.

     This deliberately overrides a light-mode preference. The site lands in light by default
     (see the inline theme script in layout.js), so gating the costume to dark would leave most
     visitors on a pale blue page with orange buttons, which reads as a broken palette rather
     than a Halloween theme. A season costume that only works if you already chose dark is not
     a site-wide theme. Text tokens are re-stated below so light-mode type stays legible on the
     dark ground rather than inheriting near-black on near-black. */
  html:root, html:root[data-theme="light"], html:root[data-theme="dark"] {
    --bg-dark:       #0A0603;
    --bg-deeper:     #050302;
    --overlay:       rgba(6,3,1,0.86);
    --bg-elevated:   #140C06;
    --card-dark:     #12100D;
    --card-elevated: #1B1410;
    --text-light:     #F6EDE2;
    --text-secondary: #CDBCA8;
    --text-muted:     #9C8A78;
    --glass-bg:      rgba(20,12,6,0.72);
    --glass-border:  rgba(255,176,32,0.16);
  }
  /* Navbar injects its own [data-theme="light"] header rule with !important and mounts after
     us, so it has to be beaten explicitly rather than by token substitution alone. */
  html:root[data-theme="light"] body   { background: #0A0603; color: #F6EDE2; }
  html:root[data-theme="light"] header { background: rgba(10,6,3,0.92) !important; }
`;

const CSS_LIVE = `
  html:root, html:root[data-theme="light"], html:root[data-theme="dark"] {
    --gradient-primary: linear-gradient(135deg,#FFB020 0%,#FF6A00 45%,#B4121B 100%);
    --glow-blue: 0 0 28px rgba(255,106,0,0.6);
    --glow-sm:   0 0 12px rgba(255,106,0,0.38);
  }
`;

export default function FreakyFridaysTheme() {
  /* Both flags resolve in an effect, never during render. These pages are statically
     generated, so deciding on the server would bake one moment's answer into the HTML and
     mismatch on hydration — the #418/#423 class of bug this codebase has hit before. */
  const [state, setState] = useState({ season: false, live: false });

  useEffect(() => {
    const tick = () => setState({ season: ffSeason(), live: ffLive() });
    tick();
    // Re-check each minute so the costume heats up at 8:30 without a reload.
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  if (!state.season) return null;
  return (
    <style
      dangerouslySetInnerHTML={{ __html: state.live ? CSS_SEASON + CSS_LIVE : CSS_SEASON }}
    />
  );
}
