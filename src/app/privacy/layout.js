// Public policy page: indexable even though the rest of the store is noindex (root layout).
export const metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: '/privacy' },
  robots: { index: false, follow: false },
};

export default function Layout({ children }) {
  return children;
}
