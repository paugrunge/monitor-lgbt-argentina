import { useMemo, useState } from 'react'
import { useData } from '../context/EstadisticasContext'
import { PageShell } from '../components/PageShell'
import { DimensionBarChart } from '../components/DimensionBarChart'
import { DonutChart } from '../components/DonutChart'
import { agregarTodosLosAnios } from '../lib/utils'
import { getLabel } from '../lib/labels'

const VIOLACION_COLORS: Record<string, string> = {
  derecho_a_la_vida: '#f87171',  // red-400
  asesinato:         '#f87171',  // red-400 — igual concepto, años 2016-2017
  integridad_fisica: '#fb923c',  // orange-400
  violencia_fisica:  '#fb923c',  // orange-400 — igual concepto, nombre alternativo
}

const MUERTE_COLORS: Record<string, string> = {
  asesinato:          '#fb7185',  // rose-400
  muerte_estructural: '#fbbf24',  // amber-400
  suicidio:           '#38bdf8',  // sky-400
}

export function ViolenciaPage() {
  const { data, loading } = useData()
  const [anio, setAnio] = useState<number | null>(null)

  const años = useMemo(() => [...new Set(data.map((d) => d.anio))].sort(), [data])

  const filtrar = (dimension: string) => {
    const filas = data.filter((d) => d.dimension === dimension)
    if (anio) return filas.filter((d) => d.anio === anio)
    return agregarTodosLosAnios(filas)
  }

  const violacionData = useMemo(() => {
    const merged = new Map<string, { value: number; conteo: number | null; color: string }>()
    filtrar('tipo_violacion').forEach((d) => {
      const name = getLabel('tipo_violacion', d.categoria)
      const color = VIOLACION_COLORS[d.categoria] ?? '#6d28d9'
      const existing = merged.get(name)
      if (!existing) {
        merged.set(name, { value: d.porcentaje ?? 0, conteo: d.conteo, color })
      } else {
        existing.value += d.porcentaje ?? 0
        existing.conteo = existing.conteo != null && d.conteo != null
          ? existing.conteo + d.conteo
          : existing.conteo ?? d.conteo
      }
    })
    return [...merged.entries()].map(([name, v]) => ({ name, ...v }))
  }, [data, anio])

  const muerteData = useMemo(() =>
    filtrar('tipo_muerte').map((d) => ({
      name: getLabel('tipo_muerte', d.categoria),
      value: d.porcentaje ?? 0,
      conteo: d.conteo,
      color: MUERTE_COLORS[d.categoria] ?? '#6d28d9',
    })),
    [data, anio],
  )

  const modalidadData = useMemo(() => filtrar('modalidad'), [data, anio])

  const insightViolacion = useMemo(() => {
    const vida = filtrar('tipo_violacion').find((d) => d.categoria === 'derecho_a_la_vida')
    if (!vida?.porcentaje) return undefined
    return `${vida.porcentaje.toFixed(1)}% de los crímenes lesionan el derecho a la vida${anio ? ` en ${anio}` : ''}.`
  }, [data, anio])

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-zinc-500 text-sm">Cargando datos...</div>

  return (
    <PageShell
      title="Cómo ocurre la violencia"
      description="Derechos lesionados, tipo de muerte y modalidades de los crímenes de odio."
      años={años}
      anio={anio}
      onAnioChange={setAnio}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DonutChart
          data={violacionData}
          title="Derechos lesionados"
          insight={insightViolacion}
        />
        <DonutChart
          data={muerteData}
          title="Tipo de muerte"
        />
      </div>
      <DimensionBarChart
        dimension="modalidad"
        data={modalidadData}
        title="Modalidad del crimen"
        subtitle={anio ? `Año ${anio}` : 'Datos agregados de todos los años'}
        color="#8b5cf6"
      />
    </PageShell>
  )
}
