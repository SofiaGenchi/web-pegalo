import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Pegalo | Adhesivos y selladores',
  description:
    'Adhesivos y selladores para construcción, industria y profesionales. Conocé las líneas Pegalo, Artesanato e Instalador y consultá por venta mayorista.',
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
