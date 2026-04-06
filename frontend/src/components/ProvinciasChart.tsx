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

type Entry = { categoria: string; porcentaje: number | null; conteo: number | null }

type Props = {
  data: Entry[]
  anio: number | null
}

export function ProvinciasChart({ data, anio }: Props) {
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

  const sorted = [
    ...top.map((d) => ({ name: d.categoria, porcentaje: d.porcentaje ?? 0, conteo: d.conteo })),
    ...(otrasPct > 0
      ? [{ name: 'Otras', porcentaje: Math.round(otrasPct * 10) / 10, conteo: otrasConteo }]
      : []),
  ]

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Distribución geográfica</h2>
      <p className="text-zinc-500 text-sm mb-6">
        {anio ? `Top 12 provincias — ${anio}` : 'Top 12 provincias — datos agregados'}
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
            unit="%"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={{ stroke: '#3f3f46' }}
            tickLine={false}
            domain={[0, 100]}
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
              const conteo = props.payload.conteo
              return [
                conteo != null ? `${v}% (${conteo} casos)` : `${v}%`,
                'Casos',
              ]
            }}
          />
          <Bar dataKey="porcentaje" radius={[0, 4, 4, 0]}>
            {sorted.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.name === 'Otras' ? '#52525b' : '#6d28d9'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
