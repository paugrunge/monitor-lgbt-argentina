import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TOOLTIP_STYLE } from '../lib/chartStyles'

type Props = {
  data: { anio: number; total: number; semestral?: boolean }[]
}

export function TotalCasosChart({ data }: Props) {
  const primerAnio = data[0]?.anio
  const ultimoAnio = data[data.length - 1]?.anio
  const añosSemestrales = data.filter((d) => d.semestral).map((d) => d.anio)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Evolución de casos por año</h2>
      <p className="text-zinc-500 text-sm mb-6">
        Total de crímenes de odio registrados ({primerAnio}–{ultimoAnio})
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <defs>
            <linearGradient id="gradientViolet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis
            dataKey="anio"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={{ stroke: '#3f3f46' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            formatter={(value) => [Number(value), 'Casos']}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#7c3aed"
            strokeWidth={2.5}
            fill="url(#gradientViolet)"
            dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#a78bfa' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      {añosSemestrales.length > 0 && (
        <p className="text-zinc-600 text-xs mt-3">
          * Los informes de {añosSemestrales.join(' y ')} son semestrales (enero–junio), por lo que sus cifras no son comparables directamente con los años con informes anuales.
        </p>
      )}
    </div>
  )
}
