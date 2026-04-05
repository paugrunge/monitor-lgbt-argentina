import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Props = {
  data: { anio: number; total: number }[]
}

export function TotalCasosChart({ data }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Evolución de casos por año</h2>
      <p className="text-zinc-500 text-sm mb-6">Total de crímenes de odio registrados (2016–2025)</p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
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
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: 8,
              color: '#fff',
            }}
            labelStyle={{ color: '#a1a1aa' }}
            formatter={(value: number) => [value, 'Casos']}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#7c3aed"
            strokeWidth={2.5}
            dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#a78bfa' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
