import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Crear cliente de Supabase con la cookie de la sesión
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  
  // Obtener la sesión del usuario
  const { data: { session } } = await supabase.auth.getSession()

  // Rutas que requieren autenticación
  const rutasProtegidas = ['/admin', '/perfil']
  const url = req.nextUrl.pathname

  // Si la ruta está protegida y no hay sesión, redirigir al login
  if (rutasProtegidas.some(ruta => url.startsWith(ruta)) && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', url)
    return NextResponse.redirect(redirectUrl)
  }

  // Si el usuario ya está autenticado e intenta ir a login o registro, redirigir al home
  if ((url === '/login' || url === '/registro') && session) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

// Configurar las rutas donde se ejecutará el middleware
export const config = {
  matcher: ['/admin/:path*', '/perfil/:path*', '/login', '/registro']
}