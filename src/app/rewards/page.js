import { redirect } from 'next/navigation';

// The IWR Rewards program was retired on 2026-10-17. Old links land on the account page.
export default function Rewards() {
  redirect('/account');
}
