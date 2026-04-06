import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TOOLTIP_STYLE } from '../lib/chartStyles'
import type { Estadistica } from '../lib/supabase'
import type { ProvinciaConPoblacion } from '../lib/poblacion'
import { tasaPor100k } from '../lib/poblacion'

type Entry = { categoria: string; porcentaje: number | null; conteo: number | null }

type ChartEntry = { name: string; value: number; conteo?: number | null; isOtras: boolean }

type Props = {
  data: Entry[]
  dataRaw?: Estadistica[]
  anio: number | null
  modo?: 'porcentaje' | 'percapita'
  poblaciones?: ProvinciaConPoblacion[]
  años?: number[]
}

export function ProvinciasChart({
  data,
  dataRaw = [],
  anio,
  modo = 'porcentaje',
  poblaciones = [],
  años = [],
}: Props) {
  // Datos en modo porcentaje (top 12 + Otras)
  const sortedPct = useMemo((): ChartEntry[] => {
    const EXCLUIR = new Set(['Otras', 'sin_dato'])
    const provincias = [...data].filter((d) => !EXCLUIR.has(d.categoria))
    const excluidas = data.filter((d) => EXCLUIR.has(d.categoria))

    const sorted_provincias = provincias.sort((a, b) => (b.porcentaje ?? 0) - (a.porcentaje ?? 0))
    const top = sorted_provincias.slice(0, 12)
    const rest = [...sorted_provincias.slice(12), ...excluidas]

    const otrasPct = rest.reduce((sum, d) => sum + (d.porcentaje ?? 0), 0)
    const otrasConteo = rest.every((d) => d.conteo != null)
      ? rest.reduce((sum, d) => sum + (d.conteo ?? 0), 0)
      : null

    return [
      ...top.map((d) => ({ name: d.categoria, value: d.porcentaje ?? 0, conteo: d.conteo, isOtras: false })),
      ...(otrasPct > 0
        ? [{ name: 'Otras', value: Math.round(otrasPct * 10) / 10, conteo: otrasConteo, isOtras: true }]
        : []),
    ]
  }, [data])

  // Datos en modo per cápita (top 12 por tasa, solo con conteo)
  const sortedPercapita = useMemo((): ChartEntry[] => {
    if (modo !== 'percapita' || !dataRaw.length || !poblaciones.length || !años.length) return []
    const filas = dataRaw.filter((d) => d.dimension === 'provincia')
    const provincias = [...new Set(filas.map((d) => d.categoria))].filter(
      (p) => p !== 'sin_dato' && p !== 'Otras',
    )

    const tasas: ChartEntry[] = []

    for (const prov of provincias) {
      const pobData = poblaciones.find((p) => p.nombre === prov)
      if (!pobData) continue

      let tasa: number | null = null

      if (anio) {
        const fila = filas.find((d) => d.categoria === prov && d.anio === anio)
        if (fila?.conteo) tasa = tasaPor100k(fila.conteo, pobData, anio)
      } else {
        let sum = 0, n = 0
        for (const a of años) {
          const fila = filas.find((d) => d.categoria === prov && d.anio === a)
          if (!fila?.conteo) continue
          const t = tasaPor100k(fila.conteo, pobData, a)
          if (t != null) { sum += t; n++ }
        }
        if (n > 0) tasa = Math.round(sum / n * 10) / 10
      }

      if (tasa != null) tasas.push({ name: prov, value: tasa, isOtras: false })
    }

    return tasas.sort((a, b) => b.value - a.value).slice(0, 12)
  }, [dataRaw, anio, modo, poblaciones, años])

  const sorted = modo === 'percapita' ? sortedPercapita : sortedPct

  if (sorted.length === 0) return null

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Distribución geográfica</h2>
      <p className="text-zinc-500 text-sm mb-6">
        {modo === 'percapita'
          ? anio
            ? `Casos por 100k hab. — ${anio}`
            : 'Tasa promedio anual por 100k hab. — top 12'
          : anio
            ? `Top 12 provincias — ${anio}`
            : 'Top 12 provincias — datos agregados'}
      </p>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={sorted}
          layout="vertical"
          barSize={16}
          margin={{ top: 4, right: 16, left: -16, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" horizontal={false} />
          <XAxis
            type="number"
            unit={modo === 'percapita' ? '' : '%'}
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={{ stroke: '#3f3f46' }}
            tickLine={false}
            domain={modo === 'percapita' ? [0, 'auto'] : [0, 100]}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={140}
            interval={0}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            formatter={(value, _name, props) => {
              const v = Number(value)
              if (modo === 'percapita') {
                return [`${v} por 100k hab.`, 'Tasa']
              }
              const conteo = props.payload.conteo
              return [
                conteo != null ? `${v}% (${conteo} ${conteo === 1 ? 'caso' : 'casos'})` : `${v}%`,
                'Casos',
              ]
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {sorted.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.isOtras ? '#52525b' : '#6d28d9'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {modo === 'percapita' && (
        <p className="text-zinc-700 text-xs mt-2">* Solo provincias con datos de conteo exacto disponibles.</p>
      )}
    </div>
  )
}
