import { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import type { Estadistica } from '../lib/supabase'
import { agregarTodosLosAnios } from '../lib/utils'

type Props = {
  data: Estadistica[]
  anio: number | null
}

// Mapeo de NAME_1 en el GeoJSON → categoría en los datos
const GEOJSON_TO_DATA: Record<string, string> = {
  'Ciudad de Buenos Aires': 'CABA',
}

// CABA es microscópica a escala país — se muestra como marcador separado
const CABA_COORDS: [number, number] = [-58.45, -34.61]

// Escala de calor: misma que ProvinciaHeatmap
function intensidadColor(pct: number, max: number): string {
  if (pct === 0 || max === 0) return '#27272a' // zinc-800 — sin datos
  const ratio = pct / max
  if (ratio > 0.75) return '#dc2626'            // red-600
  if (ratio > 0.50) return '#ea580c'            // orange-600
  if (ratio > 0.30) return '#d97706'            // amber-600
  if (ratio > 0.15) return '#ca8a04'            // yellow-600
  return '#854d0e'                               // yellow-800
}

type TooltipState = {
  content: string
  x: number
  y: number
} | null

export function ArgentinaMap({ data, anio }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState>(null)

  const provinciaData = useMemo(() => {
    const filas = data.filter((d) => d.dimension === 'provincia')
    const filtradas = anio ? filas.filter((d) => d.anio === anio) : agregarTodosLosAnios(filas)
    const map = new Map<string, { porcentaje: number; conteo: number | null }>()
    filtradas.forEach((d) => {
      map.set(d.categoria, { porcentaje: d.porcentaje ?? 0, conteo: d.conteo })
    })
    return map
  }, [data, anio])

  const maxPct = useMemo(
    () => Math.max(...[...provinciaData.values()].map((v) => v.porcentaje), 0),
    [provinciaData],
  )

  const cabaData = provinciaData.get('CABA')
  const cabaPct = cabaData?.porcentaje ?? 0
  const cabaFill = intensidadColor(cabaPct, maxPct)
  const cabaTooltip = cabaPct > 0
    ? `CABA: ${cabaPct.toFixed(1)}%${cabaData?.conteo != null ? ` · ${cabaData.conteo} casos` : ''}`
    : 'CABA: Sin datos'

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Mapa de Argentina</h2>
      <p className="text-zinc-500 text-sm mb-4">
        {anio
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
                const prov = provinciaData.get(dataKey)
                const pct = prov?.porcentaje ?? 0
                const fill = intensidadColor(pct, maxPct)
                const tooltipContent = pct > 0
                  ? `${dataKey}: ${pct.toFixed(1)}%${prov?.conteo != null ? ` · ${prov.conteo} casos` : ''}`
                  : `${dataKey}: Sin datos`

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
              fill={cabaFill}
              stroke="#3f3f46"
              strokeWidth={1}
              onMouseEnter={(e) => setTooltip({ content: cabaTooltip, x: e.clientX, y: e.clientY })}
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
    </div>
  )
}
