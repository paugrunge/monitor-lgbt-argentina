"""
Patrones regex y utilidades comunes para extraer pares
(categoría, conteo, porcentaje) del texto narrativo de los informes.

Los PDFs del Observatorio presentan los datos en tres formatos principales:

  Formato A (prosa con conteo):
    "el 84% de los casos (108) corresponden a mujeres trans"
    "el 12% (15) se encuentran los varones gays cis"

  Formato B (gráfico de torta como texto):
    "Mujeres trans (142)  62,56%"
    "Gays (50)  22,03%"

  Formato C (prosa sin conteo):
    "con el 24% de los casos ocurrieron en la provincia de Buenos Aires"
    "Le sigue con el 10,1% la provincia de Santiago del Estero"
"""
import re

# ---------------------------------------------------------------------------
# Formato A — el NN% [de los casos] (N) [corresponden a / son / etc.] CATEGORÍA
# ---------------------------------------------------------------------------
_FMT_A = re.compile(
    r'el\s+'
    r'(\d{1,3}(?:[,.]\d+)?)\s*%'           # grupo 1: porcentaje
    r'(?:\s+de\s+los?\s+casos?)?\s*'
    r'\((\d+)\)'                             # grupo 2: conteo
    r'(?:\s*(?:corresponden?\s+a|son|est[áa]n|se\s+encuentran?|'
    r'respecto\s+a|de\s+los?\s+casos?\s+(?:corresponden?\s+(?:a|las?)?)?))?\s*'
    r'(?:a\s+)?'
    r'([^.;\n]{3,80})',                      # grupo 3: categoría (texto)
    re.IGNORECASE,
)

# ---------------------------------------------------------------------------
# Formato B — CATEGORÍA (N)  NN,NN%   (texto de gráfico de torta)
# ---------------------------------------------------------------------------
_FMT_B = re.compile(
    r'^([A-ZÁÉÍÓÚÑ][^(]{2,60}?)\s+'         # grupo 1: categoría
    r'\((\d+)\)\s+'                          # grupo 2: conteo
    r'(\d{1,3}(?:[,.]\d+)?)\s*%',           # grupo 3: porcentaje
    re.IGNORECASE | re.MULTILINE,
)

# ---------------------------------------------------------------------------
# Formato C — con el NN% [de los casos] [PREPOSICION] CATEGORÍA
# Usado especialmente en distribución geográfica y franjas etarias.
# ---------------------------------------------------------------------------
_FMT_C = re.compile(
    r'(?:con\s+el\s+|con\s+)'
    r'(\d{1,3}(?:[,.]\d+)?)\s*%'            # grupo 1: porcentaje
    r'(?:\s+de\s+los?\s+casos?)?\s*'
    r'(?:(?:la\s+provincia\s+de\s+|'
    r'las?\s+provincias?\s+de\s+|'
    r'la\s+franja\s+etaria\s+de\s+|'
    r'la\s+franja\s+de\s+|'
    r'los?\s+casos\s+de\s+|'
    r'(?:se\s+)?encuentran?\s+)?)'
    r'([^.;,\n]{3,80})',                     # grupo 2: categoría
    re.IGNORECASE,
)

# ---------------------------------------------------------------------------
# Formato D — porcentaje al inicio: "NN,NN% (N) CATEGORÍA"
# Presente en algunos informes tempranos (2016-2018).
# ---------------------------------------------------------------------------
_FMT_D = re.compile(
    r'(\d{1,3}(?:[,.]\d+)?)\s*%\s*'        # grupo 1: porcentaje
    r'(?:\((\d+)\)\s*)?'                    # grupo 2: conteo (opcional)
    r'([A-Za-záéíóúÁÉÍÓÚñÑ][^.\n;]{3,60})', # grupo 3: categoría
    re.IGNORECASE,
)


def _pct_to_float(raw: str) -> float | None:
    """Convierte '84,5' o '84.5' a float. Retorna None si falla."""
    try:
        return float(raw.replace(',', '.'))
    except ValueError:
        return None


def parse_entries(text: str) -> list[dict]:
    """
    Intenta extraer todos los registros de datos de un bloque de texto.

    Aplica los formatos en orden de prioridad (A > B > D > C) y
    desduplicar por categoría (mantiene la primera ocurrencia).

    Returns:
        Lista de dicts: {'categoria_raw': str, 'conteo': int|None,
                         'porcentaje': float|None}
    """
    results: list[dict] = []
    seen_cats: set[str] = set()

    def _add(cat_raw: str, count_raw: str | None, pct_raw: str) -> None:
        cat = cat_raw.strip().rstrip('.,;:').strip()
        cat_lower = cat.lower()
        if not cat or cat_lower in seen_cats or len(cat) < 3:
            return
        seen_cats.add(cat_lower)
        results.append({
            'categoria_raw': cat,
            'conteo': int(count_raw) if count_raw else None,
            'porcentaje': _pct_to_float(pct_raw),
        })

    # Formato A
    for m in _FMT_A.finditer(text):
        _add(m.group(3), m.group(2), m.group(1))

    # Formato B
    for m in _FMT_B.finditer(text):
        _add(m.group(1), m.group(2), m.group(3))

    # Formato D
    for m in _FMT_D.finditer(text):
        _add(m.group(3), m.group(2), m.group(1))

    # Formato C (solo si no se encontró nada con los anteriores)
    if not results:
        for m in _FMT_C.finditer(text):
            _add(m.group(2), None, m.group(1))

    return results


def extract_total(text: str) -> int | None:
    """
    Busca el total anual de crímenes en el texto introductorio del informe.

    Ej.: "ocurrieron en Argentina ciento veintinueve (129) crímenes de odio"
         "se registraron 227 crímenes de odio"
    """
    # Número entre paréntesis seguido de "crímenes"
    m = re.search(r'\((\d+)\)\s+cr[íi]menes?\s+de\s+odio', text, re.IGNORECASE)
    if m:
        return int(m.group(1))
    # Número directo antes de "crímenes"
    m = re.search(r'(\d{2,4})\s+cr[íi]menes?\s+de\s+odio', text, re.IGNORECASE)
    if m:
        return int(m.group(1))
    return None
