import { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import type { Estadistica } from '../lib/supabase'
import type { ProvinciaConPoblacion } from '../lib/poblacion'
import { tasaPor100k } from '../lib/poblacion'
import { agregarTodosLosAnios } from '../lib/utils'

type Props = {
  data: Estadistica[]
  anio: number | null
  modo?: 'porcentaje' | 'percapita'
  poblaciones?: ProvinciaConPoblacion[]
  años?: number[]
}

// Mapeo de NAME_1 en el GeoJSON → categoría en los datos
const GEOJSON_TO_DATA: Record<string, string> = {
  'Ciudad de Buenos Aires': 'CABA',
}

// CABA es microscópica a escala país — se muestra como marcador separado
const CABA_COORDS: [number, number] = [-58.45, -34.61]

function intensidadColor(value: number, max: number): string {
  if (value === 0 || max === 0) return '#27272a' // zinc-800 — sin datos
  const ratio = value / max
  if (ratio > 0.75) return '#dc2626'             // red-600
  if (ratio > 0.50) return '#ea580c'             // orange-600
  if (ratio > 0.30) return '#d97706'             // amber-600
  if (ratio > 0.15) return '#ca8a04'             // yellow-600
  return '#854d0e'                                // yellow-800
}

type TooltipState = {
  content: string
  x: number
  y: number
} | null

export function ArgentinaMap({
  data,
  anio,
  modo = 'porcentaje',
  poblaciones = [],
  años = [],
}: Props) {
  const [tooltip, setTooltip] = useState<TooltipState>(null)

  // Datos en modo porcentaje
  const provinciaData = useMemo(() => {
    const filas = data.filter((d) => d.dimension === 'provincia')
    const filtradas = anio ? filas.filter((d) => d.anio === anio) : agregarTodosLosAnios(filas)
    const map = new Map<string, { porcentaje: number; conteo: number | null }>()
    filtradas.forEach((d) => {
      map.set(d.categoria, { porcentaje: d.porcentaje ?? 0, conteo: d.conteo })
    })
    return map
  }, [data, anio])

  // Datos en modo per cápita
  const percapitaData = useMemo(() => {
    if (modo !== 'percapita' || !poblaciones.length || !años.length) return null
    const filas = data.filter((d) => d.dimension === 'provincia')
    const provincias = [...new Set(filas.map((d) => d.categoria))]
    const map = new Map<string, number | null>()

    for (const prov of provincias) {
      const pobData = poblaciones.find((p) => p.nombre === prov)
      if (!pobData) { map.set(prov, null); continue }

      if (anio) {
        const fila = filas.find((d) => d.categoria === prov && d.anio === anio)
        if (!fila?.conteo) { map.set(prov, null); continue }
        map.set(prov, tasaPor100k(fila.conteo, pobData, anio))
      } else {
        let sum = 0, n = 0
        for (const a of años) {
          const fila = filas.find((d) => d.categoria === prov && d.anio === a)
          if (!fila?.conteo) continue
          const tasa = tasaPor100k(fila.conteo, pobData, a)
          if (tasa != null) { sum += tasa; n++ }
        }
        map.set(prov, n > 0 ? Math.round(sum / n * 10) / 10 : null)
      }
    }
    return map
  }, [data, anio, modo, poblaciones, años])

  const maxValue = useMemo(() => {
    if (modo === 'percapita' && percapitaData) {
      const values = [...percapitaData.values()].filter((v): v is number => v != null)
      return Math.max(...values, 0)
    }
    return Math.max(...[...provinciaData.values()].map((v) => v.porcentaje), 0)
  }, [modo, percapitaData, provinciaData])

  function getProvinceDisplay(dataKey: string): { fill: string; tooltipContent: string } {
    if (modo === 'percapita' && percapitaData) {
      const tasa = percapitaData.get(dataKey) ?? null
      return {
        fill: tasa != null ? intensidadColor(tasa, maxValue) : '#27272a',
        tooltipContent: tasa != null
          ? `${dataKey}: ${tasa} por 100k hab.`
          : `${dataKey}: Sin datos`,
      }
    }
    const prov = provinciaData.get(dataKey)
    const pct = prov?.porcentaje ?? 0
    return {
      fill: intensidadColor(pct, maxValue),
      tooltipContent: pct > 0
        ? `${dataKey}: ${pct.toFixed(1)}%${prov?.conteo != null ? ` · ${prov.conteo} ${prov.conteo === 1 ? 'caso' : 'casos'}` : ''}`
        : `${dataKey}: Sin datos`,
    }
  }

  const cabaDisplay = getProvinceDisplay('CABA')

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Mapa de Argentina</h2>
      <p className="text-zinc-500 text-sm mb-4">
        {modo === 'percapita'
          ? anio
            ? `Tasa de casos por 100k hab. — ${anio}`
            : 'Tasa promedio anual por 100k hab. (todos los años)'
          : anio
            ? `Distribución de casos por provincia — ${anio}`
            : 'Distribución acumulada de casos por provincia (todos los años)'}
      </p>

      <div className="relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 650, center: [-64, -38] }}
          width={600}
          height={520}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography="/argentina-provinces.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoName: string = geo.properties.NAME_1 ?? ''
                const dataKey = GEOJSON_TO_DATA[geoName] ?? geoName
                const { fill, tooltipContent } = getProvinceDisplay(dataKey)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#3f3f46"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', opacity: 0.85 },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={(e) => setTooltip({ content: tooltipContent, x: e.clientX, y: e.clientY })}
                    onMouseMove={(e) => setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })
            }
          </Geographies>

          {/* CABA: marcador visible porque su polígono es microscópico a escala país */}
          <Marker coordinates={CABA_COORDS}>
            <circle
              r={8}
              fill={cabaDisplay.fill}
              stroke="#3f3f46"
              strokeWidth={1}
              onMouseEnter={(e) => setTooltip({ content: cabaDisplay.tooltipContent, x: e.clientX, y: e.clientY })}
              onMouseMove={(e) => setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev)}
              onMouseLeave={() => setTooltip(null)}
            />
            <text
              textAnchor="middle"
              y={-12}
              style={{ fontSize: 9, fill: '#a1a1aa', pointerEvents: 'none' }}
            >
              CABA
            </text>
          </Marker>
        </ComposableMap>

        {tooltip && (
          <div
            className="fixed z-50 pointer-events-none text-xs text-zinc-200 bg-zinc-800 border border-zinc-700 rounded px-2.5 py-1.5 shadow-lg"
            style={{ left: tooltip.x + 12, top: tooltip.y - 32 }}
          >
            {tooltip.content}
          </div>
        )}
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-zinc-600 text-xs">Menor</span>
        {['#854d0e', '#ca8a04', '#d97706', '#ea580c', '#dc2626'].map((c) => (
          <div key={c} className="h-3 w-6 rounded" style={{ backgroundColor: c }} />
        ))}
        <span className="text-zinc-600 text-xs">Mayor</span>
        <span className="text-zinc-700 text-xs ml-3">Sin datos</span>
        <div className="h-3 w-6 rounded bg-zinc-800 border border-zinc-700" />
      </div>
      {modo === 'percapita' && (
        <p className="text-zinc-700 text-xs mt-2">* Solo años con datos de conteo exacto.</p>
      )}
    </div>
  )
}
