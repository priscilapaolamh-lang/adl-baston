// lib/clima.ts

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'v251a7b55411cf387fafc76610fbce8d4';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Obtiene el clima actual para una ciudad usando OpenWeatherMap.
 * @param ciudad - Nombre de la ciudad (ej: "Quito", "Guayaquil")
 * @returns Objeto con temperatura, descripción y sensación térmica
 */
export async function obtenerClima(ciudad: string) {
  // Si no hay clave API, usar la clave por defecto
  if (!API_KEY) {
    throw new Error('La clave de OpenWeatherMap no está configurada en .env.local');
  }

  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(ciudad)}&appid=${API_KEY}&units=metric&lang=es`;
    const respuesta = await fetch(url);
    
    // Si la respuesta no es exitosa, lanzar error con el código
    if (!respuesta.ok) {
      if (respuesta.status === 404) {
        throw new Error(`Ciudad "${ciudad}" no encontrada. Verifica el nombre.`);
      }
      if (respuesta.status === 401) {
        throw new Error('Clave API inválida. Verifica tu clave de OpenWeatherMap.');
      }
      throw new Error(`Error al obtener el clima: ${respuesta.status} ${respuesta.statusText}`);
    }

    const datos = await respuesta.json();
    
    // Extraer solo los datos que necesitamos
    return {
      temperatura: Math.round(datos.main.temp), // Temperatura en °C
      sensacion: Math.round(datos.main.feels_like), // Sensación térmica en °C
      descripcion: datos.weather[0].description, // Descripción del clima
      humedad: datos.main.humidity, // Humedad en %
      ciudad: datos.name, // Nombre de la ciudad
      pais: datos.sys.country, // Código del país
      icono: datos.weather[0].icon, // Código del ícono
    };
  } catch (error) {
    // Si el error ya es un Error, lo relanzamos; si no, creamos uno nuevo
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Error desconocido al obtener el clima');
    }
  }
}