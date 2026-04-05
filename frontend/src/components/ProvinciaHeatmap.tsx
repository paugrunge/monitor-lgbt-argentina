import React from 'react'
import type { Estadistica } from '../lib/supabase'

type Props = {
  data: Estadistica[]
  años: number[]
}

// Escala de calor: amarillo pálido → naranja → rojo
function intensidadStyle(pct: number, max: number): React.CSSProperties {
  if (pct === 0 || max === 0) return { backgroundColor: '#27272a' } // zinc-800
  const ratio = pct / max
  if (ratio > 0.75) return { backgroundColor: '#dc2626' }           // red-600
  if (ratio > 0.50) return { backgroundColor: '#ea580c' }           // orange-600
  if (ratio > 0.30) return { backgroundColor: '#d97706' }           // amber-600
  if (ratio > 0.15) return { backgroundColor: '#ca8a04' }           // yellow-600
  return { backgroundColor: '#854d0e' }                              // yellow-800 (bajo, no saturado)
}

export function ProvinciaHeatmap({ data, años }: Props) {
  const filas = data.filter((d) => d.dimension === 'provincia')

  // Ordenar provincias por total acumulado (más afectadas primero)
  const provinciaMap = new Map<string, number>()
  filas.forEach((d) => {
    provinciaMap.set(d.categoria, (provinciaMap.get(d.categoria) ?? 0) + (d.porcentaje ?? 0))
  })
  const provincias = [...provinciaMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([nombre]) => nombre)

  const maxPct = Math.max(...filas.map((d) => d.porcentaje ?? 0))

  // O(1) lookup en lugar de Array.find() en cada celda del grid
  const celdaMap = new Map(filas.map((d) => [`${d.categoria}|${d.anio}`, d]))
  const getCelda = (provincia: string, anio: number) =>
    celdaMap.get(`${provincia}|${anio}`)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Mapa de calor provincial</h2>
      <p className="text-zinc-500 text-sm mb-6">
        Intensidad de casos por provincia y año — mayor intensidad = mayor proporción
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-left text-zinc-500 pr-3 font-normal w-36">Provincia</th>
              {años.map((a) => (
                <th key={a} className="text-zinc-500 font-normal text-center px-1">{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {provincias.map((prov) => (
              <tr key={prov}>
                <td className="text-zinc-400 pr-3 py-0.5 whitespace-nowrap">{prov}</td>
                {años.map((anio) => {
                  const celda = getCelda(prov, anio)
                  const pct = celda?.porcentaje ?? 0
                  return (
                    <td key={anio} className="p-0.5">
                      <div
                        title={pct > 0 ? `${pct}%${celda?.conteo != null ? ` (${celda.conteo} casos)` : ''}` : 'Sin datos'}
                        className="h-7 rounded cursor-default"
                        style={intensidadStyle(pct, maxPct)}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Leyenda */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-zinc-600 text-xs">Menor</span>
        {['#854d0e', '#ca8a04', '#d97706', '#ea580c', '#dc2626'].map((c) => (
          <div key={c} className="h-4 w-8 rounded" style={{ backgroundColor: c }} />
        ))}
        <span className="text-zinc-600 text-xs">Mayor</span>
        <span className="text-zinc-700 text-xs ml-2">· Sin datos</span>
        <div className="h-4 w-8 rounded bg-zinc-800" />
      </div>
    </div>
  )
}
