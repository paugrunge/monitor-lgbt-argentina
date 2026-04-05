import { useEffect, useState } from 'react'
import { supabase, type Estadistica } from '../lib/supabase'

export function useEstadisticas() {
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

  return { data, loading, error }
}
