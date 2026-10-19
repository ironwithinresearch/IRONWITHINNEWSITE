// Public policy page: indexable even though the rest of the store is noindex (root layout).
export const metadata = {
  title: 'Terms & Conditions',
  alternates: { canonical: '/terms' },
  robots: { index: false, follow: false },
};

export default function Layout({ children }) {
  return children;
}
