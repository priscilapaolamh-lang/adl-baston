'use client';

import { crearEvento } from '@/actions/eventos';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NuevoEvento() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(crearEvento, null);

  useEffect(() => {
    if (state?.success) {
      router.push('/');
    }
  }, [state, router]);

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-white text-center mb-6">Crear Nuevo Evento</h1>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-white text-sm font-semibold mb-1">Título del evento</label>
          <input
            type="text"
            name="titulo"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="Ej: Ensayo para desfile de primavera"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Descripción</label>
          <textarea
            name="descripcion"
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="Detalles del evento..."
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="Ej: Polideportivo Municipal"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Ciudad</label>
          <input
            type="text"
            name="ciudad"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="Ej: Quito"
          />
        </div>

        {state?.error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-2 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="bg-green-500/20 border border-green-500 text-white px-4 py-2 rounded-lg text-sm">
            ✅ Evento creado correctamente. Redirigiendo...
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-[#1ABC9C] hover:bg-[#16A085] text-white font-bold rounded-lg transition disabled:opacity-50"
        >
          {isPending ? 'Creando...' : 'Crear Evento'}
        </button>
      </form>
    </div>
  );
}