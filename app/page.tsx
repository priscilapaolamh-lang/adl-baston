'use client';

import { useState } from 'react';

// Datos de ejemplo (simulan eventos de la base de datos)
const eventosEjemplo = [
  { id: 1, titulo: 'Ensayos para desfile de primavera', fecha: '2026-08-15', ubicacion: 'Polideportivo Municipal' },
  { id: 2, titulo: 'Presentación en feria escolar', fecha: '2026-08-20', ubicacion: 'Colegio San José' },
  { id: 3, titulo: 'Ensayos para campeonato nacional', fecha: '2026-08-25', ubicacion: 'Gimnasio Olímpico' },
  { id: 4, titulo: 'Desfile de carnaval', fecha: '2026-09-01', ubicacion: 'Avenida Principal' },
  { id: 5, titulo: 'Presentación en festival de la ciudad', fecha: '2026-09-05', ubicacion: 'Plaza Central' },
];

export default function Home() {
  const [busqueda, setBusqueda] = useState('');

  // Filtrar eventos según el texto de búsqueda
  const eventosFiltrados = eventosEjemplo.filter((evento) =>
    evento.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    evento.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
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
          placeholder="🔍 Buscar eventos por título o ubicación..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Lista de eventos filtrados */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map((evento) => (
            <div key={evento.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">{evento.titulo}</h3>
              <p className="text-sm text-gray-500 mt-1">📅 {evento.fecha}</p>
              <p className="text-sm text-gray-500">📍 {evento.ubicacion}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No se encontraron eventos que coincidan con la búsqueda.</p>
        )}
      </div>
    </div>
  );
}