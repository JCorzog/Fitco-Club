'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import {
  Compass,
  BookOpen,
  Trophy,
  User,
  CreditCard,
  MapPin,
  Check,
  ChevronRight,
  Shield,
  LogOut,
  Mail,
  Lock,
} from 'lucide-react';

const MEMBERSHIPS = ['Wellhub', 'TotalPass', 'Fitpass', 'Directo / Varias'];
const ZONES = [
  'Polanco',
  'Roma / Condesa',
  'Santa Fe',
  'Pedregal / Sur',
  'Del Valle / Nápoles',
  'Interlomas / Bosques',
  'Lomas / Reforma',
  'Otra zona',
];

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado de Auth (Login / Registro)
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  // Estado del Perfil
  const [name, setName] = useState('');
  const [membership, setMembership] = useState('Wellhub');
  const [homeZone, setHomeZone] = useState('Polanco');
  const [role, setRole] = useState('user');
  const [passportCount, setPassportCount] = useState(0);
  const [top4Count, setTop4Count] = useState(0);
  const [saved, setSaved] = useState(false);

  async function loadUserAndProfile() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    const passport = JSON.parse(localStorage.getItem('fitco_passport') || '[]');
    const top4 = JSON.parse(localStorage.getItem('fitco_top4') || '[]');
    setPassportCount(passport.length);
    setTop4Count(top4.length);

    if (session?.user) {
      setUser(session.user);
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setName(profile.name || '');
        setMembership(profile.membership || 'Wellhub');
        setHomeZone(profile.home_zone || 'Polanco');
        setRole(profile.role || 'user');
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadUserAndProfile();
  }, []);

  async function handleAuth(e) {
    e.preventDefault();
    setAuthError('');
    setResetMessage('');
    setAuthLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: authName.trim() || 'Miembro Fitco' },
        },
      });
      if (error) {
        setAuthError(error.message);
      } else {
        await loadUserAndProfile();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setAuthError('Correo o contraseña incorrectos.');
      } else {
        await loadUserAndProfile();
      }
    }
    setAuthLoading(false);
  }

  async function handleForgotPassword() {
    setAuthError('');
    setResetMessage('');

    if (!email.trim()) {
      setAuthError('Escribe tu correo electrónico arriba para enviarte el enlace.');
      return;
    }

    setAuthLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setAuthLoading(false);

    if (error) {
      setAuthError('No pudimos enviar el correo. Intenta de nuevo en unos minutos.');
    } else {
      setResetMessage('¡Listo! Revisa tu correo (o spam) para restablecer tu contraseña.');
    }
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: name.trim() || 'Miembro Fitco',
        membership,
        home_zone: homeZone,
      })
      .eq('id', user.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setRole('user');
  }

  const initials = name.trim()
    ? name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'FC';

  return (
    <main className="max-w-md mx-auto min-h-screen px-4 pt-6 pb-24">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-navy/50 mb-1">
            Member Card
          </p>
          <h1
            className="text-3xl font-semibold text-navy leading-none"
            style={{ fontFamily: 'var(--font-serif), serif' }}
          >
            Tu Perfil
          </h1>
        </div>

        {user && (
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs font-medium text-navy/55 hover:text-coral transition pb-1"
          >
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        )}
      </header>

      {loading ? (
        <p className="text-center text-sm text-navy/50 py-16">Cargando perfil...</p>
      ) : !user ? (
        /* Pantalla de Login / Registro */
        <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
          <div className="flex rounded-xl bg-cream p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setAuthError('');
                setResetMessage('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                !isSignUp ? 'bg-navy text-cream shadow-sm' : 'text-navy/60'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setAuthError('');
                setResetMessage('');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                isSignUp ? 'bg-navy text-cream shadow-sm' : 'text-navy/60'
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy/55 mb-1">
                  Nombre o apodo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Alex"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream/60 border border-navy/10 text-sm text-navy focus:outline-none focus:border-navy"
                />
              </div>
            )}

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-navy/55 mb-1">
                <Mail className="w-3.5 h-3.5" /> Correo electrónico
              </label>
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream/60 border border-navy/10 text-sm text-navy focus:outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-navy/55 mb-1">
                <Lock className="w-3.5 h-3.5" /> Contraseña
              </label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream/60 border border-navy/10 text-sm text-navy focus:outline-none focus:border-navy"
              />
            </div>

            {authError && (
              <p className="text-xs text-coral bg-coral/10 px-3 py-2 rounded-xl">
                {authError}
              </p>
            )}

            {resetMessage && (
              <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-xl">
                {resetMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-navy text-cream text-xs font-semibold disabled:opacity-50 mt-2"
            >
              {authLoading
                ? 'Procesando...'
                : isSignUp
                ? 'Unirme a Fitco Club'
                : 'Entrar'}
            </button>

            {!isSignUp && (
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={authLoading}
                className="w-full text-center text-xs font-medium text-navy/60 hover:text-navy transition pt-1"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
          </form>
        </div>
      ) : (
        /* Perfil del Usuario Logueado */
        <>
          {/* Acceso Exclusivo Panel Maestro (Solo visible para Admins) */}
          {role === 'admin' && (
            <Link
              href="/admin"
              className="mb-5 flex items-center justify-between p-4 rounded-2xl bg-coral text-white shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">
                    Panel Maestro (Admin)
                  </p>
                  <p className="text-[11px] text-white/85">
                    Estadísticas, usuarios y moderación
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Link>
          )}

          {/* Tarjeta de Miembro */}
          <div className="bg-navy text-cream rounded-2xl p-5 mb-5 shadow-sm">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-full bg-cream/15 border border-cream/20 flex items-center justify-center text-sm font-semibold tracking-wider">
                {initials}
              </div>
              <div className="min-w-0">
                <h2
                  className="text-xl font-semibold leading-tight truncate"
                  style={{ fontFamily: 'var(--font-serif), serif' }}
                >
                  {name.trim() || 'Miembro Fitco Club'}
                </h2>
                <p className="text-[11px] text-cream/65 mt-0.5 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-cream/10">
              <Link
                href="/passport"
                className="bg-cream/10 rounded-xl p-3 hover:bg-cream/15 transition"
              >
                <p className="text-[10px] uppercase tracking-[0.15em] text-cream/60">
                  Passport
                </p>
                <p className="text-xl font-bold mt-0.5">
                  {passportCount}{' '}
                  <span className="text-xs font-normal text-cream/55">/ 208</span>
                </p>
              </Link>

              <Link
                href="/top4"
                className="bg-cream/10 rounded-xl p-3 hover:bg-cream/15 transition"
              >
                <p className="text-[10px] uppercase tracking-[0.15em] text-cream/60">
                  Top 4
                </p>
                <p className="text-xl font-bold mt-0.5">
                  {top4Count}{' '}
                  <span className="text-xs font-normal text-cream/55">/ 4</span>
                </p>
              </Link>
            </div>
          </div>

          {/* Preferencias */}
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm space-y-4 mb-5"
          >
            <h3
              className="text-xl font-semibold text-navy"
              style={{ fontFamily: 'var(--font-serif), serif' }}
            >
              Tus preferencias
            </h3>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-navy/55 mb-1.5">
                Nombre o apodo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream/60 border border-navy/10 text-sm text-navy focus:outline-none focus:border-navy"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-navy/55 mb-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Membresía principal
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MEMBERSHIPS.map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMembership(m)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium transition border ${
                      membership === m
                        ? 'bg-navy text-cream border-navy'
                        : 'bg-white text-navy/75 border-navy/10'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-navy/55 mb-1.5">
                <MapPin className="w-3.5 h-3.5" /> Zona principal en CDMX
              </label>
              <select
                value={homeZone}
                onChange={(e) => setHomeZone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cream/60 border border-navy/10 text-sm text-navy focus:outline-none focus:border-navy"
              >
                {ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
                saved ? 'bg-coral text-white' : 'bg-navy text-cream'
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" /> Cambios guardados
                </>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </form>
        </>
      )}

      {/* Barra de Navegación Móvil */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-navy/10">
        <div className="max-w-md mx-auto flex justify-around py-3 text-[11px] font-medium text-navy/50">
          <Link href="/" className="flex flex-col items-center gap-1">
            <Compass className="w-5 h-5" />
            Explorar
          </Link>
          <Link href="/passport" className="flex flex-col items-center gap-1">
            <BookOpen className="w-5 h-5" />
            Passport
          </Link>
          <Link href="/top4" className="flex flex-col items-center gap-1">
            <Trophy className="w-5 h-5" />
            Top 4
          </Link>
          <Link href="/perfil" className="flex flex-col items-center gap-1 text-navy">
            <User className="w-5 h-5" />
            Perfil
          </Link>
        </div>
      </nav>
    </main>
  );
}
