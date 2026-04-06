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
import { TOOLTIP_STYLE } from '../lib/chartStyles'

const ORDEN = ['10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79']

type Entry = { categoria: string; porcentaje: number | null; conteo: number | null }

type Props = {
  data: Entry[]
  subtitle?: string
}

export function RangoEtarioChart({ data, subtitle }: Props) {
  const chartData = ORDEN.map((rango) => {
    const fila = data.find((d) => d.categoria === rango)
    return {
      name: getLabel('rango_etario', rango),
      porcentaje: fila?.porcentaje ?? 0,
      conteo: fila?.conteo ?? null,
    }
  }).filter((d) => d.porcentaje > 0)

  if (chartData.length === 0) return null

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Distribución etaria</h2>
      {subtitle && <p className="text-zinc-500 text-sm mb-6">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={{ stroke: '#3f3f46' }}
            tickLine={false}
          />
          <YAxis
            unit="%"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            formatter={(value, _name, props) => {
              const v = Number(value)
              const conteo = props.payload.conteo
              return [
                conteo != null ? `${v}% (${conteo} ${conteo === 1 ? 'caso' : 'casos'})` : `${v}%`,
                'Proporción',
              ]
            }}
          />
          <Bar dataKey="porcentaje" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
