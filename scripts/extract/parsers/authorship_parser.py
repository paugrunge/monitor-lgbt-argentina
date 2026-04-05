"""
Parser para la sección "Autoría de las lesiones al derecho a la vida
y a la integridad física".

Dimensión: autoria
Categorías esperadas: persona_privada, estado, fuerzas_seguridad
"""
from .base_parser import parse_entries


def parse(section_text: str) -> list[dict]:
    """
    Extrae el desglose de autoría del texto de la sección.

    Returns:
        Lista de {'dimension': 'autoria', 'categoria_raw': str,
                  'conteo': int|None, 'porcentaje': float|None}
    """
    entries = parse_entries(section_text)
    return [{'dimension': 'autoria', **e} for e in entries]
