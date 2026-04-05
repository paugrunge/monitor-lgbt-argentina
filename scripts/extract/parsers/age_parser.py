"""
Parser para la sección "Distribución etaria de los crímenes de odio".

Dimensión: rango_etario
Categorías esperadas: 10-19, 20-29, 30-39, 40-49, 50-59, 60-69, 70-79, 80+
"""
import re

from .base_parser import parse_entries, _pct_to_float


# Patrón específico para franjas etarias: "de entre 40 a 49 años con el 28,75%"
_AGE_RANGE = re.compile(
    r'(?:de\s+)?(?:entre\s+)?(\d{2})\s+(?:a|y)\s+(\d{2})\s+a[ñn]os?'
    r'[^%]*?(\d{1,3}(?:[,.]\d+)?)\s*%',
    re.IGNORECASE,
)

# Patrón para "de 20 a 29 años" al inicio de frase
_AGE_RANGE_ALT = re.compile(
    r'(\d{2})\s+a\s+(\d{2})\s+a[ñn]os?\s+con\s+el\s+'
    r'(\d{1,3}(?:[,.]\d+)?)\s*%',
    re.IGNORECASE,
)


def parse(section_text: str) -> list[dict]:
    """
    Extrae la distribución etaria del texto de la sección.

    Primero intenta el patrón específico de franjas etarias; si no encuentra
    suficientes resultados, cae al parser genérico.

    Returns:
        Lista de {'dimension': 'rango_etario', 'categoria_raw': str,
                  'conteo': int|None, 'porcentaje': float|None}
    """
    results = []
    seen = set()

    for pattern in (_AGE_RANGE, _AGE_RANGE_ALT):
        for m in pattern.finditer(section_text):
            cat = f'{m.group(1)}-{m.group(2)}'
            if cat not in seen:
                seen.add(cat)
                results.append({
                    'dimension': 'rango_etario',
                    'categoria_raw': cat,
                    'conteo': None,
                    'porcentaje': _pct_to_float(m.group(3)),
                })

    # Fallback al parser genérico si el específico no encontró nada
    if not results:
        entries = parse_entries(section_text)
        results = [{'dimension': 'rango_etario', **e} for e in entries]

    return results
