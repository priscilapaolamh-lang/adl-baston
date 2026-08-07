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
    <div>
      <h1 className="text-3xl font-bold mb-6">Bienvenido a ADL Bastón</h1>
      <p className="text-gray-600 mb-8">
        Gestión para ensayos, eventos y comunicaciones de tu grupo de bastoneras.
      </p>

      <div className="mb-8">
        <input
          type="text"
          placeholder="🔍 Buscar eventos por título, ubicación o ciudad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {cargando && <p className="text-gray-500">Cargando eventos y clima...</p>}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map((evento) => (
            <div key={evento.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">{evento.title}</h3>
              <p className="text-sm text-gray-500 mt-1">📅 {evento.date}</p>
              <p className="text-sm text-gray-500">📍 {evento.location}</p>
              <p className="text-sm text-gray-500">🏙️ {evento.city}</p>
              
              {evento.clima ? (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    🌤️ {evento.clima.temperatura}°C - {evento.clima.descripcion}
                  </p>
                  <p className="text-xs text-blue-600">
                    Sensación: {evento.clima.sensacion}°C • Humedad: {evento.clima.humedad}%
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">⏳ Clima no disponible</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">
            {cargando ? 'Cargando eventos...' : 'No se encontraron eventos que coincidan con la búsqueda.'}
          </p>
        )}
      </div>
    </div>
  );
}