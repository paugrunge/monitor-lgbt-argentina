export type ProvinciaConPoblacion = {
  nombre: string
  poblacion_2010: number | null
  poblacion_2022: number | null
}

/**
 * Interpola linealmente la población de una provincia entre Censo INDEC 2010 y 2022.
 * Retorna null si faltan datos censales.
 */
export function getPoblacion(prov: ProvinciaConPoblacion, anio: number): number | null {
  const { poblacion_2010: p2010, poblacion_2022: p2022 } = prov
  if (p2010 == null || p2022 == null) return null
  return Math.round(p2010 + (p2022 - p2010) * (anio - 2010) / 12)
}

/** Calcula tasa por 100k hab. Retorna null si no hay población o conteo. */
export function tasaPor100k(
  conteo: number,
  prov: ProvinciaConPoblacion,
  anio: number,
): number | null {
  const pop = getPoblacion(prov, anio)
  if (pop == null || pop === 0) return null
  return Math.round((conteo / pop) * 100_000 * 10) / 10
}
