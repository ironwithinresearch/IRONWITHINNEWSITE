// Public policy page: indexable even though the rest of the store is noindex (root layout).
export const metadata = {
  title: 'Shipping Information',
  alternates: { canonical: '/shipping' },
  robots: { index: true, follow: true },
};

export default function Layout({ children }) {
  return children;
}
