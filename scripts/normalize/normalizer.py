"""
Normaliza los registros extraídos de cada PDF al esquema unificado.

Esquema de salida (por fila en el CSV final):
  anio, periodo, dimension, categoria_raw, categoria, conteo, porcentaje, total_anual
"""
from .category_maps import DIMENSION_MAPS


def normalize_categoria(dimension: str, categoria_raw: str) -> str:
    """
    Aplica el mapa de la dimensión para obtener el nombre canónico.

    Si no existe coincidencia exacta, retorna la categoría en snake_case
    como mejor estimación (útil para datos nuevos no mapeados aún).
    """
    cmap = DIMENSION_MAPS.get(dimension, {})
    key = categoria_raw.strip().lower()

    # Coincidencia exacta
    if key in cmap:
        return cmap[key]

    # Coincidencia parcial: verificar si alguna clave está contenida en el texto
    for k, v in cmap.items():
        if k in key or key in k:
            return v

    # Fallback: snake_case del texto original
    return (
        key
        .replace(' ', '_')
        .replace('/', '_')
        .replace(',', '')
        .replace('.', '')
        .replace('á', 'a').replace('é', 'e').replace('í', 'i')
        .replace('ó', 'o').replace('ú', 'u').replace('ñ', 'n')
    )


def normalize_records(
    raw_records: list[dict],
    meta: dict,
    total_anual: int | None,
) -> list[dict]:
    """
    Transforma los registros crudos en registros normalizados.

    Args:
        raw_records: Lista de dicts con campos:
                     {dimension, categoria_raw, conteo, porcentaje}
        meta:        {'anio': int, 'periodo': str, 'filename': str}
        total_anual: Total de crímenes del informe (puede ser None).

    Returns:
        Lista de dicts con el esquema unificado.
    """
    normalized = []
    for rec in raw_records:
        dimension = rec.get('dimension', '')
        categoria_raw = rec.get('categoria_raw', '')
        if not categoria_raw:
            continue
        normalized.append({
            'anio': meta.get('anio'),
            'periodo': meta.get('periodo'),
            'dimension': dimension,
            'categoria_raw': categoria_raw,
            'categoria': normalize_categoria(dimension, categoria_raw),
            'conteo': rec.get('conteo'),
            'porcentaje': rec.get('porcentaje'),
            'total_anual': total_anual,
        })
    return normalized
