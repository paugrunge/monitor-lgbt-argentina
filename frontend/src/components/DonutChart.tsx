import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TOOLTIP_STYLE } from '../lib/chartStyles'

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
      <p className="text-zinc-500 text-sm mb-6">{insight || '\u00A0'}</p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
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
            {...TOOLTIP_STYLE}
            formatter={(value, name, props) => {
              const v = Number(value).toFixed(1)
              const conteo = props.payload.conteo
              return [
                conteo != null ? `${v}% (${conteo} ${conteo === 1 ? 'caso' : 'casos'})` : `${v}%`,
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
