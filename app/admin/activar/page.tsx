import LoginForm from '../login-form';
import '../admin.css';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Activar administración | Pegalo',
  robots: { index: false, follow: false },
};
export default function SetupPage() {
  return <LoginForm setup />;
}
