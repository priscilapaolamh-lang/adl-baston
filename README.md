# ADL Grupo Independiente Bastón

Sistema de gestión para un grupo de bastoneras (majorettes). Permite a la directora publicar eventos y ensayos, y a las bastoneras confirmar asistencia y actualizar su perfil.

## Demo en vivo

[https://adl-baston.vercel.app](https://adl-baston.vercel.app) *(próximamente)*

## Capturas de pantalla

*(Se agregarán cuando la interfaz esté completa)*

## Stack tecnológico

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL + Auth)
- **Vercel** (despliegue)

## Roles de usuario

- **Bastonera (Rol 1)**
  - Ver calendario de eventos/ensayos
  - Confirmar asistencia a eventos
  - Editar su propio perfil (teléfono, contacto de emergencia, talla de uniforme)

- **Directora / Coordinadora (Rol 2)**
  - Crear, editar y eliminar eventos
  - Ver listado de todas las bastoneras
  - Ver quién se apuntó a cada evento

## Modelo de datos

- **profiles**: Extiende `auth.users`. Guarda el rol, nombre, teléfono, contacto de emergencia y talla de uniforme.
- **events**: Eventos/ensayos con título, descripción, fecha, ubicación y creador (directora).
- **event_attendees**: Tabla puente que relaciona bastoneras con eventos, con estado de asistencia.

## Instalación local

```bash
git clone https://github.com/priscilapaolamh-lang/adl-baston.git
cd adl-baston
npm install
npm run dev