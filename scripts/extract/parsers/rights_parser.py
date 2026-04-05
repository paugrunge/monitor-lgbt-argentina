"""
Parser para las secciones:
  - "Derechos lesionados en los crímenes de odio"  → dimensión: tipo_violacion
  - "Lesiones al derecho a la vida"                → dimensión: tipo_muerte
"""
from .base_parser import parse_entries


def parse_tipo_violacion(section_text: str) -> list[dict]:
    """
    Extrae el split vida vs. integridad física.

    Categorías esperadas: derecho_a_la_vida, integridad_fisica
    """
    entries = parse_entries(section_text)
    return [{'dimension': 'tipo_violacion', **e} for e in entries]


def parse_tipo_muerte(section_text: str) -> list[dict]:
    """
    Extrae el desglose de muertes: asesinato, muerte_estructural, suicidio.
    """
    entries = parse_entries(section_text)
    return [{'dimension': 'tipo_muerte', **e} for e in entries]
