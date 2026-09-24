import LoginForm from '../login-form';
import { adminEnabled } from '#pegalo-runtime';
import { redirect } from 'next/navigation';
import '../admin.css';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Activar administración | Pegalo',
  robots: { index: false, follow: false },
};
export default function SetupPage() {
  if (!adminEnabled) redirect('/admin');
  return <LoginForm setup />;
}
