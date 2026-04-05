"""
Wrapper de pdfplumber para extraer texto page-by-page de los informes PDF
del Observatorio Nacional de Crímenes de Odio LGBT+.
"""
import re
from pathlib import Path

import pdfplumber


def _clean_text(text: str) -> str:
    """
    Limpia artefactos comunes de extracción PDF:
    - Palabras fusionadas: "provinciadeSantiago" → "provincia de Santiago"
    - Espacios múltiples
    """
    # Separar palabras fusionadas (minúscula seguida de mayúscula)
    text = re.sub(r'([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])', r'\1 \2', text)
    # Colapsar espacios múltiples
    text = re.sub(r' {2,}', ' ', text)
    return text


def extract_text_pages(pdf_path: str | Path) -> dict[int, str]:
    """
    Extrae el texto de cada página del PDF.

    Args:
        pdf_path: Ruta al archivo PDF.

    Returns:
        Diccionario {número_página (1-indexed): texto_extraído}.
        Las páginas sin texto extraíble se omiten.
    """
    pages: dict[int, str] = {}
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages, start=1):
            text = page.extract_text(x_tolerance=3, y_tolerance=3)
            if text and text.strip():
                pages[i] = _clean_text(text)
    return pages


def extract_year_from_filename(filename: str) -> int | None:
    """
    Extrae el año de cuatro dígitos del nombre del archivo.

    Ejemplos:
        'Informe anual 2022.pdf'  → 2022
        'INFORME SEMESTRAL 2021.pdf' → 2021
    """
    match = re.search(r'(20\d{2})', filename)
    return int(match.group(1)) if match else None


def is_semestral(filename: str) -> bool:
    """Retorna True si el informe es semestral."""
    return 'SEMESTRAL' in filename.upper()


def get_report_meta(pdf_path: str | Path) -> dict:
    """
    Devuelve metadatos básicos del informe a partir del nombre de archivo.

    Returns:
        {'anio': int, 'periodo': 'anual'|'semestral', 'filename': str}
    """
    path = Path(pdf_path)
    anio = extract_year_from_filename(path.name)
    periodo = 'semestral' if is_semestral(path.name) else 'anual'
    return {'anio': anio, 'periodo': periodo, 'filename': path.name}
