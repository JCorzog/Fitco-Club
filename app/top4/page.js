'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import {
  Compass,
  BookOpen,
  Trophy,
  User,
  Plus,
  X,
  MapPin,
} from 'lucide-react';

function getFallbackImage(name = '', disciplines = [], classes = []) {
  const text = [name, ...(disciplines || []), ...(classes || [])]
    .join(' ')
    .toLowerCase();
  if (text.includes('pilates') || text.includes('barre')) {
    return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('yoga')) {
    return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('box')) {
    return 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('cycling') || text.includes('spin')) {
    return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80';
  }
  if (text.includes('hiit') || text.includes('fuerza') || text.includes('hyrox')) {
    return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80';
}

export default function Top4Page() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTop4() {
    const saved = JSON.parse(localStorage.getItem('fitco_top4') || '[]');
    if (saved.length === 0) {
      setStudios([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('studios')
      .select('*')
      .in('id', saved);

    if (data) {
      // Mantener el orden en que los eligió el usuario
      const ordered = saved
        .map((id) => data.find((s) => s.id === id))
        .filter(Boolean);
      setStudios(ordered);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTop4();
  }, []);

  function removeFromTop4(id) {
    const saved = JSON.parse(localStorage.getItem('fitco_top4') || '[]');
    const updated = saved.filter((item) => item !== id);
    localStorage.setItem('fitco_top4', JSON.stringify(updated));
    setStudios((prev) => prev.filter((s) => s.id !== id));
  }

  const slots = [0, 1, 2, 3];

  return (
    <main className="max-w-md mx-auto min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <header className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-navy/50 mb-1">
          Curated Favorites
        </p>
        <h1
          className="text-3xl font-semibold text-navy leading-none"
          style={{ fontFamily: 'var(--font-serif), serif' }}
        >
          Tu Top 4
        </h1>
        <p className="text-xs text-navy/60 mt-2">
          Tus 4 estudios favoritos de CDMX, siempre a la mano.
        </p>
      </header>

      {/* Grid 2x2 estilo Letterboxd */}
      {loading ? (
        <p className="text-center text-sm text-navy/50 py-12">Cargando favoritos...</p>
      ) : (
        <div className="grid grid-cols-2 gap-3.5">
          {slots.map((idx) => {
            const studio = studios[idx];
            if (!studio) {
              return (
                <Link
                  key={idx}
                  href="/"
                  className="aspect-[3/4] rounded-2xl border-2 border-dashed border-navy/15 bg-white/60 flex flex-col items-center justify-center p-4 text-center hover:border-navy/35 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-navy/5 flex items-center justify-center text-navy/50 mb-2">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-navy/70">
                    Lugar #{idx + 1}
                  </span>
                  <span className="text-[11px] text-navy/45 mt-0.5">
                    Elegir estudio
                  </span>
                </Link>
              );
            }

            return (
              <div
                key={studio.id}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-navy shadow-sm group"
              >
                <Link href={`/studio/${studio.slug}`} className="block w-full h-full">
                  <img
                    src={
                      studio.image_url ||
                      getFallbackImage(studio.name, studio.disciplines, studio.classes)
                    }
                    alt={studio.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />

                  <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-cream/95 text-navy text-xs font-bold flex items-center justify-center shadow-sm">
                    {idx + 1}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-cream">
                    <h2 className="font-semibold text-sm leading-snug line-clamp-2">
                      {studio.name}
                    </h2>
                    <p className="text-[10px] text-cream/75 flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-2.5 h-2.5 shrink-0" /> {studio.zone}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => removeFromTop4(studio.id)}
                  className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-navy/75 text-cream flex items-center justify-center hover:bg-coral transition"
                  title="Quitar del Top 4"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
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
          <Link href="/top4" className="flex flex-col items-center gap-1 text-navy">
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
