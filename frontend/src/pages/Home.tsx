import { useMemo, useState } from 'react'
import { TrendingUp, Users, MapPin } from 'lucide-react'
import { useData } from '../context/EstadisticasContext'
import { TotalCasosChart } from '../components/TotalCasosChart'
import { IdentidadChart } from '../components/IdentidadChart'
import { ProvinciasChart } from '../components/ProvinciasChart'
import { YearFilter } from '../components/YearFilter'
import { agregarTodosLosAnios } from '../lib/utils'

export function Home() {
  const { data, loading, error } = useData()
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | null>(null)

  const años = useMemo(() => [...new Set(data.map((d) => d.anio))].sort(), [data])

  const totalesPorAnio = useMemo(() => {
    const map = new Map<number, number>()
    data.forEach((d) => {
      if (d.total_anual && (!map.has(d.anio) || map.get(d.anio)! < d.total_anual)) {
        map.set(d.anio, d.total_anual)
      }
    })
    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([anio, total]) => ({ anio, total }))
  }, [data])

  const identidades = useMemo(() => {
    const filas = data.filter((d) => d.dimension === 'identidad_victima')
    if (anioSeleccionado) return filas.filter((d) => d.anio === anioSeleccionado)
    return agregarTodosLosAnios(filas)
  }, [data, anioSeleccionado])

  const provincias = useMemo(() => {
    const filas = data.filter((d) => d.dimension === 'provincia')
    if (anioSeleccionado) return filas.filter((d) => d.anio === anioSeleccionado)
    return agregarTodosLosAnios(filas)
  }, [data, anioSeleccionado])

  const ultimoAnio = totalesPorAnio[totalesPorAnio.length - 1]?.anio ?? null
  const totalUltimoAnio = totalesPorAnio[totalesPorAnio.length - 1]?.total ?? 0
  const pctMujeresTrans = useMemo(
    () => identidades.find((d) => d.categoria === 'mujer_trans')?.porcentaje ?? null,
    [identidades],
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-zinc-500 text-sm">Cargando datos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-400 text-sm">Error al cargar datos: {error}</div>
      </div>
    )
  }

  return (
    <main className="px-4 sm:px-6 py-8 sm:py-10 max-w-6xl mx-auto space-y-10">
      {/* Hero */}
      <section className="space-y-4">
        <div className="inline-block bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-medium px-3 py-1 rounded-full">
          Argentina · {años[0]}–{ultimoAnio}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Crímenes de odio<br />
          <span className="text-violet-500">contra la comunidad LGBT+ 🏳️‍🌈</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">
          Visualización de los datos del Observatorio Nacional de Crímenes de Odio LGBT+.
          Una herramienta para visibilizar la violencia y exigir justicia.
        </p>
      </section>

      {/* Métricas clave */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-start gap-4">
          <div className="bg-violet-500/10 p-2 rounded-lg">
            <TrendingUp size={20} className="text-violet-400" />
          </div>
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Casos en {ultimoAnio}</p>
            <p className="text-3xl font-bold text-white">{totalUltimoAnio}</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-start gap-4">
          <div className="bg-violet-500/10 p-2 rounded-lg">
            <Users size={20} className="text-violet-400" />
          </div>
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Mujeres trans</p>
            <p className="text-3xl font-bold text-white">
              {pctMujeresTrans != null ? `${pctMujeresTrans}%` : '—'}
            </p>
            <p className="text-zinc-600 text-xs mt-0.5">
              {anioSeleccionado ? `del total de víctimas en ${anioSeleccionado}` : 'del total de víctimas (todos los años)'}
            </p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-start gap-4">
          <div className="bg-violet-500/10 p-2 rounded-lg">
            <MapPin size={20} className="text-violet-400" />
          </div>
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Años de datos</p>
            <p className="text-3xl font-bold text-white">{años.length}</p>
            <p className="text-zinc-600 text-xs mt-0.5">informes anuales / semestrales</p>
          </div>
        </div>
      </section>

      {/* Evolución total — ancho completo, sin filtro */}
      <TotalCasosChart data={totalesPorAnio} />

      {/* Filtro de año + gráficos afectados */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-zinc-500 text-sm">Filtrar por año:</span>
          <YearFilter años={años} value={anioSeleccionado} onChange={setAnioSeleccionado} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IdentidadChart data={identidades} anioSeleccionado={anioSeleccionado} />
          <ProvinciasChart data={provincias} anio={anioSeleccionado} />
        </div>
      </section>
    </main>
  )
}
