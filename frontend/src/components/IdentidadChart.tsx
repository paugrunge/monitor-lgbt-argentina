import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'

const IDENTITY_COLORS: Record<string, string> = {
  mujer_trans: '#7c3aed',
  gay_cis:     '#8b5cf6',
  lesbiana:    '#a78bfa',
  'varón_trans': '#c4b5fd',
  no_binarie:  '#ddd6fe',
}

const IDENTITY_LABELS: Record<string, string> = {
  mujer_trans:   'Mujeres trans / travestis',
  gay_cis:       'Varones gays cis',
  lesbiana:      'Lesbianas',
  'varón_trans': 'Varones trans',
  no_binarie:    'Personas no binarias',
}

type Entry = { categoria: string; porcentaje: number | null; conteo: number | null }

type Props = {
  data: Entry[]
  anioSeleccionado: number | null
}

export function IdentidadChart({ data, anioSeleccionado }: Props) {
  const sorted = [...data].sort((a, b) => (b.porcentaje ?? 0) - (a.porcentaje ?? 0))

  const chartData = sorted.map((d) => ({
    name: IDENTITY_LABELS[d.categoria] ?? d.categoria,
    categoria: d.categoria,
    porcentaje: d.porcentaje ?? 0,
    conteo: d.conteo,
  }))

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Identidad de las víctimas</h2>
      <p className="text-zinc-500 text-sm mb-6">
        {anioSeleccionado ? `Año ${anioSeleccionado}` : 'Todos los años — último dato disponible por categoría'}
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 4, right: 40, left: 8, bottom: 4 }}
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
            width={190}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: 8,
              color: '#fff',
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
          <Bar dataKey="porcentaje" radius={[0, 4, 4, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.categoria}
                fill={IDENTITY_COLORS[entry.categoria] ?? '#6d28d9'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
