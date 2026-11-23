'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import {
  Compass,
  BookOpen,
  Trophy,
  User,
  MapPin,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export default function PassportPage() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPassport() {
    const saved = JSON.parse(localStorage.getItem('fitco_passport') || '[]');
    if (saved.length === 0) {
      setStudios([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('studios')
      .select('id, name, slug, zone, disciplines')
      .in('id', saved);

    if (data) setStudios(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPassport();
  }, []);

  function removeStamp(id) {
    const saved = JSON.parse(localStorage.getItem('fitco_passport') || '[]');
    const updated = saved.filter((item) => item !== id);
    localStorage.setItem('fitco_passport', JSON.stringify(updated));
    setStudios((prev) => prev.filter((s) => s.id !== id));
  }

  const progress = Math.min(100, Math.round((studios.length / 208) * 100));

  return (
    <main className="max-w-md mx-auto min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <header className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-navy/50 mb-1">
          CDMX Fitness Log
        </p>
        <h1
          className="text-3xl font-semibold text-navy leading-none"
          style={{ fontFamily: 'var(--font-serif), serif' }}
        >
          Tu Passport
        </h1>
      </header>

      {/* Tarjeta de Progreso */}
      <div className="bg-navy text-cream rounded-2xl p-5 mb-6 shadow-sm">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.15em] text-cream/60">
              Estudios sellados
            </p>
            <p className="text-3xl font-bold mt-0.5">
              {studios.length}{' '}
              <span className="text-sm font-normal text-cream/60">/ 208</span>
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cream/15">
            {progress}% CDMX
          </span>
        </div>
        <div className="w-full h-2 bg-cream/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-coral rounded-full transition-all"
            style={{ width: `${Math.max(progress, studios.length > 0 ? 4 : 0)}%` }}
          />
        </div>
      </div>

      {/* Lista de Sellos */}
      {loading ? (
        <p className="text-center text-sm text-navy/50 py-12">Cargando sellos...</p>
      ) : studios.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-navy/5 shadow-sm">
          <BookOpen className="w-8 h-8 text-navy/25 mx-auto mb-3" />
          <p className="text-sm font-medium text-navy mb-1">
            Aún no tienes sellos en tu Passport
          </p>
          <p className="text-xs text-navy/60 mb-5">
            Entra a cualquier estudio que ya hayas visitado y toca &quot;Sellar Passport&quot;.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 rounded-full bg-navy text-cream text-xs font-semibold"
          >
            Explorar estudios
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {studios.map((studio) => (
            <div
              key={studio.id}
              className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex items-center justify-between gap-3"
            >
              <Link href={`/studio/${studio.slug}`} className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-coral text-[11px] font-semibold mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Visitado
                </div>
                <h2 className="font-semibold text-sm text-navy truncate">
                  {studio.name}
                </h2>
                <p className="text-xs text-navy/55 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" /> {studio.zone}
                </p>
              </Link>
              <button
                onClick={() => removeStamp(studio.id)}
                className="p-2 rounded-full text-navy/35 hover:text-coral hover:bg-coral/10 transition"
                title="Quitar sello"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Barra de Navegación Móvil */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-navy/10">
        <div className="max-w-md mx-auto flex justify-around py-3 text-[11px] font-medium text-navy/50">
          <Link href="/" className="flex flex-col items-center gap-1">
            <Compass className="w-5 h-5" />
            Explorar
          </Link>
          <Link href="/passport" className="flex flex-col items-center gap-1 text-navy">
            <BookOpen className="w-5 h-5" />
            Passport
          </Link>
          <Link href="/top4" className="flex flex-col items-center gap-1">
            <Trophy className="w-5 h-5" />
            Top 4
          </Link>
          <button className="flex flex-col items-center gap-1 opacity-50">
            <User className="w-5 h-5" />
            Perfil
          </button>
        </div>
      </nav>
    </main>
  );
}
