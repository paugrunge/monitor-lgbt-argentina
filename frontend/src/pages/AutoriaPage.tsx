import { useMemo, useState } from 'react'
import { useData } from '../context/EstadisticasContext'
import { PageShell } from '../components/PageShell'
import { DimensionBarChart } from '../components/DimensionBarChart'
import { DonutChart } from '../components/DonutChart'
import { agregarTodosLosAnios } from '../lib/utils'
import { getLabel } from '../lib/labels'

const AUTORIA_COLORS: Record<string, string> = {
  persona_privada:   '#a78bfa',  // violet-400
  estado:            '#fbbf24',  // amber-400
  fuerzas_seguridad: '#fb7185',  // rose-400
  si_mismo:          '#38bdf8',  // sky-400
  si_misme:          '#38bdf8',  // sky-400
  sin_dato:          '#71717a',  // zinc-500 — dato faltante, neutro
}

export function AutoriaPage() {
  const { data, loading } = useData()
  const [anio, setAnio] = useState<number | null>(null)

  const años = useMemo(() => [...new Set(data.map((d) => d.anio))].sort(), [data])

  const filtrar = (dimension: string) => {
    const filas = data.filter((d) => d.dimension === dimension)
    if (anio) return filas.filter((d) => d.anio === anio)
    return agregarTodosLosAnios(filas)
  }

  const autoriaData = useMemo(() =>
    filtrar('autoria').map((d) => ({
      name: getLabel('autoria', d.categoria),
      value: d.porcentaje ?? 0,
      conteo: d.conteo,
      color: AUTORIA_COLORS[d.categoria] ?? '#6d28d9',
    })),
    [data, anio],
  )

  const insightAutoria = useMemo(() => {
    const privados = filtrar('autoria').find((d) => d.categoria === 'persona_privada')
    if (!privados?.porcentaje) return undefined
    return `El ${privados.porcentaje.toFixed(1)}% de los crímenes son perpetrados por personas privadas${anio ? ` en ${anio}` : ''}.`
  }, [data, anio])

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
        <DonutChart
          data={autoriaData}
          title="Autoría"
          insight={insightAutoria}
        />
        <DimensionBarChart
          dimension="vinculo_agresor"
          data={filtrar('vinculo_agresor')}
          title="Vínculo víctima-agresor"
          subtitle={anio ? `Año ${anio}` : 'Datos agregados de todos los años'}
          color="#6d28d9"
        />
      </div>
      <DimensionBarChart
        dimension="lugar_fisico"
        data={filtrar('lugar_fisico')}
        title="Lugar físico"
        subtitle={anio ? `Año ${anio}` : 'Datos agregados de todos los años'}
        color="#8b5cf6"
      />
    </PageShell>
  )
}
