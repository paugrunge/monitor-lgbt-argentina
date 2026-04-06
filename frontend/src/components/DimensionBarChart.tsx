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
import { getLabel } from '../lib/labels'
import { TOOLTIP_STYLE } from '../lib/chartStyles'

type Entry = {
  categoria: string
  porcentaje: number | null
  conteo: number | null
}

type Props = {
  dimension: string
  data: Entry[]
  title: string
  subtitle?: string
  color?: string
}

export function DimensionBarChart({
  dimension,
  data,
  title,
  subtitle,
  color = '#7c3aed',
}: Props) {
  // Fusionar entradas que comparten el mismo label (ej: pareja + pareja_expareja)
  const merged = new Map<string, { porcentaje: number; conteo: number | null }>()
  data.forEach((d) => {
    const name = getLabel(dimension, d.categoria)
    const existing = merged.get(name)
    if (!existing) {
      merged.set(name, { porcentaje: d.porcentaje ?? 0, conteo: d.conteo })
    } else {
      existing.porcentaje += d.porcentaje ?? 0
      existing.conteo = existing.conteo != null && d.conteo != null
        ? existing.conteo + d.conteo
        : existing.conteo ?? d.conteo
    }
  })

  const sorted = [...merged.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.porcentaje - a.porcentaje)

  if (sorted.length === 0 || sorted.every((d) => !d.porcentaje)) return null

  const height = Math.max(200, sorted.length * 44)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">{title}</h2>
      {subtitle && <p className="text-zinc-500 text-sm mb-6">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 4, right: 48, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" horizontal={false} />
          <XAxis
            type="number"
            unit="%"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={{ stroke: '#3f3f46' }}
            tickLine={false}
            domain={[0, 'auto']}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#a1a1aa', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={160}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            formatter={(value, _name, props) => {
              const v = Number(value)
              const conteo = props.payload.conteo
              return [
                conteo != null ? `${v}% (${conteo} casos)` : `${v}%`,
                'Proporción',
              ]
            }}
          />
          <Bar dataKey="porcentaje" fill={color} radius={[0, 4, 4, 0]}>
            {sorted.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.name === 'Sin dato' ? '#52525b' : color}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
