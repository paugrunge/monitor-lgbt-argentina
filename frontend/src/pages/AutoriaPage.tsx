import { useMemo, useState } from 'react'
import { useData } from '../context/EstadisticasContext'
import { PageShell } from '../components/PageShell'
import { DimensionBarChart } from '../components/DimensionBarChart'
import { agregarTodosLosAnios } from '../lib/utils'

export function AutoriaPage() {
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
      title="Autoría y contexto"
      description="Quién perpetra los crímenes, el vínculo con la víctima y el lugar donde ocurren."
      años={años}
      anio={anio}
      onAnioChange={setAnio}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DimensionBarChart
          dimension="autoria"
          data={filtrar('autoria')}
          title="Autoría"
          subtitle={anio ? `Año ${anio}` : 'Último dato disponible'}
          color="#7c3aed"
        />
        <DimensionBarChart
          dimension="vinculo_agresor"
          data={filtrar('vinculo_agresor')}
          title="Vínculo víctima-agresor"
          subtitle={anio ? `Año ${anio}` : 'Último dato disponible'}
          color="#6d28d9"
        />
      </div>
      <DimensionBarChart
        dimension="lugar_fisico"
        data={filtrar('lugar_fisico')}
        title="Lugar físico"
        subtitle={anio ? `Año ${anio}` : 'Último dato disponible por lugar'}
        color="#8b5cf6"
      />
    </PageShell>
  )
}
