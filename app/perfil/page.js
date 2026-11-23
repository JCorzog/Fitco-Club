'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  BookOpen,
  Trophy,
  User,
  CreditCard,
  MapPin,
  Check,
  ChevronRight,
  Sparkles,
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
  const [name, setName] = useState('');
  const [membership, setMembership] = useState('Wellhub');
  const [homeZone, setHomeZone] = useState('Polanco');
  const [passportCount, setPassportCount] = useState(0);
  const [top4Count, setTop4Count] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('fitco_profile') || '{}');
    if (profile.name) setName(profile.name);
    if (profile.membership) setMembership(profile.membership);
    if (profile.homeZone) setHomeZone(profile.homeZone);

    const passport = JSON.parse(localStorage.getItem('fitco_passport') || '[]');
    const top4 = JSON.parse(localStorage.getItem('fitco_top4') || '[]');
    setPassportCount(passport.length);
    setTop4Count(top4.length);
  }, []);

  function handleSave(e) {
    e.preventDefault();
    localStorage.setItem(
      'fitco_profile',
      JSON.stringify({
        name: name.trim(),
        membership,
        homeZone,
      })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
      {/* Header */}
      <header className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-navy/50 mb-1">
          Member Card
        </p>
        <h1
          className="text-3xl font-semibold text-navy leading-none"
          style={{ fontFamily: 'var(--font-serif), serif' }}
        >
          Tu Perfil
        </h1>
      </header>

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
            <p className="text-[11px] text-cream/65 mt-0.5 flex items-center gap-1.5">
              <span>{membership}</span>
              <span>·</span>
              <span>{homeZone}</span>
            </p>
          </div>
        </div>

        {/* Resumen rápido */}
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

      {/* Preferencias del Miembro */}
      <form
        onSubmit={handleSave}
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
            placeholder="Ej. Alex"
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
              <Check className="w-4 h-4" /> Perfil guardado
            </>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </form>

      {/* Accesos rápidos */}
      <div className="bg-white rounded-2xl border border-navy/5 shadow-sm divide-y divide-navy/5 mb-5">
        <Link
          href="/passport"
          className="flex items-center justify-between p-4 text-xs font-medium text-navy"
        >
          <span className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-coral" />
            Ver mis estudios sellados
          </span>
          <ChevronRight className="w-4 h-4 text-navy/35" />
        </Link>
        <Link
          href="/top4"
          className="flex items-center justify-between p-4 text-xs font-medium text-navy"
        >
          <span className="flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-coral" />
            Editar mi Top 4
          </span>
          <ChevronRight className="w-4 h-4 text-navy/35" />
        </Link>
      </div>

      {/* Nota de sincronización */}
      <div className="bg-cream/80 border border-navy/10 rounded-2xl p-4 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-coral shrink-0 mt-0.5" />
        <p className="text-[11px] text-navy/65 leading-relaxed">
          Tu Passport, Top 4 y preferencias se guardan automáticamente en este dispositivo. Muy pronto podrás iniciar sesión para sincronizarlos en la nube.
        </p>
      </div>

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
