"""
Parser para la sección "Vínculo de las víctimas con agresores particulares".

Dimensión: vinculo_agresor
Categorías esperadas: desconocido, vecino_conocido, cliente_trabajo_sexual,
  pareja_noviazgo, familiar, otro
"""
from .base_parser import parse_entries


def parse(section_text: str) -> list[dict]:
    """
    Extrae el vínculo víctima-agresor del texto de la sección.

    Returns:
        Lista de {'dimension': 'vinculo_agresor', 'categoria_raw': str,
                  'conteo': int|None, 'porcentaje': float|None}
    """
    entries = parse_entries(section_text)
    return [{'dimension': 'vinculo_agresor', **e} for e in entries]
