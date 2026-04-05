import {
  BarChart,
  Bar,
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
  const sorted = [...data]
    .sort((a, b) => (b.porcentaje ?? 0) - (a.porcentaje ?? 0))
    .slice(0, 12)
    .map((d) => ({
      name: d.categoria,
      porcentaje: d.porcentaje ?? 0,
      conteo: d.conteo,
    }))

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Distribución geográfica</h2>
      <p className="text-zinc-500 text-sm mb-6">
        {anio ? `Top provincias — ${anio}` : 'Top provincias — último dato por provincia'}
      </p>
      <ResponsiveContainer width="100%" height={320}>
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
            width={150}
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
          <Bar dataKey="porcentaje" fill="#6d28d9" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
