"""
Detecta qué páginas del PDF corresponden a cada sección de datos,
usando patrones de encabezado presentes en todos los informes (2016–2025).
"""
import re

# Cada clave es el nombre canónico de la dimensión; el valor es un patrón
# que coincide con el encabezado de esa sección en el PDF.
SECTION_PATTERNS: dict[str, str] = {
    'identidad_victima': (
        r'[Ii]dentidades?\s+de\s+las?\s+v[íi]ctimas?\s+de\s+cr[íi]menes?'
    ),
    'tipo_violacion': (
        r'[Dd]erechos?\s+lesionados?\s+en\s+los?\s+cr[íi]menes?'
    ),
    'tipo_muerte': (
        r'[Ll]esiones?\s+al\s+derecho\s+a\s+la\s+vida'
    ),
    'modalidad': (
        r'[Mm]odalidad\s+de\s+los?\s+cr[íi]menes?'
    ),
    'autoria': (
        r'[Aa]uto[rí][ií]a\s+de\s+las?\s+lesiones?'
    ),
    'vinculo_agresor': (
        r'[Vv][íi]nculo\s+de\s+las?\s+v[íi]ctimas?\s+con'
    ),
    'rango_etario': (
        r'[Dd]istribuci[óo]n\s+etaria'
    ),
    'provincia': (
        r'[Dd]istribuci[óo]n\s+geogr[áa]fica'
    ),
    'lugar_fisico': (
        r'[Ll]ugar\s+f[íi]sico\s+donde'
    ),
}

# Compilamos una vez para eficiencia
_COMPILED: dict[str, re.Pattern] = {
    name: re.compile(pattern, re.IGNORECASE)
    for name, pattern in SECTION_PATTERNS.items()
}


def detect_sections(pages: dict[int, str]) -> dict[str, list[int]]:
    """
    Dado el texto por página, retorna qué página(s) inician cada sección.

    Filtra automáticamente las páginas de índice/TOC: una página que contiene
    5 o más encabezados de sección distintos es probablemente el índice y se
    excluye de los resultados.

    Args:
        pages: {número_página: texto} devuelto por extract_text_pages().

    Returns:
        {nombre_dimension: [lista de números de página donde aparece]}.
    """
    # Regex para detectar una coincidencia tipo TOC: encabezado seguido de nro. de página
    # Ej: "Distribución geográfica 25\n" o "9. Distribución geográfica.....25"
    _TOC_SUFFIX = re.compile(r'\s+\.{0,20}\s*\d{1,3}\s*$', re.MULTILINE)

    # Conteo de cuántas secciones distintas aparecen en cada página
    page_section_count: dict[int, int] = {p: 0 for p in pages}
    raw_matches: dict[str, list[int]] = {name: [] for name in SECTION_PATTERNS}

    for page_num, text in pages.items():
        for name, pattern in _COMPILED.items():
            m = pattern.search(text)
            if not m:
                continue
            # Extraer la línea completa donde ocurrió la coincidencia
            line_start = text.rfind('\n', 0, m.start()) + 1
            line_end = text.find('\n', m.end())
            if line_end == -1:
                line_end = len(text)
            full_line = text[line_start:line_end].strip()
            # Una línea de TOC termina con uno o dos dígitos (número de página)
            if re.search(r'\s+\d{1,3}\s*$', full_line):
                continue  # Es una entrada del índice, ignorar

            raw_matches[name].append(page_num)
            page_section_count[page_num] += 1

    # Páginas con muchos encabezados = índice/TOC → excluir por seguridad
    TOC_THRESHOLD = 4
    toc_pages = {p for p, cnt in page_section_count.items() if cnt >= TOC_THRESHOLD}

    sections: dict[str, list[int]] = {}
    for name, pnums in raw_matches.items():
        filtered = [p for p in pnums if p not in toc_pages]
        sections[name] = filtered

    return sections


def get_section_text(
    pages: dict[int, str],
    sections: dict[str, list[int]],
    dimension: str,
) -> str:
    """
    Extrae solo el fragmento de texto correspondiente a una sección.

    Estrategia:
    - Obtiene la primera página donde aparece la sección.
    - Extrae el texto desde el encabezado de esa sección hasta el encabezado
      de la siguiente sección que aparezca en la misma página (o en páginas
      subsiguientes hasta el próximo salto de sección).

    Si no se detectó la sección, retorna cadena vacía.
    """
    page_nums = sections.get(dimension, [])
    if not page_nums:
        return ''

    start_page = page_nums[0]

    # Construir un set con todos los números de página de inicio de cualquier sección
    all_section_starts: set[int] = set()
    for dim, pnums in sections.items():
        if dim != dimension and pnums:
            all_section_starts.update(pnums)

    # Recoger páginas desde start_page hasta la siguiente sección diferente
    result_pages = []
    for pnum in sorted(pages.keys()):
        if pnum < start_page:
            continue
        if pnum > start_page and pnum in all_section_starts:
            break
        result_pages.append(pages[pnum])

    full_text = '\n'.join(result_pages)

    # Recortar el texto desde el encabezado de la sección
    pattern = _COMPILED.get(dimension)
    if pattern:
        m = pattern.search(full_text)
        if m:
            full_text = full_text[m.start():]

    # Recortar el texto en el primer encabezado de otra sección
    for other_dim, other_pattern in _COMPILED.items():
        if other_dim == dimension:
            continue
        m2 = other_pattern.search(full_text)
        if m2 and m2.start() > 50:   # margen: no cortar en el mismo encabezado
            full_text = full_text[:m2.start()]

    return full_text
