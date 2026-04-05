"""
Parser para la sección "Modalidad de los crímenes de odio".

Dimensión: modalidad
Categorías esperadas: violencia_estructural, golpes, balazo, puñalada,
  estrangulamiento, abuso_sexual, fuego, corte, degüello, ahogo, otro
"""
from .base_parser import parse_entries


def parse(section_text: str) -> list[dict]:
    """
    Extrae la modalidad de crímenes del texto de la sección.

    Returns:
        Lista de {'dimension': 'modalidad', 'categoria_raw': str,
                  'conteo': int|None, 'porcentaje': float|None}
    """
    entries = parse_entries(section_text)
    return [{'dimension': 'modalidad', **e} for e in entries]
