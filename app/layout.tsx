import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Pegalo | Adhesivos y selladores',
  icons: {
    icon: [{ url: '/favicon-artesanato-transparent.png', type: 'image/png' }],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  description:
    'Pegalo: importación y comercialización mayorista de adhesivos y selladores en Argentina. Conocé Pegalo y Artesanato y encontrá la solución para tu proyecto.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
