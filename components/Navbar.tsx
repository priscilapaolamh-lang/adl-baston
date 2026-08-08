import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar py-6">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link
          href="/"
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-none"
        >
          ADL ✦ <span className="text-[#80DEEA]">Aqua Diamond Legacy</span>
        </Link>
        <div className="flex items-center gap-6 md:gap-8 text-base md:text-lg font-semibold text-white mt-4 sm:mt-0">
          <Link href="/" className="hover:text-[#80DEEA] transition">Inicio</Link>
          <span className="text-[#80DEEA]/30">|</span>
          <Link href="/eventos" className="hover:text-[#80DEEA] transition">Eventos</Link>
          <span className="text-[#80DEEA]/30">|</span>
          <Link href="/perfil" className="hover:text-[#80DEEA] transition">Mi Perfil</Link>
          <span className="text-[#80DEEA]/30">|</span>
          <Link href="/admin" className="hover:text-[#80DEEA] transition">Admin</Link>
        </div>
      </div>
    </nav>
  );
}