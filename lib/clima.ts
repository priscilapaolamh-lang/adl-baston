// lib/clima.ts
// Usando Open-Meteo API (gratuita, sin necesidad de clave)

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Obtiene el clima actual para una ciudad usando Open-Meteo.
 * @param ciudad - Nombre de la ciudad (ej: "Quito", "Guayaquil")
 * @returns Objeto con temperatura, descripción y sensación térmica
 */
export async function obtenerClima(ciudad: string) {
  try {
    // 1. Obtener coordenadas de la ciudad (usando Geocoding API de Open-Meteo)
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es&format=json`;
    const geoRespuesta = await fetch(geoUrl);
    
    if (!geoRespuesta.ok) {
      throw new Error(`Error al obtener coordenadas: ${geoRespuesta.status}`);
    }

    const geoDatos = await geoRespuesta.json();
    
    if (!geoDatos.results || geoDatos.results.length === 0) {
      throw new Error(`Ciudad "${ciudad}" no encontrada. Verifica el nombre.`);
    }

    const { latitude, longitude, name, country } = geoDatos.results[0];

    // 2. Obtener el clima usando las coordenadas
    const climaUrl = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;
    const climaRespuesta = await fetch(climaUrl);
    
    if (!climaRespuesta.ok) {
      throw new Error(`Error al obtener clima: ${climaRespuesta.status}`);
    }

    const climaDatos = await climaRespuesta.json();
    
    // Mapear el código de clima a descripción en español
    const weatherDescriptions: Record<number, string> = {
      0: 'Cielo despejado',
      1: 'Mayormente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla con escarcha',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna intensa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia intensa',
      71: 'Nieve ligera',
      73: 'Nieve moderada',
      75: 'Nieve intensa',
      80: 'Chubascos ligeros',
      81: 'Chubascos moderados',
      82: 'Chubascos intensos',
      95: 'Tormenta eléctrica',
      96: 'Tormenta con granizo ligero',
      99: 'Tormenta con granizo intenso',
    };

    const weatherCode = climaDatos.current?.weather_code ?? 0;
    const descripcion = weatherDescriptions[weatherCode] || 'Clima desconocido';

    return {
      temperatura: Math.round(climaDatos.current?.temperature_2m ?? 0),
      sensacion: Math.round(climaDatos.current?.temperature_2m ?? 0), // Open-Meteo no da sensación térmica, usamos la misma temperatura
      descripcion: descripcion,
      humedad: climaDatos.current?.relative_humidity_2m ?? 0,
      ciudad: name || ciudad,
      pais: country || '',
      icono: '', // No tenemos iconos en Open-Meteo, lo dejamos vacío
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Error desconocido al obtener el clima');
    }
  }
}