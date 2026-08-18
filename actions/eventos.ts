'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

type ActionState = {
  error?: string
  success?: boolean
}

export async function crearEvento(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const titulo = formData.get('titulo') as string
  const descripcion = formData.get('descripcion') as string
  const fecha = formData.get('fecha') as string
  const ubicacion = formData.get('ubicacion') as string
  const ciudad = formData.get('ciudad') as string

  if (!titulo || !fecha || !ubicacion || !ciudad) {
    return { error: 'Todos los campos son obligatorios' }
  }

  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return { error: 'Debes iniciar sesión para crear un evento' }
    }

    const { error } = await supabase
      .from('events')
      .insert({
        title: titulo,
        description: descripcion,
        date: fecha,
        location: ubicacion,
        city: ciudad,
        created_by: session.user.id,
      })

    if (error) {
      return { error: `Error al crear el evento: ${error.message}` }
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { error: 'Error inesperado al crear el evento.' }
  }
}