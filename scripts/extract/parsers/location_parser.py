"""
Parser para la sección "Lugar físico donde tuvo lugar el crimen de odio".

Dimensión: lugar_fisico
Categorías esperadas: via_publica, vivienda_victima, vivienda_agresor,
  vivienda_compartida, establecimiento_privado, establecimiento_publico,
  comisaria_penal, descampado, vehiculo, ruta, otro
"""
from .base_parser import parse_entries


def parse(section_text: str) -> list[dict]:
    """
    Extrae la distribución por lugar físico del texto de la sección.

    Returns:
        Lista de {'dimension': 'lugar_fisico', 'categoria_raw': str,
                  'conteo': int|None, 'porcentaje': float|None}
    """
    entries = parse_entries(section_text)
    return [{'dimension': 'lugar_fisico', **e} for e in entries]
