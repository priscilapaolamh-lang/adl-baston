// app/admin/page.tsx
export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Panel de Administración</h1>
      <p className="text-white/70 text-center">
        Bienvenida al panel de administración de ADL Aqua Diamond Legacy.
      </p>
      <p className="text-white/50 text-center text-sm mt-4">
        Aquí podrás gestionar eventos, usuarios y configuraciones del grupo.
      </p>
    </div>
  );
}