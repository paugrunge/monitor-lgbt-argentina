"""
Carga estadisticas_master.csv en Supabase.

Uso:
    cd scripts
    .venv/Scripts/python.exe seed_db.py

Requiere supabase instalado:
    .venv/Scripts/pip.exe install supabase python-dotenv
"""

import os
from pathlib import Path
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

# ---------------------------------------------------------------------------
# Configuración
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).parent.parent
CSV_PATH = BASE_DIR / 'data' / 'processed' / 'estadisticas_master.csv'

load_dotenv(Path(__file__).parent / '.env')
SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_KEY']


def _val(v):
    """Convierte NaN a None para JSON/Supabase."""
    if pd.isna(v):
        return None
    return v


def main():
    print(f"Leyendo {CSV_PATH} ...")
    df = pd.read_csv(CSV_PATH, encoding='utf-8-sig')
    print(f"  {len(df)} filas cargadas.")

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # -----------------------------------------------------------------------
    # 1. Insertar reportes (uno por año/período único)
    # -----------------------------------------------------------------------
    print("\nInsertando reportes ...")
    reportes_map: dict[tuple, int] = {}

    for (anio, periodo), _ in df.groupby(['anio', 'periodo']):
        existing = (
            supabase.table('reportes')
            .select('id')
            .eq('anio', int(anio))
            .eq('periodo', periodo)
            .execute()
        )
        if existing.data:
            reporte_id = existing.data[0]['id']
            print(f"  {anio} {periodo} -> reporte_id={reporte_id} (existente)")
        else:
            res = (
                supabase.table('reportes')
                .insert({'anio': int(anio), 'periodo': periodo, 'semestre': None})
                .execute()
            )
            reporte_id = res.data[0]['id']
            print(f"  {anio} {periodo} -> reporte_id={reporte_id}")
        reportes_map[(int(anio), periodo)] = reporte_id

    # -----------------------------------------------------------------------
    # 2. Insertar estadísticas en lotes de 100
    # -----------------------------------------------------------------------
    print("\nInsertando estadisticas ...")
    registros: dict[tuple, dict] = {}

    for _, row in df.iterrows():
        reporte_id = reportes_map[(int(row['anio']), row['periodo'])]
        key = (reporte_id, row['dimension'], row['categoria'])
        registros[key] = {
            'reporte_id': reporte_id,
            'dimension':  row['dimension'],
            'categoria':  row['categoria'],
            'conteo':     _val(row['conteo']) and int(_val(row['conteo'])),
            'porcentaje': _val(row['porcentaje']) and float(_val(row['porcentaje'])),
            'total_anual': _val(row['total_anual']) and int(_val(row['total_anual'])),
        }

    lista = list(registros.values())
    BATCH = 100
    total = len(lista)
    for i in range(0, total, BATCH):
        lote = lista[i:i + BATCH]
        supabase.table('estadisticas').upsert(
            lote,
            on_conflict='reporte_id,dimension,categoria',
        ).execute()
        print(f"  {min(i + BATCH, total)}/{total} filas insertadas ...")

    print(f"\nListo. {total} estadisticas cargadas en Supabase.")


if __name__ == '__main__':
    main()
