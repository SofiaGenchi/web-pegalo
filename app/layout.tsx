import type { Metadata } from 'next';
import { Suspense } from 'react';
import Loading, { SessionReady } from './route-loading';
import './globals.css';
import { siteOrigin } from './seo';
export const metadata: Metadata = {
  title: 'Adhesivos y selladores en Argentina | Pegalo',
  ...(siteOrigin ? { metadataBase: new URL(siteOrigin) } : {}),
  robots:
    process.env.PEGALO_NOINDEX === '1'
      ? { index: false, follow: true }
      : undefined,
  icons: {
    icon: [{ url: '/favicon-artesanato-transparent.png', type: 'image/png' }],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  description:
    'Somos fabricantes e importadores de una alta gama de productos  orientados a mercados como el  Automotor, Construcción, Hogar,  Artesanía, Zapatero o Carpintería.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <body>
        <Suspense fallback={<Loading />}>
          {children}
          <SessionReady />
        </Suspense>
      </body>
    </html>
  );
}
