'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NuevoEvento() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Debes iniciar sesión para crear un evento.');
      }

      const { error: insertError } = await supabase
        .from('events')
        .insert({
          title: titulo,
          description: descripcion,
          date: fecha,
          location: ubicacion,
          city: ciudad,
          created_by: session.user.id,
        });

      if (insertError) throw insertError;

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al crear el evento. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-white text-center mb-6">Crear Nuevo Evento</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white text-sm font-semibold mb-1">Título del evento</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="Ej: Ensayo para desfile de primavera"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="Detalles del evento..."
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Ubicación</label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="Ej: Polideportivo Municipal"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Ciudad</label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="Ej: Quito"
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full py-2 px-4 bg-[#1ABC9C] hover:bg-[#16A085] text-white font-bold rounded-lg transition disabled:opacity-50"
        >
          {cargando ? 'Creando...' : 'Crear Evento'}
        </button>
      </form>
    </div>
  );
}