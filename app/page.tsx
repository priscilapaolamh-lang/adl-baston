'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { obtenerClima } from '@/lib/clima';
import Link from 'next/link';

type Evento = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string;
  city: string;
  created_by: string;
};

type EventoConClima = Evento & {
  clima?: {
    temperatura: number;
    sensacion: number;
    descripcion: string;
    humedad: number;
    ciudad: string;
    pais: string;
    icono: string;
  } | null;
};

export default function Home() {
  const [busqueda, setBusqueda] = useState('');
  const [eventos, setEventos] = useState<EventoConClima[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [perfil, setPerfil] = useState<any>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [sesion, setSesion] = useState<any>(null);

  useEffect(() => {
    const cargarEventos = async () => {
      setCargando(true);
      setError(null);

      try {
        // Verificar sesión primero
        const { data: { session } } = await supabase.auth.getSession();
        setSesion(session);

        if (!session) {
          setCargando(false);
          return;
        }

        const { data, error: supabaseError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (supabaseError) {
          throw new Error(`Error al cargar eventos: ${supabaseError.message}`);
        }

        if (!data || data.length === 0) {
          setError('No hay eventos disponibles.');
          setEventos([]);
          setCargando(false);
          return;
        }

        const eventosConClima = await Promise.all(
          data.map(async (evento: Evento) => {
            try {
              const clima = await obtenerClima(evento.city);
              return { ...evento, clima };
            } catch {
              return { ...evento, clima: null };
            }
          })
        );

        setEventos(eventosConClima);

        if (session?.user) {
          const { data: perfilData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (perfilData) {
            setPerfil(perfilData);
            setRol(perfilData.role);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los eventos');
      } finally {
        setCargando(false);
      }
    };

    cargarEventos();
  }, []);

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEventos(eventos.filter((e) => e.id !== id));
    } catch (err: any) {
      alert('Error al eliminar el evento: ' + err.message);
    }
  };

  const eventosFiltrados = eventos.filter((evento) =>
    evento.title.toLowerCase().includes(busqueda.toLowerCase()) ||
    evento.location.toLowerCase().includes(busqueda.toLowerCase()) ||
    evento.city.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Si no hay sesión, mostrar mensaje de acceso restringido
  if (!sesion) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-white mb-4">🔒 Acceso Restringido</h1>
        <p className="text-white/70 mb-6">
          Para ver los eventos y actividades del grupo, debes iniciar sesión.
        </p>
        <Link
          href="/login"
          className="inline-block bg-[#1ABC9C] hover:bg-[#16A085] text-white font-bold py-3 px-8 rounded-lg transition"
        >
          Iniciar Sesión
        </Link>
        <p className="text-white/50 text-sm mt-4">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-[#1ABC9C] hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-end mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar eventos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-search w-64 md:w-72"
        />
      </div>

      {perfil && (
        <div className="text-white text-center mb-6">
          <h2 className="text-2xl font-bold">¡Bienvenida, {perfil.full_name}!</h2>
          <p className="text-white/70">
            {rol === 'directora' 
              ? '👑 Eres directora. Puedes gestionar eventos.' 
              : '🩰 Eres bastonera. Puedes ver los eventos.'}
          </p>
        </div>
      )}

      {cargando && <p className="text-center text-white font-bold">Cargando eventos...</p>}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg mb-4 font-bold">
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-12 max-w-7xl mx-auto">
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map((evento) => (
            <div
              key={evento.id}
              className="event-card w-64 h-auto flex flex-col hover:scale-105 hover:-translate-y-1 transition-all duration-200"
            >
              <h3 className="text-base font-extrabold text-black">{evento.title}</h3>
              <p className="text-xs font-bold text-black/80 mt-1">📅 {evento.date}</p>
              <p className="text-xs font-bold text-black/80">📍 {evento.location}</p>
              <p className="text-xs font-bold text-black/80">🏙️ {evento.city}</p>

              {evento.clima ? (
                <div className="clima-box">
                  <p className="text-xs font-extrabold text-black flex items-center gap-1">
                    <span>🌤️</span>
                    <span className="clima-temp">{evento.clima.temperatura}°C</span>
                    <span className="clima-desc">- {evento.clima.descripcion}</span>
                  </p>
                  <p className="text-xs font-bold text-black/80">
                    Sensación: {evento.clima.sensacion}°C • Humedad: {evento.clima.humedad}%
                  </p>
                </div>
              ) : (
                <p className="text-xs font-bold text-black/60 mt-2">⏳ Clima no disponible</p>
              )}

              {rol === 'directora' && (
                <div className="flex justify-between mt-3 gap-2">
                  <a
                    href={`/eventos/${evento.id}/editar`}
                    className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-white px-3 py-1 rounded-full transition"
                  >
                    ✏️ Editar
                  </a>
                  <button
                    onClick={() => handleEliminar(evento.id)}
                    className="text-xs bg-red-500/20 hover:bg-red-500/30 text-white px-3 py-1 rounded-full transition"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-white col-span-full text-center font-bold">
            {cargando ? 'Cargando...' : 'No hay eventos que coincidan con la búsqueda.'}
          </p>
        )}
      </div>
    </div>
  );
}