'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Redirigir a la página principal después del login
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-white text-center mb-6">Iniciar Sesión</h1>

      <form onSubmit={handleLogin} className="space-y-4">
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
          <label className="block text-white text-sm font-semibold mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white"
            placeholder="********"
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
          {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p className="text-center text-white/70 text-sm mt-4">
        ¿No tienes cuenta?{' '}
        <Link href="/registro" className="text-[#1ABC9C] hover:underline font-semibold">
          Regístrate
        </Link>
      </p>
    </div>
  );
}