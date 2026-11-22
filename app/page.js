'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, MapPin, Star, Compass, BookOpen, Trophy, User } from 'lucide-react';

export default function Home() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('Todas');
  const [passFilter, setPassFilter] = useState('Todos');

  useEffect(() => {
    async function fetchStudios() {
      const { data, error } = await supabase
        .from('studios')
        .select('*')
        .order('avg_rating', { ascending: false });

      if (!error && data) setStudios(data);
      setLoading(false);
    }
    fetchStudios();
  }, []);

  const zones = ['Todas', ...new Set(studios.map((s) => s.zone).filter(Boolean))];

  const filtered = studios.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.disciplines || []).some((d) => d.toLowerCase().includes(search.toLowerCase()));
    const matchZone = zone === 'Todas' || s.zone === zone;
    const matchPass =
      passFilter === 'Todos' ||
      (passFilter === 'Wellhub' && s.wellhub_tier && s.wellhub_tier !== 'No') ||
      (passFilter === 'TotalPass' && s.totalpass_tier && s.totalpass_tier !== 'No') ||
      (passFilter === 'Fitpass' && s.fitpass_accepted);

    return matchSearch && matchZone && matchPass;
  });

  return (
    <main className="max-w-md mx-auto min-h-screen px-4 pt-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">FITCO CLUB</h1>
          <p className="text-xs uppercase tracking-widest text-navy/60">CDMX Boutique Guide</p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-navy text-cream">
          Beta
        </span>
      </header>

      {/* Buscador */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-navy/40" />
        <input
          type="text"
          placeholder="Buscar estudio o disciplina (HIIT, Cycling...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-navy/10 text-sm focus:outline-none focus:border-navy"
        />
      </div>

      {/* Filtros de Membresía */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
        {['Todos', 'Wellhub', 'TotalPass', 'Fitpass'].map((p) => (
          <button
            key={p}
            onClick={() => setPassFilter(p)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              passFilter === p
                ? 'bg-navy text-cream'
                : 'bg-white text-navy/70 border border-navy/10'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Filtro de Zona */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
        {zones.map((z) => (
          <button
            key={z}
            onClick={() => setZone(z)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition ${
              zone === z
                ? 'bg-coral text-white font-medium'
                : 'bg-sky/20 text-navy/80'
            }`}
          >
            {z}
          </button>
        ))}
      </div>

      {/* Lista de Estudios */}
      {loading ? (
        <p className="text-center text-sm text-navy/50 py-12">Cargando estudios...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-navy/50 py-12">No hay estudios con estos filtros.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((studio) => (
            <div
              key={studio.id}
              className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-semibold text-base text-navy">{studio.name}</h2>
                  <p className="text-xs text-navy/60 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {studio.zone}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-cream px-2.5 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-coral text-coral" />
                  <span className="text-xs font-bold">{studio.avg_rating || 'New'}</span>
                </div>
              </div>

              {/* Disciplinas */}
              <div className="flex flex-wrap gap-1.5 my-3">
                {(studio.disciplines || []).map((d) => (
                  <span
                    key={d}
                    className="text-[11px] px-2.5 py-0.5 rounded-md bg-cream text-navy/80 font-medium"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Badges de Membresías */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-navy/5 text-[11px]">
                {studio.wellhub_tier && studio.wellhub_tier !== 'No' && (
                  <span className="px-2 py-0.5 rounded bg-navy/5 text-navy font-medium">
                    Wellhub: {studio.wellhub_tier}
                  </span>
                )}
                {studio.totalpass_tier && studio.totalpass_tier !== 'No' && (
                  <span className="px-2 py-0.5 rounded bg-sky/30 text-navy font-medium">
                    TotalPass: {studio.totalpass_tier}
                  </span>
                )}
                {studio.fitpass_accepted && (
                  <span className="px-2 py-0.5 rounded bg-coral/15 text-coral font-medium">
                    Fitpass ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Barra de Navegación Móvil */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-navy/10">
        <div className="max-w-md mx-auto flex justify-around py-3 text-[11px] font-medium text-navy/50">
          <button className="flex flex-col items-center gap-1 text-navy">
            <Compass className="w-5 h-5" />
            Explorar
          </button>
          <button className="flex flex-col items-center gap-1">
            <BookOpen className="w-5 h-5" />
            Passport
          </button>
          <button className="flex flex-col items-center gap-1">
            <Trophy className="w-5 h-5" />
            Top 4
          </button>
          <button className="flex flex-col items-center gap-1">
            <User className="w-5 h-5" />
            Perfil
          </button>
        </div>
      </nav>
    </main>
  );
}
