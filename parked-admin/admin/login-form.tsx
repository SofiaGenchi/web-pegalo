'use client';
import Link from 'next/link';
import { useState, type SubmitEvent } from 'react';
export default function LoginForm({ setup = false }: { setup?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(`/api/admin/${setup ? 'setup' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error);
      window.location.assign('/admin');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'No se pudo ingresar. Intentá nuevamente.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-login">
      <div className="admin-brand">
        pegalo<span>ADMINISTRACIÓN</span>
      </div>
      <form onSubmit={submit}>
        <p className="admin-eyebrow">ACCESO INTERNO</p>
        <h1>{setup ? 'Activar administración' : 'Ingresar al panel'}</h1>
        <p>
          {setup
            ? 'Creá la primera cuenta con la clave de activación entregada a la empresa.'
            : 'Usá tu cuenta autorizada para actualizar la web.'}
        </p>
        {setup && (
          <label>
            Clave de activación
            <input name="token" type="password" required autoComplete="off" />
          </label>
        )}
        <label>
          Usuario
          <input
            name="username"
            required
            autoComplete="username"
            maxLength={120}
            pattern={setup ? '[a-zA-Z0-9@._-]{3,120}' : undefined}
            autoCapitalize="none"
            spellCheck={false}
          />
        </label>
        <label>
          Contraseña
          <input
            name="password"
            type="password"
            required
            autoComplete={setup ? 'new-password' : 'current-password'}
            minLength={setup ? 15 : undefined}
            maxLength={256}
          />
        </label>
        {setup && (
          <small>Al menos 15 caracteres. Usá una contraseña única.</small>
        )}
        <button className="admin-primary" disabled={busy}>
          {busy
            ? 'Procesando…'
            : setup
              ? 'Crear cuenta autorizada'
              : 'Ingresar'}
        </button>
        <output aria-live="polite">{message}</output>
        <Link href="/">Volver a la web</Link>
      </form>
    </div>
  );
}
