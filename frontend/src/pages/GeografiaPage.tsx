import { useMemo, useState } from 'react'
import { useData } from '../context/EstadisticasContext'
import { PageShell } from '../components/PageShell'
import { ArgentinaMap } from '../components/ArgentinaMap'
import { ProvinciasChart } from '../components/ProvinciasChart'
import { ProvinciaHeatmap } from '../components/ProvinciaHeatmap'
import { agregarTodosLosAnios } from '../lib/utils'
import { TOOLTIP_STYLE } from '../lib/chartStyles'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const TOP_PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Tucumán', 'Salta', 'Santiago del Estero',
  'Jujuy', 'Córdoba', 'Santa Fe',
]

const COLORS = [
  '#f59e0b', // Buenos Aires    — ámbar
  '#10b981', // CABA            — esmeralda
  '#ef4444', // Tucumán         — rojo
  '#3b82f6', // Salta           — azul
  '#f97316', // Santiago del E. — naranja
  '#06b6d4', // Jujuy           — cyan
  '#84cc16', // Córdoba         — lima
  '#ec4899', // Santa Fe        — rosa
]

export function GeografiaPage() {
  const { data, loading } = useData()
  const [anio, setAnio] = useState<number | null>(null)

  const años = useMemo(() => [...new Set(data.map((d) => d.anio))].sort(), [data])

  const provinciasFiltradas = useMemo(() => {
    const filas = data.filter((d) => d.dimension === 'provincia')
    if (anio) return filas.filter((d) => d.anio === anio)
    return agregarTodosLosAnios(filas)
  }, [data, anio])

  // Serie temporal de top provincias
  const serieData = useMemo(() => {
    return años.map((a) => {
      const row: Record<string, number | string> = { anio: a }
      TOP_PROVINCIAS.forEach((prov) => {
        const fila = data.find(
          (d) => d.dimension === 'provincia' && d.categoria === prov && d.anio === a,
        )
        if (fila?.porcentaje != null) row[prov] = fila.porcentaje
      })
      return row
    })
  }, [data, años])

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-zinc-500 text-sm">Cargando datos...</div>

  return (
    <PageShell
      title="Distribución geográfica"
      description="Dónde ocurren los crímenes de odio en Argentina, por provincia y a lo largo del tiempo."
      años={años}
      anio={anio}
      onAnioChange={setAnio}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ArgentinaMap data={data} anio={anio} />
        <ProvinciasChart data={provinciasFiltradas} anio={anio} />
      </div>
      <ProvinciaHeatmap data={data} años={años} />

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-1">Evolución por provincia</h2>
        <p className="text-zinc-500 text-sm mb-6">Porcentaje de casos — principales provincias (todos los años)</p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={serieData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
            <XAxis dataKey="anio" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={{ stroke: '#3f3f46' }} tickLine={false} />
            <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" width={36} />
            <Tooltip
              {...TOOLTIP_STYLE}
              formatter={(value, name) => [`${Number(value)}%`, String(name)]}
              itemSorter={(item) => -(item.value as number)}
              cursor={{ stroke: '#52525b', strokeWidth: 1, strokeDasharray: '4 2' }}
            />
            <Legend wrapperStyle={{ color: '#a1a1aa', fontSize: 12 }} />
            {TOP_PROVINCIAS.map((prov, i) => (
              <Line
                key={prov}
                type="monotone"
                dataKey={prov}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </PageShell>
  )
}
