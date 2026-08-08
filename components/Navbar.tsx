import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        {/* Título en tamaño normal para el Navbar */}
        <Link href="/" className="text-2xl font-bold text-white tracking-tight">
          ADL ✦ <span className="text-[#80DEEA]">Aqua Diamond Legacy</span>
        </Link>

        {/* Enlaces separados */}
        <div className="flex items-center gap-4 text-sm md:text-base font-semibold text-white">
          <Link href="/" className="hover:text-[#80DEEA] transition">Inicio</Link>
          <span className="text-[#80DEEA]/50">|</span>
          <Link href="/eventos" className="hover:text-[#80DEEA] transition">Eventos</Link>
          <span className="text-[#80DEEA]/50">|</span>
          <Link href="/perfil" className="hover:text-[#80DEEA] transition">Mi Perfil</Link>
          <span className="text-[#80DEEA]/50">|</span>
          <Link href="/admin" className="hover:text-[#80DEEA] transition">Admin</Link>
        </div>
      </div>
    </nav>
  );
}