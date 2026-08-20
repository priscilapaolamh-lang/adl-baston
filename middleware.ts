// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withPasswordProtect } from '@tommyvez/passfort/next'

// La función de autenticación
const authMiddleware = withPasswordProtect({ protectAll: true })

// Exportar el middleware correctamente
export function middleware(req: NextRequest) {
  // Usar el middleware de autenticación
  const response = authMiddleware(req)
  
  // Si la autenticación falla, devolver la respuesta de autenticación
  if (response) {
    return response
  }

  // Si la autenticación es exitosa, continuar con la solicitud
  return NextResponse.next()
}

// Configurar las rutas donde se ejecutará el middleware
export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
}