'use client';

import { actualizarEvento } from '@/actions/eventos';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function EditarEvento({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [evento, setEvento] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [state, formAction, isPending] = useActionState(actualizarEvento, null);

  useEffect(() => {
    const cargarEvento = async () => {
      try {
        const resolvedParams = await params;
        const { data } = await supabase
          .from('events')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();
        setEvento(data);
      } catch (error) {
        console.error('Error al cargar evento:', error);
        setEvento(null);
      } finally {
        setCargando(false);
      }
    };
    cargarEvento();
  }, [params]);

  useEffect(() => {
    if (state?.success) {
      router.push('/');
    }
  }, [state, router]);

  if (cargando) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 text-center">
        <p className="text-white">Cargando evento...</p>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 text-center">
        <p className="text-red-400">Evento no encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-white text-center mb-6">Editar Evento</h1>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={evento.id} />

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Título del evento</label>
          <input
            type="text"
            name="titulo"
            required
            defaultValue={evento.title}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Descripción</label>
          <textarea
            name="descripcion"
            rows={3}
            defaultValue={evento.description || ''}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            required
            defaultValue={evento.date}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            required
            defaultValue={evento.location}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Ciudad</label>
          <input
            type="text"
            name="ciudad"
            required
            defaultValue={evento.city}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
          />
        </div>

        {state?.error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-2 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="bg-green-500/20 border border-green-500 text-white px-4 py-2 rounded-lg text-sm">
            ✅ Evento actualizado correctamente. Redirigiendo...
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-[#1ABC9C] hover:bg-[#16A085] text-white font-bold rounded-lg transition disabled:opacity-50"
        >
          {isPending ? 'Actualizando...' : 'Actualizar Evento'}
        </button>
      </form>
    </div>
  );
}