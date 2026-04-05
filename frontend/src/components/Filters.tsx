type Props = {
  años: number[]
  provincias: string[]
  anioSeleccionado: number | null
  provinciaSeleccionada: string | null
  onAnioChange: (anio: number | null) => void
  onProvinciaChange: (provincia: string | null) => void
}

export function Filters({
  años,
  provincias,
  anioSeleccionado,
  provinciaSeleccionada,
  onAnioChange,
  onProvinciaChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500 uppercase tracking-wider">Año</label>
        <select
          value={anioSeleccionado ?? ''}
          onChange={(e) => onAnioChange(e.target.value ? Number(e.target.value) : null)}
          className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
        >
          <option value="">Todos los años</option>
          {años.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500 uppercase tracking-wider">Provincia</label>
        <select
          value={provinciaSeleccionada ?? ''}
          onChange={(e) => onProvinciaChange(e.target.value || null)}
          className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 cursor-pointer"
        >
          <option value="">Todas las provincias</option>
          {provincias.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
