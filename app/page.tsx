'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { obtenerClima } from '@/lib/clima';

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

  useEffect(() => {
    const cargarEventos = async () => {
      setCargando(true);
      setError(null);

      try {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los eventos');
      } finally {
        setCargando(false);
      }
    };

    cargarEventos();
  }, []);

  const eventosFiltrados = eventos.filter((evento) =>
    evento.title.toLowerCase().includes(busqueda.toLowerCase()) ||
    evento.location.toLowerCase().includes(busqueda.toLowerCase()) ||
    evento.city.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* ENCABEZADO PRINCIPAL CON TÍTULO GIGANTE */}
      <div className="text-center mb-8">
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-white leading-none tracking-tight">
          ADL ✦ <span className="text-[#80DEEA]">Aqua Diamond Legacy</span>
        </h1>
        <p className="text-xl md:text-2xl font-light text-white/80 mt-2 tracking-wide">
          Grupo Independiente de Bastoneras
        </p>
      </div>

      {/* Buscador alineado a la derecha */}
      <div className="flex justify-end mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar eventos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-search w-full md:w-80"
        />
      </div>

      {cargando && <p className="text-center text-white font-bold">Cargando eventos...</p>}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white px-4 py-3 rounded-lg mb-4 font-bold">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map((evento) => (
            <div key={evento.id} className="event-card">
              <h3 className="text-lg font-extrabold text-black">{evento.title}</h3>
              <p className="text-sm font-bold text-black/80 mt-1">📅 {evento.date}</p>
              <p className="text-sm font-bold text-black/80">📍 {evento.location}</p>
              <p className="text-sm font-bold text-black/80">🏙️ {evento.city}</p>

              {evento.clima ? (
                <div className="clima-box">
                  <p className="text-sm font-extrabold text-black flex items-center gap-1">
                    <span>🌤️</span>
                    <span className="clima-temp">{evento.clima.temperatura}°C</span>
                    <span className="clima-desc">- {evento.clima.descripcion}</span>
                  </p>
                  <p className="text-xs font-bold text-black/80">
                    Sensación: {evento.clima.sensacion}°C • Humedad: {evento.clima.humedad}%
                  </p>
                </div>
              ) : (
                <p className="text-sm font-bold text-black/60 mt-2">⏳ Clima no disponible</p>
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