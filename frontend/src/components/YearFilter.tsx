type Props = {
  años: number[]
  value: number | null
  onChange: (anio: number | null) => void
}

export function YearFilter({ años, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-500 uppercase tracking-wider">Año</label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
      >
        <option value="">Todos los años</option>
        {años.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  )
}
