import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY as string

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export type Estadistica = {
  anio: number
  periodo: string
  dimension: string
  categoria: string
  conteo: number | null
  porcentaje: number | null
  total_anual: number | null
}
