// Public policy page: indexable even though the rest of the store is noindex (root layout).
export const metadata = {
  title: 'Refund Policy',
  alternates: { canonical: '/refund' },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) {
  return children;
}
