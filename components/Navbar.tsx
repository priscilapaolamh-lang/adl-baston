export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">ADL Grupo Independiente Bastón</h1>
        <ul className="flex space-x-4">
          <li><a href="/">Inicio</a></li>
          <li><a href="/eventos">Eventos</a></li>
        </ul>
      </div>
    </nav>
  );
}