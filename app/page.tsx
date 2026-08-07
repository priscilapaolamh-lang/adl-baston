'use client';

import { useState, useEffect } from 'react';
import { obtenerClima } from '@/lib/clima';

// Datos de ejemplo (simulan eventos de la base de datos)
const eventosEjemplo = [
  { id: 1, titulo: 'Ensayos para desfile de primavera', fecha: '2026-08-15', ubicacion: 'Polideportivo Municipal', ciudad: 'Quito' },
  { id: 2, titulo: 'Presentación en feria escolar', fecha: '2026-08-20', ubicacion: 'Colegio San José', ciudad: 'Guayaquil' },
  { id: 3, titulo: 'Ensayos para campeonato nacional', fecha: '2026-08-25', ubicacion: 'Gimnasio Olímpico', ciudad: 'Cuenca' },
  { id: 4, titulo: 'Desfile de carnaval', fecha: '2026-09-01', ubicacion: 'Avenida Principal', ciudad: 'Ambato' },
  { id: 5, titulo: 'Presentación en festival de la ciudad', fecha: '2026-09-05', ubicacion: 'Plaza Central', ciudad: 'Manta' },
];

export default function Home() {
  const [busqueda, setBusqueda] = useState('');
  const [eventosConClima, setEventosConClima] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el clima de todos los eventos
  useEffect(() => {
    const cargarClima = async () => {
      setCargando(true);
      setError(null);
      try {
        const eventosActualizados = await Promise.all(
          eventosEjemplo.map(async (evento) => {
            try {
              const clima = await obtenerClima(evento.ciudad);
              return { ...evento, clima };
            } catch (err) {
              // Si falla el clima para una ciudad, mostrar mensaje de error amigable
              return { 
                ...evento, 
                clima: { 
                  error: true, 
                  mensaje: err instanceof Error ? err.message : 'Clima no disponible' 
                } 
              };
            }
          })
        );
        setEventosConClima(eventosActualizados);
      } catch (err) {
        setError('Error al cargar los datos del clima. Intenta de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    };

    cargarClima();
  }, []);

  // Filtrar eventos según el texto de búsqueda
  const eventosFiltrados = eventosConClima.filter((evento) =>
    evento.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    evento.ubicacion.toLowerCase().includes(busqueda.toLowerCase()) ||
    evento.ciudad.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bienvenido a ADL Bastón</h1>
      <p className="text-gray-600 mb-8">
        Gestión para ensayos, eventos y comunicaciones de tu grupo de bastoneras.
      </p>

      {/* Buscador */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="🔍 Buscar eventos por título, ubicación o ciudad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Estado de carga */}
      {cargando && (
        <p className="text-gray-500">Cargando clima de las ciudades...</p>
      )}

      {/* Mensaje de error general */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Lista de eventos filtrados */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map((evento) => (
            <div key={evento.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">{evento.titulo}</h3>
              <p className="text-sm text-gray-500 mt-1">📅 {evento.fecha}</p>
              <p className="text-sm text-gray-500">📍 {evento.ubicacion}</p>
              <p className="text-sm text-gray-500">🏙️ {evento.ciudad}</p>
              
              {/* Mostrar clima si está disponible */}
              {evento.clima && !evento.clima.error ? (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    🌤️ {evento.clima.temperatura}°C - {evento.clima.descripcion}
                  </p>
                  <p className="text-xs text-blue-600">
                    Sensación: {evento.clima.sensacion}°C • Humedad: {evento.clima.humedad}%
                  </p>
                </div>
              ) : evento.clima?.error ? (
                <p className="text-sm text-red-500 mt-2">⚠️ {evento.clima.mensaje}</p>
              ) : null}
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