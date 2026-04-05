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
import type { Estadistica } from '../lib/supabase'
import { TOOLTIP_STYLE } from '../lib/chartStyles'

const IDENTITY_COLORS: Record<string, string> = {
  mujer_trans:   '#a78bfa',  // violet-400  — destacada, más brillante
  gay_cis:       '#34d399',  // emerald-400
  lesbiana:      '#fb7185',  // rose-400
  'varón_trans': '#38bdf8',  // sky-400
  no_binarie:    '#fbbf24',  // amber-400
}

const IDENTITY_LABELS: Record<string, string> = {
  mujer_trans:   'Mujeres trans / travestis',
  gay_cis:       'Varones gays cis',
  lesbiana:      'Lesbianas',
  'varón_trans': 'Varones trans',
  no_binarie:    'Personas no binarias',
}

const IDENTIDADES = Object.keys(IDENTITY_COLORS)

type Props = {
  data: Estadistica[]
  años: number[]
}

export function IdentidadEvolucionChart({ data, años }: Props) {
  const filas = data.filter((d) => d.dimension === 'identidad_victima')

  const serieData = años.map((anio) => {
    const row: Record<string, number | string> = { anio }
    IDENTIDADES.forEach((id) => {
      const fila = filas.find((d) => d.categoria === id && d.anio === anio)
      if (fila?.porcentaje != null) row[id] = fila.porcentaje
    })
    return row
  })

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Evolución por identidad</h2>
      <p className="text-zinc-500 text-sm mb-6">
        Porcentaje de víctimas por identidad a lo largo del tiempo
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={serieData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
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
            unit="%"
            width={40}
          />
          <Tooltip
            {...TOOLTIP_STYLE}
            formatter={(value, name) => [
              `${Number(value)}%`,
              IDENTITY_LABELS[String(name)] ?? String(name),
            ]}
            itemSorter={(item) => -(item.value as number)}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#a1a1aa', fontSize: 12 }}>
                {IDENTITY_LABELS[value] ?? value}
              </span>
            )}
          />
          {IDENTIDADES.map((id) => (
            <Line
              key={id}
              type="monotone"
              dataKey={id}
              stroke={IDENTITY_COLORS[id]}
              strokeWidth={id === 'mujer_trans' ? 3 : 2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
