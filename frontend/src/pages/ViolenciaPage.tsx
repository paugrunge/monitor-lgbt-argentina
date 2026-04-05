import { useMemo, useState } from 'react'
import { useData } from '../context/EstadisticasContext'
import { PageShell } from '../components/PageShell'
import { DimensionBarChart } from '../components/DimensionBarChart'
import { agregarTodosLosAnios } from '../lib/utils'

export function ViolenciaPage() {
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
      title="Cómo ocurre la violencia"
      description="Derechos lesionados, tipo de muerte y modalidades de los crímenes de odio."
      años={años}
      anio={anio}
      onAnioChange={setAnio}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DimensionBarChart
          dimension="tipo_violacion"
          data={filtrar('tipo_violacion')}
          title="Derechos lesionados"
          subtitle={anio ? `Año ${anio}` : 'Último dato disponible'}
          color="#7c3aed"
        />
        <DimensionBarChart
          dimension="tipo_muerte"
          data={filtrar('tipo_muerte')}
          title="Tipo de muerte"
          subtitle={anio ? `Año ${anio}` : 'Último dato disponible'}
          color="#6d28d9"
        />
      </div>
      <DimensionBarChart
        dimension="modalidad"
        data={filtrar('modalidad')}
        title="Modalidad del crimen"
        subtitle={anio ? `Año ${anio}` : 'Último dato disponible por modalidad'}
        color="#8b5cf6"
      />
    </PageShell>
  )
}
