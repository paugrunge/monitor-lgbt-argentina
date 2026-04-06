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
    rowsWithConteo: number
    totalRows: number
    hasConteo: boolean
    pctWeightedSum: number   // suma de pct * total_anual (para promedio ponderado)
    pctTotalWeight: number   // suma de total_anual de años con pct disponible
    lastAnio: number
    lastPorcentaje: number | null
    dimension: string
  }

  // Total global = suma de total_anual por año único (denominador común para todas las categorías)
  const totalPorAnio = new Map<number, number>()
  filas.forEach((d) => {
    if (d.total_anual != null && !totalPorAnio.has(d.anio)) {
      totalPorAnio.set(d.anio, d.total_anual)
    }
  })
  const grandTotal = [...totalPorAnio.values()].reduce((sum, t) => sum + t, 0)

  const map = new Map<string, Agg>()

  filas.forEach((d) => {
    const existing = map.get(d.categoria)
    if (!existing) {
      map.set(d.categoria, {
        conteoSum: d.conteo ?? 0,
        rowsWithConteo: d.conteo != null ? 1 : 0,
        totalRows: 1,
        hasConteo: d.conteo != null,
        pctWeightedSum: d.porcentaje != null ? d.porcentaje * (d.total_anual ?? 1) : 0,
        pctTotalWeight: d.porcentaje != null ? (d.total_anual ?? 1) : 0,
        lastAnio: d.anio,
        lastPorcentaje: d.porcentaje,
        dimension: d.dimension,
      })
    } else {
      existing.totalRows += 1
      if (d.conteo != null) {
        existing.conteoSum += d.conteo
        existing.rowsWithConteo += 1
        existing.hasConteo = true
      }
      if (d.porcentaje != null) {
        existing.pctWeightedSum += d.porcentaje * (d.total_anual ?? 1)
        existing.pctTotalWeight += d.total_anual ?? 1
      }
      if (d.anio > existing.lastAnio) {
        existing.lastAnio = d.anio
        existing.lastPorcentaje = d.porcentaje
      }
    }
  })

  // Para dimensiones como tipo_muerte donde los % son relativos a un subtotal
  // (no a total_anual), usar la suma de conteos como denominador en vez de grandTotal.
  // Esto garantiza que los porcentajes agregados sumen ~100%.
  const conteoGrandTotal = [...map.values()].reduce((sum, agg) => sum + agg.conteoSum, 0)
  const denom = conteoGrandTotal > 0 ? conteoGrandTotal : grandTotal

  return [...map.entries()].map(([categoria, agg]) => ({
    anio: agg.lastAnio,
    periodo: 'anual',
    dimension: agg.dimension,
    categoria,
    // Solo mostrar conteo agregado si la mayoría de años tiene datos de conteo.
    // Si la cobertura es parcial (ej: lugar_fisico solo tiene conteos en 2017),
    // el número sería engañoso → se omite.
    conteo: agg.hasConteo && agg.rowsWithConteo / agg.totalRows >= 0.5 ? agg.conteoSum : null,
    porcentaje: (() => {
      const buenaCoberturaConteo = agg.hasConteo && agg.rowsWithConteo / agg.totalRows >= 0.5
      if (buenaCoberturaConteo && denom > 0)
        return Math.round((agg.conteoSum / denom) * 1000) / 10
      if (agg.pctTotalWeight > 0)
        return Math.round((agg.pctWeightedSum / agg.pctTotalWeight) * 10) / 10
      return agg.lastPorcentaje
    })(),
    total_anual: grandTotal > 0 ? grandTotal : null,
  }))
}
