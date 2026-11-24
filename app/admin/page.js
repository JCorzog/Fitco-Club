'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import {
  ArrowLeft,
  Shield,
  Users,
  MessageSquare,
  Building2,
  Trash2,
  Star,
  AlertTriangle,
} from 'lucide-react';

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [studioCount, setStudioCount] = useState(208);
  const [tab, setTab] = useState('reviews'); // 'reviews' | 'users'

  async function loadAdminData() {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    const { data: myProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (myProfile?.role !== 'admin') {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    setAuthorized(true);

    const [usersRes, reviewsRes, studiosRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('reviews')
        .select('*, studios(name, slug)')
        .order('created_at', { ascending: false }),
      supabase.from('studios').select('id', { count: 'exact', head: true }),
    ]);

    if (usersRes.data) setUsers(usersRes.data);
    if (reviewsRes.data) setReviews(reviewsRes.data);
    if (studiosRes.count) setStudioCount(studiosRes.count);

    setLoading(false);
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  async function handleDeleteReview(id) {
    const ok = window.confirm('¿Seguro que quieres eliminar esta reseña?');
    if (!ok) return;

    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert('Error al eliminar: ' + error.message);
    }
  }

  if (loading) {
    return (
      <main className="max-w-md mx-auto min-h-screen px-4 py-16 text-center text-sm text-navy/50">
        Verificando acceso maestro...
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="max-w-md mx-auto min-h-screen px-4 py-16 text-center">
        <AlertTriangle className="w-10 h-10 text-coral mx-auto mb-3" />
        <h1 className="text-lg font-semibold text-navy mb-1">Acceso restringido</h1>
        <p className="text-xs text-navy/60 mb-5">
          Esta sección es exclusiva para administradores de Fitco Club.
        </p>
        <Link
          href="/perfil"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-navy text-cream text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver a Perfil
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto min-h-screen px-4 pt-6 pb-16">
      {/* Header */}
      <header className="mb-6">
        <Link
          href="/perfil"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-navy/60 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver a Perfil
        </Link>
        <div className="flex items-center gap-2 text-coral text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
          <Shield className="w-3.5 h-3.5" /> Admin Dashboard
        </div>
        <h1
          className="text-3xl font-semibold text-navy leading-none"
          style={{ fontFamily: 'var(--font-serif), serif' }}
        >
          Panel Maestro
        </h1>
      </header>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <div className="bg-navy text-cream rounded-2xl p-3.5">
          <Users className="w-4 h-4 text-coral mb-2" />
          <p className="text-2xl font-bold leading-none">{users.length}</p>
          <p className="text-[10px] uppercase tracking-wider text-cream/65 mt-1">
            Usuarios
          </p>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-navy/5 shadow-sm">
          <MessageSquare className="w-4 h-4 text-coral mb-2" />
          <p className="text-2xl font-bold text-navy leading-none">
            {reviews.length}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-navy/50 mt-1">
            Reseñas
          </p>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border border-navy/5 shadow-sm">
          <Building2 className="w-4 h-4 text-navy/60 mb-2" />
          <p className="text-2xl font-bold text-navy leading-none">
            {studioCount}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-navy/50 mt-1">
            Estudios
          </p>
        </div>
      </div>

      {/* Selector de Pestaña */}
      <div className="flex rounded-xl bg-white p-1 border border-navy/10 mb-4">
        <button
          onClick={() => setTab('reviews')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
            tab === 'reviews' ? 'bg-navy text-cream' : 'text-navy/60'
          }`}
        >
          Moderar Reseñas ({reviews.length})
        </button>
        <button
          onClick={() => setTab('users')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
            tab === 'users' ? 'bg-navy text-cream' : 'text-navy/60'
          }`}
        >
          Usuarios ({users.length})
        </button>
      </div>

      {/* Lista de Reseñas */}
      {tab === 'reviews' ? (
        reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-navy/5">
            <p className="text-xs text-navy/55">No hay reseñas publicadas aún.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-navy">
                      {rev.studios?.name || 'Estudio'}
                    </p>
                    <p className="text-[11px] text-navy/55">
                      Por {rev.author_name || 'Miembro'} ·{' '}
                      <span className="inline-flex items-center gap-0.5 font-semibold text-navy">
                        <Star className="w-3 h-3 fill-coral text-coral" />
                        {rev.rating}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-2 rounded-xl bg-coral/10 text-coral hover:bg-coral hover:text-white transition"
                    title="Eliminar reseña"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {rev.coach_name && (
                  <p className="text-[11px] text-navy/65">
                    Coach: <strong>{rev.coach_name}</strong>
                  </p>
                )}

                <p className="text-xs text-navy/85 leading-relaxed bg-cream/60 p-3 rounded-xl">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Lista de Usuarios */
        <div className="space-y-2.5">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-navy truncate">
                    {u.name || 'Sin nombre'}
                  </p>
                  {u.role === 'admin' && (
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-coral/15 text-coral">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-navy/55 truncate">{u.email}</p>
                <p className="text-[11px] text-navy/45 mt-0.5">
                  {u.membership || 'Wellhub'} · {u.home_zone || 'CDMX'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
