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
  UserCheck,
  Send,
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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado del formulario de reseña
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [coachName, setCoachName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    const { data: studioData } = await supabase
      .from('studios')
      .select('*')
      .eq('slug', slug)
      .single();

    if (studioData) {
      setStudio(studioData);
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('studio_id', studioData.id)
        .order('created_at', { ascending: false });

      if (reviewsData) setReviews(reviewsData);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (slug) loadData();
  }, [slug]);

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!comment.trim() || !studio) return;

    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert({
      studio_id: studio.id,
      rating,
      author_name: authorName.trim() || 'Miembro Fitco',
      coach_name: coachName.trim() || null,
      comment: comment.trim(),
    });

    setSubmitting(false);

    if (!error) {
      setAuthorName('');
      setCoachName('');
      setComment('');
      setRating(5);
      setShowForm(false);
      loadData(); // Recarga reseñas y el nuevo promedio
    } else {
      alert('No se pudo guardar la reseña: ' + error.message);
    }
  }

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

        {/* Reseñas y Coaches */}
        <section className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="text-xl font-semibold text-navy leading-none"
                style={{ fontFamily: 'var(--font-serif), serif' }}
              >
                Reseñas y coaches
              </h2>
              <p className="text-[11px] text-navy/50 mt-1">
                {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-3.5 py-2 rounded-full bg-navy text-cream text-xs font-medium"
            >
              {showForm ? 'Cancelar' : '+ Escribir reseña'}
            </button>
          </div>

          {/* Formulario para nueva reseña */}
          {showForm && (
            <form
              onSubmit={handleSubmitReview}
              className="bg-cream/80 rounded-2xl p-4 mb-4 space-y-3 border border-navy/10"
            >
              <div>
                <p className="text-[11px] font-semibold text-navy/70 mb-1.5">
                  Calificación
                </p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 transition ${
                          star <= rating
                            ? 'fill-coral text-coral'
                            : 'text-navy/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Tu nombre o apodo"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-white border border-navy/10 text-xs focus:outline-none focus:border-navy"
                />
                <input
                  type="text"
                  placeholder="Coach (opcional)"
                  value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-white border border-navy/10 text-xs focus:outline-none focus:border-navy"
                />
              </div>

              <textarea
                rows={3}
                required
                placeholder="¿Qué tal la clase, la música, las instalaciones o el coach?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-navy/10 text-xs focus:outline-none focus:border-navy resize-none"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-coral text-white text-xs font-semibold disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Publicando...' : 'Publicar reseña'}
              </button>
            </form>
          )}

          {/* Lista de reseñas */}
          {reviews.length === 0 ? (
            <div className="text-center py-6 bg-cream/50 rounded-xl">
              <MessageSquare className="w-6 h-6 text-navy/30 mx-auto mb-2" />
              <p className="text-xs text-navy/60">
                Sé el primero en reseñar este estudio.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-xl bg-cream/60 border border-navy/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-navy">
                      {rev.author_name || 'Miembro Fitco'}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-navy">
                      <Star className="w-3 h-3 fill-coral text-coral" />
                      {rev.rating}
                    </span>
                  </div>
                  {rev.coach_name && (
                    <p className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-navy/5 text-navy">
                      <UserCheck className="w-3 h-3 text-coral" />
                      Coach: {rev.coach_name}
                    </p>
                  )}
                  <p className="text-xs text-navy/80 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
