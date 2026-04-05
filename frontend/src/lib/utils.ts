import type { Estadistica } from './supabase'

/**
 * Agrega filas de múltiples años en un único valor por categoría.
 * - conteo: suma de todos los años que tienen conteo disponible
 * - porcentaje: conteo_total / total_anual_total * 100
 *   Si ningún año tiene conteo, usa el porcentaje del año más reciente como fallback.
 */
export function agregarTodosLosAnios(filas: Estadistica[]): Estadistica[] {
  type Agg = {
    conteoSum: number
    totalSum: number
    hasConteo: boolean
    lastAnio: number
    lastPorcentaje: number | null
    dimension: string
  }

  const map = new Map<string, Agg>()

  filas.forEach((d) => {
    const existing = map.get(d.categoria)
    if (!existing) {
      map.set(d.categoria, {
        conteoSum: d.conteo ?? 0,
        totalSum: d.conteo != null ? (d.total_anual ?? 0) : 0,
        hasConteo: d.conteo != null,
        lastAnio: d.anio,
        lastPorcentaje: d.porcentaje,
        dimension: d.dimension,
      })
    } else {
      if (d.conteo != null) {
        existing.conteoSum += d.conteo
        existing.totalSum += d.total_anual ?? 0
        existing.hasConteo = true
      }
      if (d.anio > existing.lastAnio) {
        existing.lastAnio = d.anio
        existing.lastPorcentaje = d.porcentaje
      }
    }
  })

  return [...map.entries()].map(([categoria, agg]) => ({
    anio: agg.lastAnio,
    periodo: 'anual',
    dimension: agg.dimension,
    categoria,
    conteo: agg.hasConteo ? agg.conteoSum : null,
    porcentaje:
      agg.hasConteo && agg.totalSum > 0
        ? Math.round((agg.conteoSum / agg.totalSum) * 1000) / 10
        : agg.lastPorcentaje,
    total_anual: agg.hasConteo ? agg.totalSum : null,
  }))
}
