'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import {
  Search,
  MapPin,
  Star,
  Compass,
  BookOpen,
  Trophy,
  User,
  SlidersHorizontal,
  X,
  Flame,
  PawPrint,
} from 'lucide-react';

const TIERS_BY_APP = {
  Wellhub: ['Gold', 'Gold+', 'Platinum', 'Diamond'],
  TotalPass: ['TP2', 'TP3', 'TP4'],
  Fitpass: ['Classic', 'Pro'],
};

const QUICK_DISCIPLINES = [
  'Pilates',
  'HIIT',
  'Barre',
  'Cycling',
  'Fuerza',
  'Box',
  'Yoga',
  'Hyrox',
];

const QUICK_AMENITIES = [
  'Regaderas',
  'Estacionamiento',
  'Valet Parking',
  'Toallas',
  'Lockers',
  'Sala Infrarroja',
];

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

export default function Home() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Filtros principales
  const [zone, setZone] = useState('Todas');
  const [appFilter, setAppFilter] = useState('Todas'); // Todas | Wellhub | TotalPass | Fitpass | Ninguna
  const [tierFilter, setTierFilter] = useState('Todos');

  // Filtros avanzados (modal 3 rayas)
  const [showFilters, setShowFilters] = useState(false);
  const [minIntensity, setMinIntensity] = useState(0);
  const [selectedDiscipline, setSelectedDiscipline] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);

  useEffect(() => {
    async function fetchStudios() {
      const { data } = await supabase
        .from('studios')
        .select('*')
        .order('avg_rating', { ascending: false });

      if (data) setStudios(data);
      setLoading(false);
    }
    fetchStudios();
  }, []);

  const zones = [...new Set(studios.map((s) => s.zone).filter(Boolean))].sort();

  const handleAppChange = (val) => {
    setAppFilter(val);
    setTierFilter('Todos');
  };

  const toggleAmenity = (item) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const resetAll = () => {
    setSearch('');
    setZone('Todas');
    setAppFilter('Todas');
    setTierFilter('Todos');
    setMinIntensity(0);
    setSelectedDiscipline('');
    setSelectedAmenities([]);
    setPetFriendlyOnly(false);
  };

  const advancedCount =
    (minIntensity > 0 ? 1 : 0) +
    (selectedDiscipline ? 1 : 0) +
    selectedAmenities.length +
    (petFriendlyOnly ? 1 : 0);

  const hasAnyFilter =
    zone !== 'Todas' ||
    appFilter !== 'Todas' ||
    tierFilter !== 'Todos' ||
    advancedCount > 0 ||
    search.trim() !== '';

  const filtered = studios.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      (s.disciplines || []).some((d) => d.toLowerCase().includes(q)) ||
      (s.classes || []).some((c) => c.toLowerCase().includes(q));

    const matchZone = zone === 'Todas' || s.zone === zone;

    let matchApp = true;
    if (appFilter === 'Wellhub') {
      matchApp = s.wellhub_tier && s.wellhub_tier !== 'No';
      if (matchApp && tierFilter !== 'Todos') matchApp = s.wellhub_tier === tierFilter;
    } else if (appFilter === 'TotalPass') {
      matchApp = s.totalpass_tier && s.totalpass_tier !== 'No';
      if (matchApp && tierFilter !== 'Todos') matchApp = s.totalpass_tier === tierFilter;
    } else if (appFilter === 'Fitpass') {
      matchApp = Boolean(s.fitpass_accepted);
      if (matchApp && tierFilter !== 'Todos') matchApp = s.fitpass_tier === tierFilter;
    } else if (appFilter === 'Ninguna') {
      matchApp =
        (!s.wellhub_tier || s.wellhub_tier === 'No') &&
        (!s.totalpass_tier || s.totalpass_tier === 'No') &&
        !s.fitpass_accepted;
    }

    const matchIntensity =
      minIntensity === 0 || (s.intensity_level || 0) >= minIntensity;

    const matchDiscipline =
      !selectedDiscipline ||
      (s.disciplines || []).some((d) =>
        d.toLowerCase().includes(selectedDiscipline.toLowerCase())
      ) ||
      (s.classes || []).some((c) =>
        c.toLowerCase().includes(selectedDiscipline.toLowerCase())
      );

    const matchAmenities =
      selectedAmenities.length === 0 ||
      selectedAmenities.every((req) =>
        (s.amenities || []).some((a) =>
          a.toLowerCase().includes(req.toLowerCase())
        )
      );

    const matchPet = !petFriendlyOnly || Boolean(s.pet_friendly);

    return (
      matchSearch &&
      matchZone &&
      matchApp &&
      matchIntensity &&
      matchDiscipline &&
      matchAmenities &&
      matchPet
    );
  });

  const availableTiers = TIERS_BY_APP[appFilter] || [];

  return (
    <main className="max-w-md mx-auto min-h-screen px-4 pt-6">
      {/* Header Editorial */}
      <header className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Emblema / Logo */}
          <img
            src="/Logo.PNG"
            alt="Fitco Club"
            className="w-12 h-12 object-contain shrink-0 mix-blend-multiply brightness-105 contrast-110"
          />
          <div>
            <h1
              className="text-3xl font-semibold tracking-tight text-navy leading-none"
              style={{ fontFamily: 'var(--font-serif), serif' }}
            >
              Fitco Club
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-navy/50 mt-1">
              CDMX Boutique Guide
            </p>
          </div>
        </div>
        <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-navy/5 text-navy">
          {filtered.length} estudios
        </span>
      </header>

      {/* Buscador */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-navy/40" />
        <input
          type="text"
          placeholder="Buscar estudio, clase o disciplina..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-navy/10 text-sm focus:outline-none focus:border-navy shadow-sm"
        />
      </div>

      {/* Barra Compacta de Filtros */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-1 no-scrollbar">
        {/* Botón Todos (Reset) */}
        <button
          onClick={resetAll}
          className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition shrink-0 ${
            !hasAnyFilter
              ? 'bg-navy text-cream'
              : 'bg-white text-navy/70 border border-navy/15'
          }`}
        >
          Todos
        </button>

        {/* Dropdown Ubicación */}
        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className={`max-w-[115px] truncate px-3 py-2 rounded-full text-xs font-medium outline-none cursor-pointer shrink-0 transition ${
            zone !== 'Todas'
              ? 'bg-coral text-white'
              : 'bg-white text-navy border border-navy/15'
          }`}
        >
          <option value="Todas">Ubicación</option>
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>

        {/* Dropdown Membresía */}
        <select
          value={appFilter}
          onChange={(e) => handleAppChange(e.target.value)}
          className={`px-3 py-2 rounded-full text-xs font-medium outline-none cursor-pointer shrink-0 transition ${
            appFilter !== 'Todas'
              ? 'bg-navy text-cream'
              : 'bg-white text-navy border border-navy/15'
          }`}
        >
          <option value="Todas">Membresía</option>
          <option value="Wellhub">Wellhub</option>
          <option value="TotalPass">TotalPass</option>
          <option value="Fitpass">Fitpass</option>
          <option value="Ninguna">Solo Directo</option>
        </select>

        {/* Dropdown Nivel (dinámico según Membresía) */}
        {availableTiers.length > 0 && (
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className={`px-3 py-2 rounded-full text-xs font-medium outline-none cursor-pointer shrink-0 transition ${
              tierFilter !== 'Todos'
                ? 'bg-sky text-navy'
                : 'bg-white text-navy border border-navy/15'
            }`}
          >
            <option value="Todos">Nivel</option>
            {availableTiers.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        {/* Botón 3 Rayas (Filtros Avanzados) */}
        <button
          onClick={() => setShowFilters(true)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition ${
            advancedCount > 0
              ? 'bg-navy text-cream'
              : 'bg-white text-navy border border-navy/15'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filtros
          {advancedCount > 0 && (
            <span className="bg-coral text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {advancedCount}
            </span>
          )}
        </button>
      </div>

      {/* Lista de Estudios */}
      {loading ? (
        <p className="text-center text-sm text-navy/50 py-12">Cargando estudios...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-navy/60 mb-3">No hay estudios con estos filtros.</p>
          <button
            onClick={resetAll}
            className="text-xs font-medium px-4 py-2 rounded-full bg-navy text-cream"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((studio) => (
            <Link
              href={`/studio/${studio.slug}`}
              key={studio.id}
              className="block bg-white rounded-2xl overflow-hidden border border-navy/5 shadow-sm hover:shadow-md transition"
            >
              {/* Foto / Portada del Estudio */}
              <div className="relative h-36 w-full bg-gradient-to-br from-navy via-navy/90 to-sky/80">
                <img
                  src={
                    studio.image_url ||
                    getFallbackImage(studio.name, studio.disciplines, studio.classes)
                  }
                  alt={studio.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />

                {/* Rating flotante */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-cream/95 backdrop-blur px-2.5 py-1 rounded-full shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-coral text-coral" />
                  <span className="text-xs font-bold text-navy">
                    {studio.avg_rating > 0 ? studio.avg_rating : 'New'}
                  </span>
                </div>

                {/* Exigencia flotante */}
                {studio.intensity_level && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-navy/80 backdrop-blur text-cream px-2.5 py-1 rounded-full text-[11px] font-medium">
                    <Flame className="w-3 h-3 text-coral" />
                    {studio.intensity_level}/5
                  </div>
                )}
              </div>

              {/* Contenido de la Tarjeta */}
              <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <div>
                    <h2 className="font-semibold text-base text-navy leading-snug">
                      {studio.name}
                    </h2>
                    <p className="text-xs text-navy/60 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" /> {studio.zone}
                    </p>
                  </div>
                  {studio.price_from && (
                    <span className="text-[11px] font-medium text-navy/60 whitespace-nowrap">
                      Desde ${studio.price_from}
                    </span>
                  )}
                </div>

                {/* Disciplinas */}
                <div className="flex flex-wrap gap-1.5 my-3">
                  {(studio.disciplines || []).slice(0, 4).map((d) => (
                    <span
                      key={d}
                      className="text-[11px] px-2.5 py-0.5 rounded-md bg-cream text-navy/80 font-medium"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                {/* Badges de Membresías */}
                <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-navy/5 text-[11px]">
                  {studio.wellhub_tier && studio.wellhub_tier !== 'No' && (
                    <span className="px-2 py-0.5 rounded bg-navy/5 text-navy font-medium">
                      Wellhub · {studio.wellhub_tier}
                    </span>
                  )}
                  {studio.totalpass_tier && studio.totalpass_tier !== 'No' && (
                    <span className="px-2 py-0.5 rounded bg-sky/30 text-navy font-medium">
                      TotalPass · {studio.totalpass_tier}
                    </span>
                  )}
                  {studio.fitpass_accepted && (
                    <span className="px-2 py-0.5 rounded bg-coral/15 text-coral font-medium">
                      Fitpass · {studio.fitpass_tier || '✓'}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal de Filtros Avanzados (3 rayas) */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-xs flex items-end justify-center">
          <div className="bg-cream w-full max-w-md rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3
                className="text-2xl font-semibold text-navy"
                style={{ fontFamily: 'var(--font-serif), serif' }}
              >
                Filtros avanzados
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1.5 rounded-full bg-navy/5 text-navy"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Exigencia */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-navy/60 mb-2.5">
                Nivel de exigencia mínimo
              </p>
              <div className="flex gap-2">
                {[0, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setMinIntensity(lvl)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
                      minIntensity === lvl
                        ? 'bg-navy text-cream'
                        : 'bg-white text-navy border border-navy/10'
                    }`}
                  >
                    {lvl === 0 ? 'Cualquiera' : `${lvl}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo de Ejercicio */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-navy/60 mb-2.5">
                Tipo de ejercicio
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_DISCIPLINES.map((d) => (
                  <button
                    key={d}
                    onClick={() =>
                      setSelectedDiscipline(selectedDiscipline === d ? '' : d)
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      selectedDiscipline === d
                        ? 'bg-coral text-white'
                        : 'bg-white text-navy border border-navy/10'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-navy/60 mb-2.5">
                Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_AMENITIES.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      selectedAmenities.includes(a)
                        ? 'bg-navy text-cream'
                        : 'bg-white text-navy border border-navy/10'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Pet Friendly */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-navy/10 mb-6">
              <div className="flex items-center gap-2 text-sm font-medium text-navy">
                <PawPrint className="w-4 h-4 text-coral" />
                Solo Pet Friendly
              </div>
              <button
                onClick={() => setPetFriendlyOnly(!petFriendlyOnly)}
                className={`w-11 h-6 rounded-full transition relative ${
                  petFriendlyOnly ? 'bg-coral' : 'bg-navy/20'
                }`}
              >
                <span
                  className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition ${
                    petFriendlyOnly ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={resetAll}
                className="flex-1 py-3 rounded-2xl text-xs font-semibold bg-white border border-navy/15 text-navy"
              >
                Limpiar
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 rounded-2xl text-xs font-semibold bg-navy text-cream"
              >
                Ver {filtered.length} estudios
              </button>
            </div>
          </div>
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
