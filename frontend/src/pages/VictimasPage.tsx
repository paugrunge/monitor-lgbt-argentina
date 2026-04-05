import { useMemo, useState } from 'react'
import { useData } from '../context/EstadisticasContext'
import { PageShell } from '../components/PageShell'
import { IdentidadChart } from '../components/IdentidadChart'
import { DimensionBarChart } from '../components/DimensionBarChart'
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

  if (loading) return <div className="p-10 text-zinc-500">Cargando...</div>

  return (
    <PageShell
      title="Las víctimas"
      description="Identidad y distribución etaria de las personas afectadas por crímenes de odio."
      años={años}
      anio={anio}
      onAnioChange={setAnio}
    >
      <IdentidadChart data={filtrar('identidad_victima')} anioSeleccionado={anio} />
      <DimensionBarChart
        dimension="rango_etario"
        data={filtrar('rango_etario')}
        title="Distribución etaria"
        subtitle={anio ? `Año ${anio}` : 'Último dato disponible por rango'}
        color="#8b5cf6"
      />
    </PageShell>
  )
}
