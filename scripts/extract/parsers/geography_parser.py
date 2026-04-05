"""
Parser para la sección "Distribución geográfica".

Dimensión: provincia
Categorías: las 23 provincias de Argentina + CABA
"""
import re

from .base_parser import parse_entries, _pct_to_float


# Listado de provincias para anclar los patrones
_PROVINCIAS = [
    'Buenos Aires', 'Ciudad Autónoma de Buenos Aires', 'CABA',
    'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
    'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
    'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta',
    'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
    'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
]

# Patrón para encontrar "el X% la provincia de Y" o "el X% Y" con nombre de provincia
_PROV_PATTERN = re.compile(
    r'(\d{1,3}(?:[,.]\d+)?)\s*%\s+'
    r'(?:la\s+provincia\s+de\s+|'
    r'la\s+[Cc]iudad\s+[Aa]ut[oó]noma\s+de\s+Buenos\s+Aires|'
    r'CABA\b)?'
    r'([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+(?:del?|de\s+la|[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+))*)',
    re.IGNORECASE,
)


def parse(section_text: str) -> list[dict]:
    """
    Extrae la distribución geográfica por provincia.

    Usa el parser genérico y el patrón específico de provincias.

    Returns:
        Lista de {'dimension': 'provincia', 'categoria_raw': str,
                  'conteo': int|None, 'porcentaje': float|None}
    """
    results = []
    seen: set[str] = set()

    # Intento con patrón específico de provincias
    for m in _PROV_PATTERN.finditer(section_text):
        cat = m.group(2).strip()
        # Verificar que la categoría parece un nombre de provincia
        if len(cat) < 3 or cat.lower() in seen:
            continue
        pct = _pct_to_float(m.group(1))
        if pct is not None and pct <= 100:
            seen.add(cat.lower())
            results.append({
                'dimension': 'provincia',
                'categoria_raw': cat,
                'conteo': None,
                'porcentaje': pct,
            })

    # Fallback al parser genérico si no se encontró nada
    if not results:
        entries = parse_entries(section_text)
        results = [{'dimension': 'provincia', **e} for e in entries]

    return results
