import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase, type Estadistica } from '../lib/supabase'

type ContextValue = {
  data: Estadistica[]
  loading: boolean
  error: string | null
}

const EstadisticasContext = createContext<ContextValue>({
  data: [],
  loading: true,
  error: null,
})

export function EstadisticasProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Estadistica[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('v_estadisticas')
      .select('*')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setData(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <EstadisticasContext.Provider value={{ data, loading, error }}>
      {children}
    </EstadisticasContext.Provider>
  )
}

export function useData() {
  return useContext(EstadisticasContext)
}
