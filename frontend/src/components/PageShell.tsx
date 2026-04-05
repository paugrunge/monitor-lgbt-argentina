import type { ReactNode } from 'react'
import { YearFilter } from './YearFilter'

type Props = {
  title: string
  description: string
  años: number[]
  anio: number | null
  onAnioChange: (a: number | null) => void
  children: ReactNode
}

export function PageShell({ title, description, años, anio, onAnioChange, children }: Props) {
  return (
    <main className="px-4 sm:px-6 py-8 sm:py-10 max-w-6xl mx-auto space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-zinc-400 text-base max-w-2xl">{description}</p>
      </section>
      <div className="flex items-center gap-4">
        <span className="text-zinc-500 text-sm">Filtrar por año:</span>
        <YearFilter años={años} value={anio} onChange={onAnioChange} />
      </div>
      <div className="space-y-6">{children}</div>
    </main>
  )
}
