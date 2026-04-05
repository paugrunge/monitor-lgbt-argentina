"""
Orquestador principal del pipeline de extracción.

Uso:
    python main.py [--pdf PATH] [--debug]

Sin argumentos procesa todos los PDFs en ../Informes_Obervatorio/.
Con --pdf procesa un único archivo (útil para depuración).
Con --debug imprime los datos extraídos por sección en stdout.

Produce:
    ../data/raw/<anio>_<periodo>.json     — datos extraídos por informe
    ../data/processed/estadisticas.csv   — dataset unificado normalizado
    ../data/processed/estadisticas.json  — ídem en JSON
"""
import argparse
import json
import sys
from pathlib import Path

import pandas as pd

# Ajuste del path para importar módulos hermanos
sys.path.insert(0, str(Path(__file__).parent))

from extract.pdf_extractor import extract_text_pages, get_report_meta
from extract.section_detector import detect_sections, get_section_text
from extract.parsers import (
    identity_parser,
    rights_parser,
    modality_parser,
    authorship_parser,
    relationship_parser,
    age_parser,
    geography_parser,
    location_parser,
)
from extract.parsers.base_parser import extract_total
from normalize.normalizer import normalize_records

# ---------------------------------------------------------------------------
# Rutas base (relativas a este script)
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).parent.parent
PDF_DIR = BASE_DIR / 'Informes_Obervatorio'
RAW_DIR = BASE_DIR / 'data' / 'raw'
PROCESSED_DIR = BASE_DIR / 'data' / 'processed'


def process_pdf(pdf_path: Path, debug: bool = False) -> list[dict]:
    """
    Pipeline completo para un PDF:
      1. Extrae texto por página (pdfplumber)
      2. Detecta qué páginas corresponden a cada sección
      3. Parsea cada sección con su parser especializado
      4. Normaliza los registros al esquema canónico

    Args:
        pdf_path: Ruta al PDF a procesar.
        debug:    Si True, imprime diagnósticos por sección.

    Returns:
        Lista de registros normalizados (dicts con el esquema unificado).
    """
    meta = get_report_meta(pdf_path)
    print(f"  >> Procesando {pdf_path.name}  [{meta['anio']} / {meta['periodo']}]")

    pages = extract_text_pages(pdf_path)
    if not pages:
        print(f"    [!] No se pudo extraer texto de {pdf_path.name}")
        return []

    sections = detect_sections(pages)
    full_text = '\n'.join(pages.values())
    total_anual = extract_total(full_text)

    if debug:
        print(f"    Secciones detectadas: {[k for k, v in sections.items() if v]}")
        print(f"    Total anual detectado: {total_anual}")

    # --- Parseo por sección ---
    raw_records: list[dict] = []

    _parse_section(
        sections, pages, 'identidad_victima',
        identity_parser.parse, raw_records, debug,
    )
    _parse_section(
        sections, pages, 'tipo_violacion',
        rights_parser.parse_tipo_violacion, raw_records, debug,
    )
    _parse_section(
        sections, pages, 'tipo_muerte',
        rights_parser.parse_tipo_muerte, raw_records, debug,
    )
    _parse_section(
        sections, pages, 'modalidad',
        modality_parser.parse, raw_records, debug,
    )
    _parse_section(
        sections, pages, 'autoria',
        authorship_parser.parse, raw_records, debug,
    )
    _parse_section(
        sections, pages, 'vinculo_agresor',
        relationship_parser.parse, raw_records, debug,
    )
    _parse_section(
        sections, pages, 'rango_etario',
        age_parser.parse, raw_records, debug,
    )
    _parse_section(
        sections, pages, 'provincia',
        geography_parser.parse, raw_records, debug,
    )
    _parse_section(
        sections, pages, 'lugar_fisico',
        location_parser.parse, raw_records, debug,
    )

    # --- Normalización ---
    normalized = normalize_records(raw_records, meta, total_anual)
    print(f"    OK {len(normalized)} registros extraidos")
    return normalized


def _parse_section(
    sections: dict,
    pages: dict,
    dimension: str,
    parser_fn,
    output: list,
    debug: bool,
) -> None:
    """Extrae el texto de una sección, la parsea y agrega al output."""
    text = get_section_text(pages, sections, dimension)
    if not text:
        if debug:
            print(f"    [!] Seccion '{dimension}' no detectada")
        return
    records = parser_fn(text)
    if debug and records:
        print(f"    [{dimension}] -> {len(records)} items")
        for r in records:
            conteo = str(r.get('conteo') or '?')
            pct = str(r.get('porcentaje') or '?')
            cat = repr(r['categoria_raw'])[:50]
            print(f"      {cat:<52} {conteo:>5} | {pct}%")
    output.extend(records)


def save_raw(records: list[dict], meta: dict) -> None:
    """Guarda los registros de un informe como JSON crudo en data/raw/."""
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    suffix = f"{meta['anio']}_{meta['periodo']}"
    out_path = RAW_DIR / f"{suffix}.json"
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump({'meta': meta, 'records': records}, f, ensure_ascii=False, indent=2)
    print(f"    >> Guardado: {out_path.relative_to(BASE_DIR)}")


def _is_noise(categoria: str) -> bool:
    """
    Detecta entradas de ruido: categorías que no se mapearon a un nombre
    canónico y cuyo texto normalizado parece fragmento de oración.
    """
    # Si la categoría normalizada tiene más de 4 palabras compuestas con _
    # es muy probable que sea un fragmento de oración no deseado
    words = categoria.split('_')
    if len(words) > 5:
        return True
    # Fragmentos típicos de ruido
    noise_starts = ('de_los', 'de_las', 'del_total', 'de_ellas', 'los_cuerpos',
                    'la_totalidad', 'a_establecimientos', 'se_encuentran',
                    'no_se_registran', 'en_2025', 'cada_una', 'restante',
                    'corresponde', 'equivale', 'esta_constituido', 'son_llevados')
    return any(categoria.startswith(ns) for ns in noise_starts)


def save_processed(all_records: list[dict]) -> None:
    """Genera el dataset unificado en CSV y JSON en data/processed/."""
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    df = pd.DataFrame(all_records)
    if df.empty:
        print("[!] No se generaron registros. Revisar los PDFs.")
        return

    # --- Filtrar ruido ---
    before = len(df)
    df = df[~df['categoria'].apply(_is_noise)]
    print(f"    (filtradas {before - len(df)} entradas de ruido de {before})")

    # --- Deduplicar: por (anio, periodo, dimension, categoria) ---
    # Priorizar filas con ambos conteo y porcentaje, luego por conteo no nulo
    df['_has_count'] = df['conteo'].notna().astype(int)
    df['_has_pct'] = df['porcentaje'].notna().astype(int)
    df['_score'] = df['_has_count'] + df['_has_pct']
    df = (df
          .sort_values('_score', ascending=False)
          .drop_duplicates(subset=['anio', 'periodo', 'dimension', 'categoria'],
                           keep='first')
          .drop(columns=['_has_count', '_has_pct', '_score']))

    # --- Orden de columnas ---
    cols = ['anio', 'periodo', 'dimension', 'categoria_raw',
            'categoria', 'conteo', 'porcentaje', 'total_anual']
    df = df[cols].sort_values(['anio', 'dimension', 'categoria'])

    csv_path = PROCESSED_DIR / 'estadisticas.csv'
    json_path = PROCESSED_DIR / 'estadisticas.json'

    df.to_csv(csv_path, index=False, encoding='utf-8-sig')
    df.to_json(json_path, orient='records', force_ascii=False, indent=2)

    print(f"\nDataset unificado guardado:")
    print(f"   {csv_path.relative_to(BASE_DIR)}  ({len(df)} filas)")
    print(f"   {json_path.relative_to(BASE_DIR)}")
    print(f"\n   Años cubiertos: {sorted(df['anio'].dropna().unique().astype(int).tolist())}")
    print(f"   Dimensiones:    {sorted(df['dimension'].unique().tolist())}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Extrae datos de los PDFs del Observatorio de Crímenes de Odio LGBT+'
    )
    parser.add_argument(
        '--pdf', type=Path, default=None,
        help='Procesar un único PDF (ruta completa o relativa)'
    )
    parser.add_argument(
        '--debug', action='store_true',
        help='Imprimir diagnósticos detallados por sección'
    )
    args = parser.parse_args()

    if args.pdf:
        pdfs = [args.pdf.resolve()]
    else:
        pdfs = sorted(PDF_DIR.glob('*.pdf'))
        if not pdfs:
            print(f"No se encontraron PDFs en {PDF_DIR}")
            sys.exit(1)

    print(f"Procesando {len(pdfs)} PDF(s)...\n")

    all_records: list[dict] = []
    for pdf in pdfs:
        records = process_pdf(pdf, debug=args.debug)
        if records:
            meta = get_report_meta(pdf)
            save_raw(records, meta)
            all_records.extend(records)

    save_processed(all_records)


if __name__ == '__main__':
    main()
