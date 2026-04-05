import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type Entry = {
  name: string
  value: number
  conteo?: number | null
  color: string
}

type Props = {
  data: Entry[]
  title: string
  insight?: string
}

export function DonutChart({ data, title, insight }: Props) {
  if (data.length === 0 || data.every((d) => !d.value)) return null
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">{title}</h2>
      {insight && <p className="text-zinc-400 text-sm mb-4">{insight}</p>}
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#a1a1aa' }}
            itemStyle={{ color: '#e4e4e7' }}
            formatter={(value, name, props) => {
              const v = Number(value)
              const conteo = props.payload.conteo
              return [
                conteo != null ? `${v}% (${conteo} casos)` : `${v}%`,
                String(name),
              ]
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#a1a1aa', fontSize: 13 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
