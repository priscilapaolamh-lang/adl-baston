'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Registro() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setExito(false);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: nombre,
            phone: telefono,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: nombre,
            phone: telefono,
            role: 'bastonera',
            uniform_size: 'M',
          });

        if (profileError) throw profileError;

        setExito(true);
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-white text-center mb-6">Crear Cuenta</h1>

      <form onSubmit={handleRegistro} className="space-y-4">
        <div>
          <label className="block text-white text-sm font-semibold mb-1">Nombre completo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="Ej: Ana Bastonera"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="0987654321"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {exito && (
          <div className="bg-green-500/20 border border-green-500 text-white px-4 py-2 rounded-lg text-sm">
            ✅ Registro exitoso. Redirigiendo al login...
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full py-2 px-4 bg-[#1ABC9C] hover:bg-[#16A085] text-white font-bold rounded-lg transition disabled:opacity-50"
        >
          {cargando ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      <p className="text-center text-white/70 text-sm mt-4">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-[#1ABC9C] hover:underline font-semibold">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}