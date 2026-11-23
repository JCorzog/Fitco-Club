'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import {
  ArrowLeft,
  MapPin,
  Star,
  Flame,
  Clock,
  CalendarX,
  Dumbbell,
  Sparkles,
  PawPrint,
  ExternalLink,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from 'lucide-react';

function getFallbackImage(name = '', disciplines = [], classes = []) {
  const text = [name, ...(disciplines || []), ...(classes || [])]
    .join(' ')
    .toLowerCase();
  if (text.includes('pilates') || text.includes('barre')) {
    return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80';
  }
  if (text.includes('yoga')) {
    return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=80';
  }
  if (text.includes('box')) {
    return 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1000&q=80';
  }
  if (text.includes('cycling') || text.includes('spin')) {
    return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80';
  }
  if (text.includes('hiit') || text.includes('fuerza') || text.includes('hyrox')) {
    return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80';
  }
  return 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=80';
}

export default function StudioDetail() {
  const { slug } = useParams();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudio() {
      const { data } = await supabase
        .from('studios')
        .select('*')
        .eq('slug', slug)
        .single();

      if (data) setStudio(data);
      setLoading(false);
    }
    if (slug) fetchStudio();
  }, [slug]);

  if (loading) {
    return (
      <main className="max-w-md mx-auto min-h-screen px-4 py-16 text-center text-sm text-navy/50">
        Cargando ficha del estudio...
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="max-w-md mx-auto min-h-screen px-4 py-16 text-center">
        <p className="text-sm text-navy/60 mb-4">No encontramos este estudio.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy text-cream text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver a Explorar
        </Link>
      </main>
    );
  }

  const hasWellhub = studio.wellhub_tier && studio.wellhub_tier !== 'No';
  const hasTotalPass = studio.totalpass_tier && studio.totalpass_tier !== 'No';
  const hasFitpass = Boolean(studio.fitpass_accepted);

  return (
    <main className="max-w-md mx-auto min-h-screen pb-16">
      {/* Portada Hero */}
      <div className="relative h-64 w-full bg-navy">
        <img
          src={
            studio.image_url ||
            getFallbackImage(studio.name, studio.disciplines, studio.classes)
          }
          alt={studio.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-navy/30" />

        {/* Botón Volver */}
        <Link
          href="/"
          className="absolute top-5 left-4 flex items-center gap-1.5 bg-cream/95 backdrop-blur text-navy px-3 py-1.5 rounded-full text-xs font-medium shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Explorar
        </Link>

        {/* Rating y Exigencia */}
        <div className="absolute top-5 right-4 flex items-center gap-2">
          {studio.intensity_level && (
            <span className="flex items-center gap-1 bg-navy/80 backdrop-blur text-cream px-2.5 py-1 rounded-full text-xs font-medium">
              <Flame className="w-3.5 h-3.5 text-coral" />
              {studio.intensity_level}/5
            </span>
          )}
          <span className="flex items-center gap-1 bg-cream/95 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-navy shadow-sm">
            <Star className="w-3.5 h-3.5 fill-coral text-coral" />
            {studio.avg_rating > 0 ? studio.avg_rating : 'New'}
          </span>
        </div>

        {/* Título sobre la portada */}
        <div className="absolute bottom-4 left-4 right-4 text-cream">
          <p className="text-[11px] uppercase tracking-[0.18em] text-cream/75 flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3" /> {studio.zone}
            {studio.price_from ? ` · Desde $${studio.price_from} MXN` : ''}
          </p>
          <h1
            className="text-3xl font-semibold leading-tight"
            style={{ fontFamily: 'var(--font-serif), serif' }}
          >
            {studio.name}
          </h1>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Vibe / Estilo */}
        {studio.style_vibe && (
          <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.18em] text-navy/45 font-semibold mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-coral" /> El Vibe
            </p>
            <p className="text-sm text-navy/85 leading-relaxed">{studio.style_vibe}</p>
          </div>
        )}

        {/* Transparencia de Membresías */}
        <section className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm">
          <h2
            className="text-xl font-semibold text-navy mb-3"
            style={{ fontFamily: 'var(--font-serif), serif' }}
          >
            Membresías y reglas
          </h2>

          <div className="space-y-3 text-xs">
            {/* Wellhub */}
            <div className="p-3 rounded-xl bg-cream/70">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-navy">Wellhub</span>
                {hasWellhub ? (
                  <span className="flex items-center gap-1 text-navy font-semibold bg-navy/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-navy" /> {studio.wellhub_tier}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-navy/40">
                    <XCircle className="w-3 h-3" /> No incluido
                  </span>
                )}
              </div>
              {studio.wellhub_rules && (
                <p className="text-navy/70 leading-relaxed">{studio.wellhub_rules}</p>
              )}
            </div>

            {/* TotalPass */}
            <div className="p-3 rounded-xl bg-cream/70">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-navy">TotalPass</span>
                {hasTotalPass ? (
                  <span className="flex items-center gap-1 text-navy font-semibold bg-sky/40 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-navy" /> {studio.totalpass_tier}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-navy/40">
                    <XCircle className="w-3 h-3" /> No incluido
                  </span>
                )}
              </div>
              {studio.totalpass_rules && (
                <p className="text-navy/70 leading-relaxed">{studio.totalpass_rules}</p>
              )}
            </div>

            {/* Fitpass */}
            <div className="p-3 rounded-xl bg-cream/70">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-navy">Fitpass</span>
                {hasFitpass ? (
                  <span className="flex items-center gap-1 text-coral font-semibold bg-coral/15 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-coral" />{' '}
                    {studio.fitpass_tier || 'Incluido'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-navy/40">
                    <XCircle className="w-3 h-3" /> No incluido
                  </span>
                )}
              </div>
              {studio.fitpass_rules && (
                <p className="text-navy/70 leading-relaxed">{studio.fitpass_rules}</p>
              )}
            </div>
          </div>

          {/* Ventana de reserva y cancelación */}
          <div className="mt-4 pt-3 border-t border-navy/10 space-y-2 text-xs text-navy/75">
            {studio.booking_window && (
              <p className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-navy/50 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-navy">Reserva:</strong> {studio.booking_window}
                </span>
              </p>
            )}
            {studio.cancellation_policy && (
              <p className="flex items-start gap-2">
                <CalendarX className="w-4 h-4 text-coral shrink-0 mt-0.5" />
                <span>
                  <strong className="text-navy">Cancelación:</strong>{' '}
                  {studio.cancellation_policy}
                </span>
              </p>
            )}
          </div>
        </section>

        {/* Clases y Disciplinas */}
        <section className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm">
          <h2
            className="text-xl font-semibold text-navy mb-3"
            style={{ fontFamily: 'var(--font-serif), serif' }}
          >
            Clases disponibles
          </h2>
          <div className="flex flex-wrap gap-2">
            {(studio.classes && studio.classes.length > 0
              ? studio.classes
              : studio.disciplines || []
            ).map((item) => (
              <span
                key={item}
                className="text-xs px-3 py-1.5 rounded-xl bg-cream text-navy font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Logística, Equipo y Amenities */}
        <section className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm space-y-4">
          <h2
            className="text-xl font-semibold text-navy"
            style={{ fontFamily: 'var(--font-serif), serif' }}
          >
            Logística y amenities
          </h2>

          {/* Equipo */}
          <div className="flex items-start gap-2.5 text-xs text-navy/80 bg-cream/70 p-3 rounded-xl">
            <Dumbbell className="w-4 h-4 text-navy shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-navy mb-0.5">
                {studio.equipment_required
                  ? 'Requiere equipo especial'
                  : 'Sin equipo especial'}
              </p>
              <p className="text-navy/70">{studio.equipment_details}</p>
            </div>
          </div>

          {/* Amenities */}
          {studio.amenities && studio.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {studio.amenities.map((a) => (
                <span
                  key={a}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-navy/5 text-navy font-medium"
                >
                  {a}
                </span>
              ))}
              {studio.pet_friendly && (
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-coral/15 text-coral font-medium flex items-center gap-1">
                  <PawPrint className="w-3 h-3" /> Pet Friendly
                </span>
              )}
            </div>
          )}

          {/* Sitio Web */}
          {studio.website_url && (
            <a
              href={studio.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-navy text-cream text-xs font-semibold"
            >
              Visitar sitio oficial <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </section>

        {/* Reseñas (siguiente paso) */}
        <section className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2
              className="text-xl font-semibold text-navy"
              style={{ fontFamily: 'var(--font-serif), serif' }}
            >
              Reseñas y coaches
            </h2>
            <span className="text-xs text-navy/50">{studio.review_count || 0} reseñas</span>
          </div>
          <div className="text-center py-6 bg-cream/50 rounded-xl">
            <MessageSquare className="w-6 h-6 text-navy/30 mx-auto mb-2" />
            <p className="text-xs text-navy/60">
              Aún no hay reseñas para este estudio.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
