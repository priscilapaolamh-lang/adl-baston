'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';

export default function EditarEvento() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarEvento = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Evento no encontrado');

        setTitulo(data.title);
        setDescripcion(data.description || '');
        setFecha(data.date);
        setUbicacion(data.location);
        setCiudad(data.city);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el evento');
      }
    };

    if (id) cargarEvento();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      // Obtener el usuario autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Debes iniciar sesión para editar un evento.');
      }

      console.log('Usuario actual:', session.user.id);
      console.log('Evento a editar:', id);
      console.log('Datos a actualizar:', { titulo, descripcion, fecha, ubicacion, ciudad });

      const { data, error: updateError } = await supabase
        .from('events')
        .update({
          title: titulo,
          description: descripcion,
          date: fecha,
          location: ubicacion,
          city: ciudad,
        })
        .eq('id', id)
        .select();

      if (updateError) {
        console.error('Error de Supabase:', updateError);
        throw updateError;
      }

      console.log('Evento actualizado:', data);

      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error('Error completo:', err);
      setError(err.message || 'Error al actualizar el evento.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-white text-center mb-6">Editar Evento</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white text-sm font-semibold mb-1">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
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
          {cargando ? 'Actualizando...' : 'Actualizar Evento'}
        </button>
      </form>
    </div>
  );
}