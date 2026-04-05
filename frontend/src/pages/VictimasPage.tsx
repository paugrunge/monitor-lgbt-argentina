import { useMemo, useState } from 'react'
import { useData } from '../context/EstadisticasContext'
import { PageShell } from '../components/PageShell'
import { IdentidadChart } from '../components/IdentidadChart'
import { RangoEtarioChart } from '../components/RangoEtarioChart'
import { IdentidadEvolucionChart } from '../components/IdentidadEvolucionChart'
import { agregarTodosLosAnios } from '../lib/utils'

export function VictimasPage() {
  const { data, loading } = useData()
  const [anio, setAnio] = useState<number | null>(null)

  const años = useMemo(() => [...new Set(data.map((d) => d.anio))].sort(), [data])

  const filtrar = (dimension: string) => {
    const filas = data.filter((d) => d.dimension === dimension)
    if (anio) return filas.filter((d) => d.anio === anio)
    return agregarTodosLosAnios(filas)
  }

  const identidades = useMemo(() => filtrar('identidad_victima'), [data, anio])
  const rangoEtario = useMemo(() => filtrar('rango_etario'), [data, anio])

  const insightIdentidad = useMemo(() => {
    const top = [...identidades].sort((a, b) => (b.porcentaje ?? 0) - (a.porcentaje ?? 0))[0]
    if (!top) return null
    return `Las mujeres trans y travestis representan el ${top.porcentaje?.toFixed(1)}% de las víctimas${anio ? ` en ${anio}` : ', siendo el grupo más afectado en todos los años relevados'}.`
  }, [identidades, anio])

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-zinc-500 text-sm">Cargando datos...</div>

  return (
    <PageShell
      title="Las víctimas"
      description="Identidad y distribución etaria de las personas afectadas por crímenes de odio."
      años={años}
      anio={anio}
      onAnioChange={setAnio}
    >
      {insightIdentidad && (
        <p className="text-violet-300 text-sm bg-violet-950/40 border border-violet-800/40 rounded-xl px-5 py-3">
          {insightIdentidad}
        </p>
      )}
      <IdentidadChart data={identidades} anioSeleccionado={anio} />
      <IdentidadEvolucionChart data={data} años={años} />
      <RangoEtarioChart
        data={rangoEtario}
        subtitle={anio ? `Año ${anio}` : 'Datos agregados de todos los años'}
      />
    </PageShell>
  )
}
