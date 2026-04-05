import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { getLabel } from '../lib/labels'

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
  const sorted = [...data]
    .sort((a, b) => (b.porcentaje ?? 0) - (a.porcentaje ?? 0))
    .map((d) => ({
      name: getLabel(dimension, d.categoria),
      porcentaje: d.porcentaje ?? 0,
      conteo: d.conteo,
    }))

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
            domain={[0, 100]}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={210}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#a1a1aa' }}
            itemStyle={{ color: '#e4e4e7' }}
            formatter={(value: number, _name, props) => {
              const conteo = props.payload.conteo
              return [
                conteo != null ? `${value}% (${conteo} casos)` : `${value}%`,
                'Proporción',
              ]
            }}
          />
          <Bar dataKey="porcentaje" fill={color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
