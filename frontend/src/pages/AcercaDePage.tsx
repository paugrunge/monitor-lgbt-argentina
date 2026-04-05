import { useMemo } from 'react'
import { ExternalLink } from 'lucide-react'
import { useData } from '../context/EstadisticasContext'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="text-zinc-400 text-sm leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors"
    >
      {children}
      <ExternalLink size={12} />
    </a>
  )
}

export function AcercaDePage() {
  const { data } = useData()
  const años = useMemo(() => [...new Set(data.map((d) => d.anio))].sort(), [data])
  const primerAnio = años[0] ?? 2016
  const ultimoAnio = años[años.length - 1] ?? 2025

  return (
    <main className="px-6 py-10 max-w-3xl mx-auto space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold text-white">Acerca de este proyecto</h1>
        <p className="text-zinc-400 text-base leading-relaxed">
          Monitor LGBT+ Argentina es una plataforma de visualización de datos sobre crímenes de odio
          y discriminación hacia la comunidad LGBT+ en Argentina, basada en los informes anuales del
          Observatorio Nacional de Crímenes de Odio LGBT+.
        </p>
      </section>

      <div className="border-t border-zinc-800" />

      <Section title="Fuente de datos">
        <p>
          Los datos provienen de los informes publicados por el{' '}
          <Link href="https://falgbt.org/crimenes-de-odio/">
            Observatorio Nacional de Crímenes de Odio LGBT+
          </Link>
          , una iniciativa de la{' '}
          <Link href="https://falgbt.org/">
            Federación Argentina de Lesbianas, Gays, Bisexuales y Trans (FALGBT)
          </Link>
          .
        </p>
        <p>
          Los informes cubren el período {primerAnio}–{ultimoAnio} y registran casos de violencia por odio a la
          orientación sexual e identidad de género, incluyendo asesinatos, suicidios vinculados a
          la discriminación y otras formas de violencia física.
        </p>
      </Section>

      <Section title="Metodología">
        <p>
          Los informes del Observatorio no contienen tablas estructuradas: los datos estadísticos
          están embebidos en texto narrativo. Para construir esta plataforma se desarrolló un
          pipeline de extracción en Python que lee cada PDF con{' '}
          <Link href="https://github.com/jsvine/pdfplumber">pdfplumber</Link> y extrae los valores
          mediante expresiones regulares.
        </p>
        <p>
          Los datos extraídos fueron verificados y corregidos manualmente consultando cada informe
          original. El dataset final cubre 9 dimensiones de análisis a lo largo de 10 años: identidad
          de las víctimas, tipo de violación, tipo de muerte, modalidad, autoría, vínculo agresor,
          rango etario, provincia y lugar físico.
        </p>
      </Section>

      <Section title="Limitaciones">
        <p>
          Los datos reflejan únicamente los casos documentados por organizaciones de la sociedad
          civil. El subregistro es una realidad estructural: muchos crímenes de odio no son
          denunciados, no son tipificados correctamente o no llegan a ser documentados.
        </p>
        <p>
          Las cifras deben interpretarse como un piso mínimo, no como una medida exhaustiva de la
          violencia hacia la comunidad LGBT+ en Argentina.
        </p>
      </Section>

      <Section title="Código abierto">
        <p>
          El código fuente de esta plataforma está disponible en{' '}
          <Link href="https://github.com/paugrunge/monitor-lgbt-argentina">
            github.com/paugrunge/monitor-lgbt-argentina
          </Link>
          . Incluye el pipeline de extracción de datos, el dataset procesado y el frontend React.
        </p>
      </Section>

      <div className="border-t border-zinc-800" />

      <p className="text-zinc-600 text-xs">
        Este proyecto no tiene afiliación oficial con la FALGBT ni con el Observatorio. Es una
        iniciativa independiente para facilitar el acceso a datos que ya son públicos.
      </p>
    </main>
  )
}
