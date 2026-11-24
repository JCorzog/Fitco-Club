'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError('El enlace expiró o no es válido. Solicita uno nuevo.');
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/perfil'), 2500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleUpdatePassword}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h1 className="text-xl font-bold">Nueva contraseña</h1>

        {success ? (
          <p className="text-green-600 text-sm">
            ¡Contraseña actualizada! Redirigiendo a tu perfil...
          </p>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Contraseña nueva (mín. 8 caracteres)
              </label>
              <input
                type="password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
