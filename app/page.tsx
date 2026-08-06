export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-4xl font-bold text-center text-pink-600">
        Bienvenido a ADL Baston
      </h1>
      <p className="mt-4 text-lg text-center text-gray-600 max-w-2xl">
        Gestión para ensayos, eventos y comunicaciones de tu grupo de bastoneras.
      </p>
      <div className="mt-8 flex gap-4">
        <a
          href="/eventos"
          className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
        >
          Ver eventos
        </a>
        <a
          href="/dashboard"
          className="px-6 py-3 border border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition"
        >
          Acceder al dashboard
        </a>
      </div>
    </div>
  )
}
