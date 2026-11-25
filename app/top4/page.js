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
  Share2,
  Loader2,
} from 'lucide-react';

// Venado minimalista de frente incrustado directo en el código (sin archivos externos)
const DEER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120" fill="none" stroke="#102132" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M51 44 C46 32, 34 24, 30 10" />
  <path d="M40 30 C32 28, 26 22, 24 15" />
  <path d="M46 36 C44 26, 46 18, 42 12" />
  <path d="M69 44 C74 32, 86 24, 90 10" />
  <path d="M80 30 C88 28, 94 22, 96 15" />
  <path d="M74 36 C76 26, 74 18, 78 12" />
  <path d="M47 49 C37 45, 31 48, 33 54 C35 58, 42 58, 47 55" />
  <path d="M73 49 C83 45, 89 48, 87 54 C85 58, 78 58, 73 55" />
  <path d="M47 48 C50 43, 70 43, 73 48 C75 56, 72 67, 68 75 C66 80, 64 85, 60 85 C56 85, 54 80, 52 75 C48 67, 45 56, 47 48 Z" />
  <path d="M56 76 C58 78, 62 78, 64 76" />
  <path d="M60 78 L60 82" />
  <path d="M50 72 C48 86, 44 98, 42 108" />
  <path d="M70 72 C72 86, 76 98, 78 108" />
  <path d="M48 92 C54 100, 66 100, 72 92" />
</svg>
`;

const DEER_LOGO_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(DEER_SVG)}`;

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

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawNotchedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w, y, r, Math.PI, Math.PI * 0.5, true);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w, y + h, r, Math.PI * 1.5, Math.PI, true);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x, y + h, r, 0, Math.PI * 1.5, true);
  ctx.lineTo(x, y + r);
  ctx.arc(x, y, r, Math.PI * 0.5, 0, true);
  ctx.closePath();
}

function fitText(ctx, text, maxWidth, initialSize, fontTemplate) {
  let size = initialSize;
  ctx.font = fontTemplate.replace('{size}', size);
  while (ctx.measureText(text).width > maxWidth && size > 24) {
    size -= 2;
    ctx.font = fontTemplate.replace('{size}', size);
  }
  return size;
}

async function generateTop4StoryBlob(studios) {
  const width = 1080;
  const height = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 1. Fondo alabastro
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(0, 0, width, height);

  // 2. Marco exterior fino
  ctx.strokeStyle = '#102132';
  ctx.lineWidth = 3;
  ctx.strokeRect(56, 56, width - 112, height - 112);

  // 3. Encabezado
  ctx.fillStyle = '#102132';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = '600 58px Georgia, "Times New Roman", serif';
  ctx.fillText('FITCO CLUB', width / 2, 185);

  ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(16, 33, 50, 0.78)';
  ctx.fillText('C D M X   F I T N E S S   G U I D E', width / 2, 240);

  // 4. Líneas laterales + Venado SVG
  const dividerY = 335;
  ctx.strokeStyle = 'rgba(16, 33, 50, 0.25)';
  ctx.lineWidth = 2;

  const deerImg = await loadImage(DEER_LOGO_URI);
  if (deerImg) {
    ctx.beginPath();
    ctx.moveTo(130, dividerY);
    ctx.lineTo(width / 2 - 75, dividerY);
    ctx.moveTo(width / 2 + 75, dividerY);
    ctx.lineTo(width - 130, dividerY);
    ctx.stroke();

    const logoSize = 125;
    ctx.drawImage(
      deerImg,
      width / 2 - logoSize / 2,
      dividerY - logoSize / 2,
      logoSize,
      logoSize
    );
  } else {
    ctx.beginPath();
    ctx.moveTo(130, dividerY);
    ctx.lineTo(width - 130, dividerY);
    ctx.stroke();
  }

  // 5. Título principal
  ctx.fillStyle = '#102132';
  ctx.font = 'italic 62px Georgia, "Times New Roman", serif';
  ctx.fillText('MI TOP 4 ESTUDIOS', width / 2, 470);

  // 6. Marco editorial interior
  const boxX = 120;
  const boxY = 550;
  const boxW = width - 240;
  const boxH = 880;

  ctx.strokeStyle = '#102132';
  ctx.lineWidth = 2.5;
  drawNotchedRect(ctx, boxX, boxY, boxW, boxH, 28);
  ctx.stroke();

  // 7. Filas de los 4 estudios
  const numberColors = ['#D46A56', '#102132', '#5B7083', '#6E8294'];
  const rowHeight = boxH / 4;

  for (let i = 0; i < 4; i++) {
    const studio = studios[i];
    const rowTop = boxY + i * rowHeight;
    const centerY = rowTop + rowHeight / 2;

    if (i > 0) {
      ctx.strokeStyle = 'rgba(16, 33, 50, 0.14)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(boxX + 45, rowTop);
      ctx.lineTo(boxX + boxW - 45, rowTop);
      ctx.stroke();
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = numberColors[i];
    ctx.font = 'italic 600 92px Georgia, "Times New Roman", serif';
    ctx.fillText(`0${i + 1}`, boxX + 55, centerY + 4);

    const textX = boxX + 215;
    const maxTextW = boxW - 260;

    if (studio) {
      const nameUpper = (studio.name || '').toUpperCase();
      ctx.fillStyle = '#102132';
      fitText(
        ctx,
        nameUpper,
        maxTextW,
        44,
        '700 {size}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      );
      ctx.fillText(nameUpper, textX, centerY - 22);

      const discipline =
        Array.isArray(studio.disciplines) && studio.disciplines.length > 0
          ? studio.disciplines.slice(0, 2).join(' & ')
          : 'Boutique Studio';
      const subtitle = [studio.zone, discipline].filter(Boolean).join(' · ');

      ctx.fillStyle = 'rgba(16, 33, 50, 0.78)';
      fitText(ctx, subtitle, maxTextW, 30, 'italic {size}px Georgia, "Times New Roman", serif');
      ctx.fillText(subtitle, textX, centerY + 30);
    } else {
      ctx.fillStyle = 'rgba(16, 33, 50, 0.3)';
      ctx.font = 'italic 34px Georgia, "Times New Roman", serif';
      ctx.fillText('Por descubrir...', textX, centerY);
    }
  }

  // 8. Pie de tarjeta (zona segura para Stories)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#102132';
  ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('DESCUBRE Y SACA TU PASAPORTE EN', width / 2, 1545);

  ctx.font = '700 58px Georgia, "Times New Roman", serif';
  ctx.fillText('fitcoclub.com', width / 2, 1620);

  ctx.font = '500 32px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(16, 33, 50, 0.85)';
  ctx.fillText('@thefitcoclub', width / 2, 1682);

  ctx.font = '400 26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(16, 33, 50, 0.72)';
  ctx.fillText('Comparte tu top y etiquétanos ✦', width / 2, 1755);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
  });
}

export default function Top4Page() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [sharing, setSharing] = useState(false);

  async function loadTop4() {
    setLoading(true);
    let saved = JSON.parse(localStorage.getItem('fitco_top4') || '[]');

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      setUserId(session.user.id);
      const { data: profile } = await supabase
        .from('profiles')
        .select('top4')
        .eq('id', session.user.id)
        .single();

      if (profile && Array.isArray(profile.top4)) {
        const merged = Array.from(new Set([...profile.top4, ...saved])).slice(0, 4);
        saved = merged;
        localStorage.setItem('fitco_top4', JSON.stringify(saved));

        if (JSON.stringify(merged) !== JSON.stringify(profile.top4)) {
          await supabase
            .from('profiles')
            .update({ top4: merged })
            .eq('id', session.user.id);
        }
      }
    }

    if (saved.length === 0) {
      setStudios([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase.from('studios').select('*').in('id', saved);

    if (data) {
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

  async function removeFromTop4(id) {
    const saved = JSON.parse(localStorage.getItem('fitco_top4') || '[]');
    const updated = saved.filter((item) => item !== id);

    localStorage.setItem('fitco_top4', JSON.stringify(updated));
    setStudios((prev) => prev.filter((s) => s.id !== id));

    if (userId) {
      await supabase.from('profiles').update({ top4: updated }).eq('id', userId);
    }
  }

  async function handleShareStory() {
    if (studios.length === 0 || sharing) return;
    setSharing(true);
    try {
      const blob = await generateTop4StoryBlob(studios);
      if (!blob) return;

      const file = new File([blob], 'mi-top4-fitcoclub.png', {
        type: 'image/png',
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Mi Top 4 en Fitco Club',
          text: 'Mi Top 4 de estudios en CDMX · @thefitcoclub',
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mi-top4-fitcoclub.png';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.error('Error al generar tarjeta:', err);
      }
    } finally {
      setSharing(false);
    }
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
        <>
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

          {/* Botón Compartir en Stories */}
          {studios.length > 0 && (
            <div className="mt-6">
              <button
                onClick={handleShareStory}
                disabled={sharing}
                className="w-full py-3.5 px-4 rounded-xl bg-navy text-cream text-sm font-medium flex items-center justify-center gap-2 shadow-sm hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
              >
                {sharing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando tarjeta...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Compartir en Stories ✦
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-navy/50 mt-2">
                Formato vertical 9:16 listo para Instagram Stories
              </p>
            </div>
          )}
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
          <Link href="/top4" className="flex flex-col items-center gap-1 text-navy">
            <Trophy className="w-5 h-5" />
            Top 4
          </Link>
          <Link href="/perfil" className="flex flex-col items-center gap-1">
            <User className="w-5 h-5" />
            Perfil
          </Link>
        </div>
      </nav>
    </main>
  );
}
