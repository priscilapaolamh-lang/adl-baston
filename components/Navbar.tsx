'use client';

import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar py-6">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {/* Título con el nuevo nombre */}
        <Link
          href="/"
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-none"
        >
          ✦ <span className="text-[#C0C0C0]">Silver Spirit</span>
        </Link>

        {/* Enlaces a la derecha */}
        <div className="flex items-center gap-6 md:gap-8 text-base md:text-lg font-semibold text-white mt-4 sm:mt-0">
          <Link href="/" className="hover:text-[#C0C0C0] transition">Inicio</Link>
          <span className="text-[#C0C0C0]/30">|</span>
          <Link href="/eventos" className="hover:text-[#C0C0C0] transition">Eventos</Link>
          <span className="text-[#C0C0C0]/30">|</span>
          <Link href="/perfil" className="hover:text-[#C0C0C0] transition">Mi Perfil</Link>
          <span className="text-[#C0C0C0]/30">|</span>
          <Link href="/admin" className="hover:text-[#C0C0C0] transition">Admin</Link>

          {session ? (
            <>
              <span className="text-[#C0C0C0]/30">|</span>
              <button
                onClick={handleLogout}
                className="hover:text-[#FF6B6B] transition text-sm cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <span className="text-[#C0C0C0]/30">|</span>
              <Link href="/login" className="hover:text-[#C0C0C0] transition text-sm">
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}