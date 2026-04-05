"""
Parser para la sección "Identidades de las víctimas de crímenes de odio".

Dimensión: identidad_victima
Categorías esperadas: mujer_trans, gay_cis, varón_trans, lesbiana, no_binarie, otros
"""
from .base_parser import parse_entries


def parse(section_text: str) -> list[dict]:
    """
    Extrae los registros de identidad de víctimas del texto de la sección.

    Returns:
        Lista de {'dimension': 'identidad_victima', 'categoria_raw': str,
                  'conteo': int|None, 'porcentaje': float|None}
    """
    entries = parse_entries(section_text)
    return [{'dimension': 'identidad_victima', **e} for e in entries]
