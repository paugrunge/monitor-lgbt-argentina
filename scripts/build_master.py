"""
Genera el CSV maestro con datos verificados manualmente de los 10 informes PDF
del Observatorio Nacional de Crímenes de Odio LGBT+ (2016–2025).

Uso:
    python build_master.py

Produce:
    ../data/processed/estadisticas_master.csv
    ../data/processed/estadisticas_master.json

Los datos fueron extraídos leyendo cada PDF con pdftotext y pdfplumber,
y verificados contra los gráficos y texto de cada informe.
Donde un dato no pudo ser confirmado se omite (no se inventan valores).
"""
import json
from pathlib import Path

import pandas as pd

BASE_DIR = Path(__file__).parent.parent
PROCESSED_DIR = BASE_DIR / 'data' / 'processed'

# ---------------------------------------------------------------------------
# Datos maestros verificados manualmente por año/período
# Cada entrada: (dimension, categoria, conteo, porcentaje)
# conteo=None cuando el PDF solo reportó porcentaje
# porcentaje=None cuando solo se reportó conteo absoluto
# ---------------------------------------------------------------------------

MASTER_DATA: dict[tuple[int, str, int], list[tuple[str, str, int | None, float | None]]] = {}
# Clave: (anio, periodo, total_anual)

# ===== 2016 — anual — 31 casos =====
MASTER_DATA[(2016, 'anual', 31)] = [
    # identidad_victima
    ('identidad_victima', 'mujer_trans', None, 77.4),
    ('identidad_victima', 'lesbiana', None, 13.0),
    ('identidad_victima', 'gay_cis', None, 9.6),
    # tipo_violacion
    ('tipo_violacion', 'asesinato', 13, 42.0),
    ('tipo_violacion', 'violencia_fisica', 18, 58.0),
    # autoria (solo para violencia física, no para asesinatos)
    ('autoria', 'persona_privada', None, 66.6),
    ('autoria', 'fuerzas_seguridad', None, 33.4),
     # rango_etario 
    ('rango_etario', 'desconocido', None, 51.6),
    ('rango_etario', '20-29', None, 9.7),
    ('rango_etario', '30-39', None, 22.6),
    ('rango_etario', '40-49', None, 6.45),
    ('rango_etario', '50-59', None, 6.45),
    ('rango_etario', '60-69', None, 0.0),
    ('rango_etario', '70-79', None, 3.2),
    # provincia
    ('provincia', 'Buenos Aires', None, 25.8),
    ('provincia', 'CABA', None, 19.35),
    ('provincia', 'Salta', None, 16.13),
    ('provincia', 'Córdoba', None, 9.67),
    ('provincia', 'Santa Fe', None, 9.67),
    ('provincia', 'Otras', None, 19.35),
]

# ===== 2017 — anual — 103 casos =====
MASTER_DATA[(2017, 'anual', 103)] = [
    # identidad_victima
    ('identidad_victima', 'mujer_trans', None, 58.0),
    ('identidad_victima', 'gay_cis', None, 30.0),
    ('identidad_victima', 'lesbiana', None, 9.0),
    ('identidad_victima', 'varón_trans', None, 3.0),
    # tipo_violacion
    ('tipo_violacion', 'asesinato', 13, 13.0),
    ('tipo_violacion', 'violencia_fisica', 90, 87.0),
    # modalidad
    ('modalidad', 'golpes', None, 70.0),
    ('modalidad', 'balazo', None, 4.0),
    ('modalidad', 'puñalada', None, 4.0),
    ('modalidad', 'abuso_sexual', None, 4.0),
    ('modalidad', 'corte', None, 3.0),
    ('modalidad', 'estrangulamiento', None, 3.0),
    ('modalidad', 'degüello', None, 1.0),
    ('modalidad', 'desconocida', None, 1.0),
    ('modalidad', 'otra', None, 10.0),
    # autoria
    ('autoria', 'persona_privada', None, 79.0),
    ('autoria', 'fuerzas_seguridad', None, 21.0),
    # vinculo_agresor
    ('vinculo_agresor', 'desconocido', None, 67.0),
    ('vinculo_agresor', 'conocido', None, 16.0),
    ('vinculo_agresor', 'pareja_expareja', None, 9.0),
    ('vinculo_agresor', 'familiar', None, 5.0),
    ('vinculo_agresor', 'otro', None, 3.0),
    # rango_etario (66% edad desconocida; estos son % del total incluyendo desconocidos)
    ('rango_etario', 'desconocido', 68, 66.0),
    ('rango_etario', '10-19', 4, 4.0),
    ('rango_etario', '20-29', 14, 13.0),
    ('rango_etario', '30-39', 12, 12.0),
    ('rango_etario', '40-49', 5, 5.0),
    # provincia
    ('provincia', 'CABA', 36, 35.0),
    ('provincia', 'Buenos Aires', 33, 32.0),
    ('provincia', 'Santiago del Estero', 5, 5.0),
    ('provincia', 'Tucumán', 4, 4.0),
    ('provincia', 'Salta', 3, 3.0),
    ('provincia', 'Córdoba', 3, 3.0),
    ('provincia', 'Neuquén', 3, 3.0),
    ('provincia', 'Otras', 16, 15.0),
    # lugar_fisico
    ('lugar_fisico', 'via_publica', 57, 55.0),
    ('lugar_fisico', 'vivienda_victima', 12, 11.0),
    ('lugar_fisico', 'comisaria_penal', 7, 7.0),
    ('lugar_fisico', 'establecimiento_privado', 6, 6.0),
    ('lugar_fisico', 'sin_dato', 5, 5.0),
    ('lugar_fisico', 'establecimiento_publico', 4, 4.0),
    ('lugar_fisico', 'otra_vivienda', 4, 4.0),
    ('lugar_fisico', 'ruta', 3, 3.0),
    ('lugar_fisico', 'descampado', 2, 2.0),
    ('lugar_fisico', 'parque', 2, 2.0),
    ('lugar_fisico', 'vivienda_agresor', 1, 1.0),
    
]

# ===== 2018 — anual — 147 casos =====
MASTER_DATA[(2018, 'anual', 147)] = [
    # identidad_victima
    ('identidad_victima', 'mujer_trans', 94, 64.0),
    ('identidad_victima', 'gay_cis', 41, 28.0),
    ('identidad_victima', 'lesbiana', 11, 7.0),
    ('identidad_victima', 'varón_trans', 1, 1.0),
    # tipo_violacion
    ('tipo_violacion', 'derecho_a_la_vida', 67, 46.0),
    ('tipo_violacion', 'violencia_fisica', 80, 54.0),
    # tipo_muerte
    ('tipo_muerte', 'asesinato', 17, 25.0),
    ('tipo_muerte', 'suicidio', 7, 11.0),
    ('tipo_muerte', 'muerte_estructural', 43, 64.0),
    # modalidad
    ('modalidad', 'golpes', 60, 40.82),
    ('modalidad', 'muerte_estructural', 47, 31.98),
    ('modalidad', 'lesiones_autoinfligidas', 7, 4.76),
    ('modalidad', 'abuso_sexual', 6, 4.08),
    ('modalidad', 'privacion_libertad', 4, 2.72),
    ('modalidad', 'puñalada', 4, 2.72),
    ('modalidad', 'balazo', 4, 2.72),
    ('modalidad', 'corte', 3, 2.04),
    ('modalidad', 'estrangulamiento', 3, 2.04),
    ('modalidad', 'empujones', 3, 2.04),
    ('modalidad', 'degüello', 2, 1.36),
    ('modalidad', 'fuego_calcinamiento', 1, 0.68),
    ('modalidad', 'otra', 3, 2.04),
    # autoria
    ('autoria', 'persona_privada', 86, 58.5),
    ('autoria', 'estado', 42, 28.57),
    ('autoria', 'fuerzas_seguridad', 12, 8.16),
    ('autoria', 'si_mismo', 7, 4.76),
    # vinculo_agresor
    ('vinculo_agresor', 'desconocido', 48, 55.0),
    ('vinculo_agresor', 'conocido', 14, 16.0),
    ('vinculo_agresor', 'familiar', 5, 6.0),
    ('vinculo_agresor', 'cliente_trabajo_sexual', 3, 4.0),
    ('vinculo_agresor', 'pareja_expareja', 2, 2.0),
    ('vinculo_agresor', 'otro', 15, 17.0),
    # rango_etario
    ('rango_etario', '10-19', None, 14.28),
    ('rango_etario', '20-29', None, 37.66),
    ('rango_etario', '30-39', None, 24.67),
    ('rango_etario', '40-49', None, 11.69),
    ('rango_etario', '50-59', None, 6.5),
    ('rango_etario', '60-69', None, 5.2),
    # provincia
    ('provincia', 'Buenos Aires', 51, 34.69),
    ('provincia', 'CABA', 28, 19.05),
    ('provincia', 'Salta', 12, 8.16),
    ('provincia', 'Santa Fe', 11, 7.48),
    ('provincia', 'Tucumán', 8, 5.44),
    ('provincia', 'La Rioja', 4, 2.72),
    ('provincia', 'Santiago del Estero', 4, 2.72),
    ('provincia', 'San Juan', 4, 2.72),
    ('provincia', 'Río Negro', 4, 2.72),
    ('provincia', 'Chaco', 3, 2.04),
    ('provincia', 'Chubut', 3, 2.04),
    ('provincia', 'Catamarca', 2, 1.36),
    ('provincia', 'Córdoba', 2, 1.36),
    ('provincia', 'Jujuy', 2, 1.36),
    ('provincia', 'Mendoza', 2, 1.36),
    ('provincia', 'Neuquén', 2, 1.36),
    ('provincia', 'San Luis', 1, 0.68),
    ('provincia', 'Formosa', 1, 0.68),
    ('provincia', 'Corrientes', 1, 0.68),
    ('provincia', 'sin_dato', 2, 1.36),
    ('provincia', 'Otras', None, 2.06),
    # lugar_fisico
    ('lugar_fisico', 'via_publica', None, 41.0),
    ('lugar_fisico', 'vivienda_victima', None, 15.0),
    ('lugar_fisico', 'establecimiento_privado', None, 22.0),
    ('lugar_fisico', 'ruta', None, 7.0),
    ('lugar_fisico', 'establecimiento_publico', None, 4.0),
    ('lugar_fisico', 'descampado', None, 3.0),
    ('lugar_fisico', 'comisaria_penal', None, 2.0),
    ('lugar_fisico', 'vehiculo', None, 2.0),
    ('lugar_fisico', 'vivienda_compartida', None, 1.0),
    ('lugar_fisico', 'otra_vivienda', None, 1.0),
    ('lugar_fisico', 'rio_zanjon', None, 2.0),
]

# ===== 2019 — anual — 177 casos =====
MASTER_DATA[(2019, 'anual', 177)] = [
    # identidad_victima
    ('identidad_victima', 'mujer_trans', 113, 64.0),
    ('identidad_victima', 'gay_cis', 42, 24.0),
    ('identidad_victima', 'lesbiana', 15, 8.0),
    ('identidad_victima', 'varón_trans', 7, 4.0),
    # tipo_violacion
    ('tipo_violacion', 'derecho_a_la_vida', 78, 44.0),
    ('tipo_violacion', 'violencia_fisica', 99, 56.0),
    # tipo_muerte
    ('tipo_muerte', 'asesinato', 16, 21.0),
    ('tipo_muerte', 'muerte_estructural', 62, 79.0),
    # modalidad
    ('modalidad', 'golpes', None, 47.0),
    ('modalidad', 'muerte_estructural', None, 36.0),
    ('modalidad', 'puñalada', None, 4.0),
    ('modalidad', 'abuso_sexual', None, 3.0),
    ('modalidad', 'balazo', None, 3.0),
    ('modalidad', 'corte', None, 1.0),
    ('modalidad', 'empujones', None, 1.0),
    ('modalidad', 'estrangulamiento', None, 1.0),
    ('modalidad', 'privacion_libertad', None, 1.0),
    ('modalidad', 'mutilacion', None, 1.0),
    ('modalidad', 'otra', None, 1.0),
    ('modalidad', 'sin_dato', None, 2.0),
    # autoria
    ('autoria', 'persona_privada', 83, 47.0),
    ('autoria', 'estado', 61, 35.0),
    ('autoria', 'fuerzas_seguridad', 22, 12.0),
    ('autoria', 'sin_dato', 11, 6.0),
    # vinculo_agresor
    ('vinculo_agresor', 'desconocido', 49, 59.0),
    ('vinculo_agresor', 'conocido', 12, 14.0),
    ('vinculo_agresor', 'familiar', 11, 14.0),
    ('vinculo_agresor', 'pareja_expareja', 6, 7.0),
    ('vinculo_agresor', 'cliente_trabajo_sexual', 5, 6.0),
    # rango_etario
    ('rango_etario', '10-19', None, 4.9),
    ('rango_etario', '20-29', None, 35.29),
    ('rango_etario', '30-39', None, 30.39),
    ('rango_etario', '40-49', None, 14.71),
    ('rango_etario', '50-59', None, 8.82),
    ('rango_etario', '60-69', None, 4.9),
    ('rango_etario', '70-79', None, 0.98),
    # provincia
    ('provincia', 'Buenos Aires', 48, 27.0),
    ('provincia', 'CABA', 42, 24.0),
    ('provincia', 'Salta', 21, 12.0),
    ('provincia', 'Santa Fe', 9, 5.0),
    ('provincia', 'Río Negro', 9, 5.0),
    ('provincia', 'Entre Ríos', 6, 3.0),
    ('provincia', 'Mendoza', 5, 3.0),
    ('provincia', 'Chubut', 5, 3.0),
    ('provincia', 'Jujuy', 5, 3.0),
    ('provincia', 'Santiago del Estero', 5, 3.0),
    ('provincia', 'Tucumán', 5, 3.0),
    ('provincia', 'La Rioja', 4, 2.0),
    ('provincia', 'Chaco', 2, 1.0),
    ('provincia', 'Corrientes', 2, 1.0),
    ('provincia', 'Formosa', 1, 1.0),
    ('provincia', 'Santa Cruz', 1, 1.0),
    ('provincia', 'sin_dato', None, 1.0),
    # lugar_fisico
    ('lugar_fisico', 'via_publica', None, 47.0),
    ('lugar_fisico', 'vivienda_victima', None, 20.0),
    ('lugar_fisico', 'establecimiento_privado', None, 14.0),
    ('lugar_fisico', 'otra_vivienda', None, 3.0),
    ('lugar_fisico', 'vivienda_agresor', None, 3.0),
    ('lugar_fisico', 'establecimiento_publico', None, 3.0),
    ('lugar_fisico', 'ruta', None, 3.0),
    ('lugar_fisico', 'comisaria_penal', None, 3.0),
    ('lugar_fisico', 'rio_zanjon', None, 2.0),
    ('lugar_fisico', 'descampado', None, 1.0),
    ('lugar_fisico', 'vehiculo', None, 1.0),
]

# ===== 2020 — semestral — 69 casos =====
MASTER_DATA[(2020, 'semestral', 69)] = [
    # identidad_victima
    ('identidad_victima', 'mujer_trans', 54, 78.0),
    ('identidad_victima', 'gay_cis', 11, 16.0),
    ('identidad_victima', 'lesbiana', 3, 4.0),
    ('identidad_victima', 'varón_trans', 1, 2.0),
    # tipo_violacion
    ('tipo_violacion', 'derecho_a_la_vida', 32, 46.0),
    ('tipo_violacion', 'violencia_fisica', 37, 54.0),
    # tipo_muerte
    ('tipo_muerte', 'asesinato', 6, 19.0),
    ('tipo_muerte', 'suicidio', 2, 6.0),
    ('tipo_muerte', 'muerte_estructural', 24, 75.0),
    # modalidad
    ('modalidad', 'golpes', 19, 28.0),
    ('modalidad', 'muerte_estructural', 24, 35.0),
    ('modalidad', 'puñalada', 7, 10.0),
    ('modalidad', 'abuso_sexual', 2, 3.0),
    ('modalidad', 'balazo', 2, 3.0),
    ('modalidad', 'corte', 2, 3.0),
    ('modalidad', 'estrangulamiento', 1, 1.0),
    ('modalidad', 'privacion_libertad', 5, 7.0),
    ('modalidad', 'lesiones_autoinflingidas', 2, 3.0),
    ('modalidad', 'otra', 4, 6.0),
    ('modalidad', 'sin_dato', 1, 1.0),
    # autoria
    ('autoria', 'persona_privada', 35, 51.0),
    ('autoria', 'estado', 25, 36.0),
    ('autoria', 'fuerzas_seguridad', 9, 13.0),
    # vinculo_agresor
    ('vinculo_agresor', 'conocido', 10, 29.0),
    ('vinculo_agresor', 'desconocido', 9, 26.0),
    ('vinculo_agresor', 'pareja_expareja', 3, 8.0),
    ('vinculo_agresor', 'cliente_trabajo_sexual', 3, 8.0),
    ('vinculo_agresor', 'familiar', 2, 6.0),
    ('vinculo_agresor', 'si_mismo', 2, 6.0),
    ('vinculo_agresor', 'sin_dato', 6, 17.0),
     # rango_etario
    ('rango_etario', '10-19', None, 1.92),
    ('rango_etario', '20-29', None, 19.23),
    ('rango_etario', '30-39', None, 42.31),
    ('rango_etario', '40-49', None, 21.15),
    ('rango_etario', '50-59', None, 13.46),
    ('rango_etario', '60-69', None, 1.92),
    # provincia
    ('provincia', 'Buenos Aires', 24, 35.0),
    ('provincia', 'CABA', 11, 16.0),
    ('provincia', 'Jujuy', 5, 7.0),
    ('provincia', 'Córdoba', 6, 9.0),
    ('provincia', 'Salta', 3, 4.0),
    ('provincia', 'Chaco', 2, 3.0),
    ('provincia', 'Misiones', 2, 3.0),
    ('provincia', 'Entre Ríos', 1, 1.0),
    ('provincia', 'Santiago del Estero', 3, 4.0),
    ('provincia', 'San Juan', 1, 1.0),
    ('provincia', 'Mendoza', 1, 1.0),
    ('provincia', 'Chubut', 1, 1.0),
    ('provincia', 'Santa Cruz', 1, 1.0),
    ('provincia', 'sin_dato', 1, 1.0),
    # lugar_fisico
    ('lugar_fisico', 'via_publica', None, 49.0),
    ('lugar_fisico', 'vivienda_victima', None, 29.0),
    ('lugar_fisico', 'establecimiento_privado', None, 11.0),
    ('lugar_fisico', 'comisaria_penal', None, 7.0),
    ('lugar_fisico', 'establecimiento_publico', None, 2.0),
    ('lugar_fisico', 'rio_zanjon', None, 2.0),
]

# ===== 2021 — semestral — 53 casos =====
MASTER_DATA[(2021, 'semestral', 53)] = [
    # identidad_victima
    ('identidad_victima', 'mujer_trans', 40, 76.0),
    ('identidad_victima', 'gay_cis', 6, 11.0),
    ('identidad_victima', 'varón_trans', 5, 9.0),
    ('identidad_victima', 'lesbiana', 2, 4.0),
    # tipo_violacion
    ('tipo_violacion', 'derecho_a_la_vida', 35, 66.0),
    ('tipo_violacion', 'violencia_fisica', 18, 34.0),
     # tipo_muerte
    ('tipo_muerte', 'asesinato', 12, 34.0),
    ('tipo_muerte', 'suicidio', 4, 12.0),
    ('tipo_muerte', 'muerte_estructural', 19, 54.0),
    # autoria
    ('autoria', 'persona_privada', 30, 57.0),
    ('autoria', 'estado', 19, 36.0),
    ('autoria', 'fuerzas_seguridad', 4, 7.0),
    # modalidad
    ('modalidad', 'muerte_estructural', 19, 43.0),
    ('modalidad', 'golpes', 8, 15.0), 
    ('modalidad', 'balazo', 5, 8.0),
    ('modalidad', 'corte', 4, 6.0),
    ('modalidad', 'lesiones_autoinfligidas', 4, 6.0),
    ('modalidad', 'puñalada', 3, 5.0),
    ('modalidad', 'estrangulamiento', 2, 3.0),
    ('modalidad', 'privacion_libertad', 2, 3.0),
    ('modalidad', 'fuego_calcinamiento', 1, 2.0),
    ('modalidad', 'ahogo', 1, 2.0),
    ('modalidad', 'degüello', 1, 2.0),
    ('modalidad', 'sin_dato', 2, 3.0),
    ('modalidad', 'otra', 1, 2.0),
    # vinculo_agresor
    ('vinculo_agresor', 'desconocido', 4, 13.0),
    ('vinculo_agresor', 'conocido', 3, 10.0),
    ('vinculo_agresor', 'pareja_expareja', 5, 17.0),
    ('vinculo_agresor', 'cliente_trabajo_sexual', 3, 10.0),
    ('vinculo_agresor', 'si_mismo', 4, 13.0),
    ('vinculo_agresor', 'sin_dato', 11, 37.0),
     # rango_etario
    ('rango_etario', '10-19', None, 9.76),
    ('rango_etario', '20-29', None, 35.59),
    ('rango_etario', '30-39', None, 24.39),
    ('rango_etario', '40-49', None, 9.76),
    ('rango_etario', '50-59', None, 7.32),
    ('rango_etario', '60-69', None, 12.20),
    # provincia
    ('provincia', 'Buenos Aires', 17, 32.08),  # mayor % según informe
    ('provincia', 'Córdoba', 5, 9.43),
    ('provincia', 'Santa Fe', 4, 7.55),
    ('provincia', 'Mendoza', 4, 7.55),
    ('provincia', 'Jujuy', 4, 7.55),
    ('provincia', 'CABA', 3, 5.66),
    ('provincia', 'Salta', 3, 5.66),
    ('provincia', 'Chaco', 2, 3.77),
    ('provincia', 'Tucumán', 2, 3.77),
    ('provincia', 'Corrientes', 2, 3.77),
    ('provincia', 'Neuquén', 2, 3.77),
    ('provincia', 'Tierra del Fuego', 2, 3.77),
    ('provincia', 'Misiones', 1, 1.89),
    ('provincia', 'Santiago del Estero', 1, 1.89),
    ('provincia', 'San Luis', 1, 1.89),
    # lugar_fisico
    ('lugar_fisico', 'via_publica', None, 40.0),
    ('lugar_fisico', 'vivienda_victima', None, 36.0),
    ('lugar_fisico', 'vivienda_agresor', None, 3.0),
    ('lugar_fisico', 'otra_vivienda', None, 6.0),
    ('lugar_fisico', 'comisaria_penal', None, 3.0),
    ('lugar_fisico', 'rio_zanjon', None, 9.0),
    ('lugar_fisico', 'ruta', None, 3.0),
]

# ===== 2022 — anual — 129 casos =====
MASTER_DATA[(2022, 'anual', 129)] = [
    # identidad_victima
    ('identidad_victima', 'mujer_trans', 108, 84.0),
    ('identidad_victima', 'gay_cis', 15, 12.0),
    ('identidad_victima', 'varón_trans', 3, 2.0),
    ('identidad_victima', 'lesbiana', 3, 2.0),
    # tipo_violacion
    ('tipo_violacion', 'derecho_a_la_vida', 89, 69.0),
    ('tipo_violacion', 'violencia_fisica', 40, 31.0),
    # tipo_muerte
    ('tipo_muerte', 'asesinato', 18, 20.0),
    ('tipo_muerte', 'muerte_estructural', 71, 80.0),
    # modalidad
    ('modalidad', 'muerte_estructural', 71, 55.0),
    ('modalidad', 'golpes', 32, 25.0),
    ('modalidad', 'balazo', 5, 3.8),
    ('modalidad', 'puñalada', 5, 3.8),
    ('modalidad', 'estrangulamiento', 4, 3.1),
    ('modalidad', 'abuso_sexual', 4, 3.1),
    ('modalidad', 'corte', 2, 1.5),
    ('modalidad', 'fuego_calcinamiento', 2, 1.5),
    ('modalidad', 'ahogo', 1, 0.8),
    ('modalidad', 'degüello', 1, 0.8),
    ('modalidad', 'sin_dato', 1, 0.8),
    ('modalidad', 'otra', 1, 0.8),
    # autoria
    ('autoria', 'estado', 62, 56.0),
    ('autoria', 'persona_privada', 38, 29.0),
    ('autoria', 'fuerzas_seguridad', 7, 5.0),
    ('autoria', 'sin_dato', 12, 9.0),
    # vinculo_agresor
    ('vinculo_agresor', 'desconocido', 19, 50.0),
    ('vinculo_agresor', 'conocido', 9, 24.0),
    ('vinculo_agresor', 'cliente_trabajo_sexual', 6, 16.0),
    ('vinculo_agresor', 'pareja', 2, 5.0),
    ('vinculo_agresor', 'familiar', 2, 5.0),
    # rango_etario
    ('rango_etario', '10-19', None, 2.5),
    ('rango_etario', '20-29', None, 21.25),
    ('rango_etario', '30-39', None, 27.5),
    ('rango_etario', '40-49', None, 28.75),
    ('rango_etario', '50-59', None, 12.5),
    ('rango_etario', '60-69', None, 5.0),
    ('rango_etario', '70-79', None, 2.5),
    # provincia
    ('provincia', 'Buenos Aires', 31, 24.0),
    ('provincia', 'CABA', 31, 24.0),
    ('provincia', 'Santiago del Estero', 13, 10.0),
    ('provincia', 'Tucumán', 8, 6.2),
    ('provincia', 'Santa Fe', 7, 5.42),
    ('provincia', 'Salta', 6, 4.65),
    ('provincia', 'Corrientes', 6, 4.65),
    ('provincia', 'Córdoba', 4, 3.1),
    ('provincia', 'Entre Ríos', 3, 2.3),
    ('provincia', 'Santa Cruz', 3, 2.3),
    ('provincia', 'Jujuy', 3, 2.3),
    ('provincia', 'Misiones', 2, 1.6),
    ('provincia', 'Chaco', 2, 1.6),
    ('provincia', 'Neuquén', 2, 1.6),
    ('provincia', 'Río Negro', 2, 1.6),
    ('provincia', 'San Luis', 2, 1.6),
    ('provincia', 'Formosa', 1, 0.77),
    ('provincia', 'La Rioja', 1, 0.77),
    ('provincia', 'San Juan', 1, 0.77),
    ('provincia', 'La Pampa', 1, 0.77),
    # lugar_fisico
    ('lugar_fisico', 'via_publica', None, 37.0),
    ('lugar_fisico', 'vivienda_victima', None, 20.0),
    ('lugar_fisico', 'establecimiento_privado', None, 12.0),
    ('lugar_fisico', 'otra_vivienda', None, 7.0),
    ('lugar_fisico', 'establecimiento_publico', None, 7.0),
    ('lugar_fisico', 'comisaria_penal', None, 3.0),
    ('lugar_fisico', 'vivienda_agresor', None, 3.0),
    ('lugar_fisico', 'descampado', None, 3.0),
    ('lugar_fisico', 'vehiculo', None, 3.0),
    ('lugar_fisico', 'vivienda_compartida', None, 2.0),
    ('lugar_fisico', 'ruta', None, 2.0),
]

# ===== 2023 — anual — 133 casos =====
MASTER_DATA[(2023, 'anual', 133)] = [
    # identidad_victima
    ('identidad_victima', 'mujer_trans', 118, 88.72),
    ('identidad_victima', 'gay_cis', 7, 5.26),
    ('identidad_victima', 'varón_trans', 3, 2.26),
    ('identidad_victima', 'no_binarie', 3, 2.26),
    ('identidad_victima', 'lesbiana', 2, 1.5),
    # tipo_violacion
    ('tipo_violacion', 'derecho_a_la_vida', 91, 68.0),
    ('tipo_violacion', 'violencia_fisica', 42, 32.0),
    # tipo_muerte
    ('tipo_muerte', 'asesinato', 9, 10.0),
    ('tipo_muerte', 'muerte_estructural', 80, 88.0),
    ('tipo_muerte', 'suicidio', 2, 2.0),
    # modalidad
    ('modalidad', 'muerte_estructural', 80, 60.15),
    ('modalidad', 'golpes', 33, 24.81),
    ('modalidad', 'corte', 4, 3.02),
    ('modalidad', 'abuso_sexual', 3, 2.26),
    ('modalidad', 'balazo', 3, 2.26),
    ('modalidad', 'fuego_calcinamiento', 2, 1.5),
    ('modalidad', 'lesiones_autoinfligidas', 2, 1.5),
    ('modalidad', 'estrangulamiento', 1, 0.75),
    ('modalidad', 'puñalada', 1, 0.75),
    ('modalidad', 'privacion_libertad', 1, 0.75),
    ('modalidad', 'otra', 1, 0.75),
    # autoria
    ('autoria', 'estado', 80, 60.0),
    ('autoria', 'persona_privada', 35, 26.0),
    ('autoria', 'fuerzas_seguridad', 14, 11.0),
    ('autoria', 'sin_dato', 4, 3.0),
    # vinculo_agresor
    ('vinculo_agresor', 'desconocido', 17, 48.57),
    ('vinculo_agresor', 'conocido', 9, 25.71),
    ('vinculo_agresor', 'pareja', 3, 8.57),
    ('vinculo_agresor', 'cliente_trabajo_sexual', 3, 8.57),
    ('vinculo_agresor', 'si_mismo', 2, 5.72),
    ('vinculo_agresor', 'familiar', 1, 2.86),
    # rango_etario
    ('rango_etario', '10-19', None, 5.88),
    ('rango_etario', '20-29', None, 21.57),
    ('rango_etario', '30-39', None, 27.45),
    ('rango_etario', '40-49', None, 25.49),
    ('rango_etario', '50-59', None, 13.73),
    ('rango_etario', '60-69', None, 3.92),
    ('rango_etario', '70-79', None, 1.96),
    # provincia
    ('provincia', 'Buenos Aires', None, 32.4),
    ('provincia', 'CABA', None, 17.6),
    ('provincia', 'Tucumán', None, 8.8),
    ('provincia', 'Chaco', None, 4.4),
    ('provincia', 'San Juan', None, 4.4),
    ('provincia', 'Jujuy', None, 4.4),
    ('provincia', 'Santa Cruz', None, 4.4),
    ('provincia', 'Córdoba', None, 2.9),
    ('provincia', 'Salta', None, 2.9),
    ('provincia', 'Catamarca', None, 2.9),
    ('provincia', 'La Rioja', None, 2.9),
    ('provincia', 'Mendoza', None, 2.9),
    ('provincia', 'Santa Fe', None, 1.5),
    ('provincia', 'Neuquén', None, 1.5),
    ('provincia', 'Entre Ríos', None, 1.5),
    ('provincia', 'Río Negro', None, 1.5),
    ('provincia', 'San Luis', None, 1.5),
    ('provincia', 'Santiago del Estero', None, 1.5),
    # lugar_fisico
    ('lugar_fisico', 'via_publica', None, 24.0),
    ('lugar_fisico', 'vivienda_victima', None, 24.0),
    ('lugar_fisico', 'comisaria_penal', None, 24.0),
    ('lugar_fisico', 'ruta', None, 8.0),
    ('lugar_fisico', 'establecimiento_privado', None, 8.0),
    ('lugar_fisico', 'establecimiento_publico', None, 6.0),
    ('lugar_fisico', 'vehiculo', None, 4.0),
    ('lugar_fisico', 'vivienda_agresor', None, 2.0),
]

# ===== 2024 — anual — 140 casos =====
MASTER_DATA[(2024, 'anual', 140)] = [
    # identidad_victima
    ('identidad_victima', 'mujer_trans', 90, 64.0),
    ('identidad_victima', 'gay_cis', 32, 23.0),
    ('identidad_victima', 'lesbiana', 11, 8.0),
    ('identidad_victima', 'varón_trans', 5, 4.0),
    ('identidad_victima', 'no_binarie', 2, 1.0),
    # tipo_violacion
    ('tipo_violacion', 'derecho_a_la_vida', 67, 48.0),
    ('tipo_violacion', 'violencia_fisica', 73, 52.0),
    # tipo_muerte
    ('tipo_muerte', 'asesinato', 17, 25.0),
    ('tipo_muerte', 'muerte_estructural', 44, 66.0),
    ('tipo_muerte', 'suicidio', 6, 9.0),
    # modalidad
    ('modalidad', 'golpes', 49, 35.0),
    ('modalidad', 'muerte_estructural', 44, 31.43),
    ('modalidad', 'lesiones_autoinfligidas', 9, 6.43),
    ('modalidad', 'fuego_calcinamiento', 8, 5.71),
    ('modalidad', 'estrangulamiento', 5, 3.57),
    ('modalidad', 'balazo', 4, 2.86),
    ('modalidad', 'corte', 3, 2.14),
    ('modalidad', 'privacion_libertad', 3, 2.14),
    ('modalidad', 'puñalada', 3, 2.14),
    ('modalidad', 'sin_dato', 3, 2.14),
    ('modalidad', 'empujones', 1, 0.72),
    ('modalidad', 'degüello', 1, 0.72),
    ('modalidad', 'otra', 7, 5.0),
    # autoria
    ('autoria', 'persona_privada', 73, 52.0),
    ('autoria', 'estado', 47, 34.0),
    ('autoria', 'fuerzas_seguridad', 17, 12.0),
    ('autoria', 'sin_dato', 3, 2.0),
    # vinculo_agresor
    ('vinculo_agresor', 'desconocido', 32, 44.0),
    ('vinculo_agresor', 'conocido', 21, 29.0),
    ('vinculo_agresor', 'si_mismo', 9, 12.0),
    ('vinculo_agresor', 'pareja', 5, 7.0),
    ('vinculo_agresor', 'cliente_trabajo_sexual', 4, 5.0),
    ('vinculo_agresor', 'familiar', 1, 3.0),
    # rango_etario
    ('rango_etario', '10-19', None, 1.70),
     ('rango_etario', '20-29', None, 16.95),
    ('rango_etario', '30-39', None, 32.2),
    ('rango_etario', '40-49', None, 27.12),
    ('rango_etario', '50-59', None, 18.64),
    ('rango_etario', '60-69', None, 3.39),
    # provincia
    ('provincia', 'CABA', 66, 47.1),
    ('provincia', 'Buenos Aires', 40, 28.6),
    ('provincia', 'Jujuy', 6, 4.3),
    ('provincia', 'Catamarca', 4, 2.9),
    ('provincia', 'Santa Fe', 4, 2.9),
    ('provincia', 'Entre Ríos', 3, 2.1),
    ('provincia', 'Santiago del Estero', 3, 2.1),
    ('provincia', 'Mendoza', 3, 2.1),
    ('provincia', 'Salta', 3, 2.1),
    ('provincia', 'Tucumán', 2, 1.4),
    ('provincia', 'San Juan', 2, 1.4),
    ('provincia', 'Córdoba', 2, 1.4),
    ('provincia', 'Chubut', 1, 0.8),
    ('provincia', 'sin_dato', 1, 0.8),
    # lugar_fisico
    ('lugar_fisico', 'via_publica', None, 35.0),
    ('lugar_fisico', 'vivienda_victima', None, 24.0),
    ('lugar_fisico', 'establecimiento_privado', None, 23.0),
    ('lugar_fisico', 'establecimiento_publico', None, 10.0),
    ('lugar_fisico', 'comisaria_penal', None, 2.0),
    ('lugar_fisico', 'vivienda_compartida', None, 1.0),
    ('lugar_fisico', 'vivienda_agresor', None, 1.0),
    ('lugar_fisico', 'otra_vivienda', None, 1.0),
    ('lugar_fisico', 'vehiculo', None, 1.0),
    ('lugar_fisico', 'rio_zanjon', None, 1.0),
    ('lugar_fisico', 'descampado', None, 1.0),
]

# ===== 2025 — anual — 227 casos =====
MASTER_DATA[(2025, 'anual', 227)] = [
    # identidad_victima
    ('identidad_victima', 'mujer_trans', 142, 62.56),
    ('identidad_victima', 'gay_cis', 50, 22.03),
    ('identidad_victima', 'varón_trans', 18, 7.93),
    ('identidad_victima', 'lesbiana', 13, 5.73),
    ('identidad_victima', 'no_binarie', 4, 1.76),
    # tipo_violacion
    ('tipo_violacion', 'derecho_a_la_vida', 80, 35.24),
    ('tipo_violacion', 'violencia_fisica', 147, 64.76),
    # tipo_muerte
    ('tipo_muerte', 'asesinato', 16, 20.0),
    ('tipo_muerte', 'muerte_estructural', 53, 66.25),
    ('tipo_muerte', 'suicidio', 11, 13.75),
    # modalidad
    ('modalidad', 'golpes', 90, 39.65),
    ('modalidad', 'muerte_estructural', 53, 23.35),
    ('modalidad', 'lesiones_autoinfligidas', 26, 11.45),
    ('modalidad', 'otra', 24, 10.57),
    ('modalidad', 'puñalada', 7, 3.08),
    ('modalidad', 'empujones', 7, 3.08),
    ('modalidad', 'balazo', 6, 2.64),
    ('modalidad', 'privacion_libertad', 4, 1.76),
    ('modalidad', 'abuso_sexual', 2, 0.88),
    ('modalidad', 'estrangulamiento', 2, 0.88),
    ('modalidad', 'fuego_calcinamiento', 2, 0.88),
    ('modalidad', 'corte', 2, 0.88),
    ('modalidad', 'sin_dato', 2, 0.88),
    # autoria
    ('autoria', 'persona_privada', 106, 46.70),
    ('autoria', 'fuerzas_seguridad', 64, 28.19),
    ('autoria', 'estado', 57, 25.11),
    # vinculo_agresor
    ('vinculo_agresor', 'desconocido', 46, 43.40),
    ('vinculo_agresor', 'conocido', 18, 16.98),
    ('vinculo_agresor', 'si_mismo', 26, 24.53),
    ('vinculo_agresor', 'sin_dato', 5, 4.72),       
    ('vinculo_agresor', 'cliente_trabajo_sexual', 4, 3.77),
    ('vinculo_agresor', 'pareja_expareja', 6, 5.66),
    ('vinculo_agresor', 'familiar', 1, 0.94),
    # rango_etario
    ('rango_etario', '10-19', None, 2.97),
    ('rango_etario', '20-29', None, 32.67),
    ('rango_etario', '30-39', None, 23.76),
    ('rango_etario', '40-49', None, 20.79),
    ('rango_etario', '50-59', None, 12.87),
    ('rango_etario', '60-69', None, 5.94),
    ('rango_etario', '70-79', None, 0.99),
    # provincia
    ('provincia', 'CABA', 97, 43.5),
    ('provincia', 'Buenos Aires', 60, 26.91),
    ('provincia', 'Santa Fe', 10, 4.48),
    ('provincia', 'Córdoba', 9, 4.04),
    ('provincia', 'Neuquén', 6, 2.69),
    ('provincia', 'sin_dato', 5, 2.24),       
     ('provincia', 'Santiago del Estero', 4, 1.79), 
    ('provincia', 'Salta', 4, 1.79),
    ('provincia', 'Tucumán', 4, 1.79),
    ('provincia', 'Corrientes', 4, 1.79),
    ('provincia', 'Entre Ríos', 3, 1.35),
    ('provincia', 'Chaco', 3, 1.35),
    ('provincia', 'Catamarca', 2, 0.9),
    ('provincia', 'San Juan', 2, 0.9),
    ('provincia', 'Mendoza', 2, 0.9),
    ('provincia', 'Río Negro', 2, 0.9),
    ('provincia', 'Misiones', 1, 0.45),
    ('provincia', 'San Luis', 1, 0.45),
    ('provincia', 'La Pampa', 1, 0.45),
    ('provincia', 'Chubut', 1, 0.45),
    ('provincia', 'Santa Cruz', 1, 0.45),
    ('provincia', 'Tierra del Fuego', 1, 0.45),
    # lugar_fisico
    ('lugar_fisico', 'comisaria_penal', None, 32.26),
    ('lugar_fisico', 'via_publica', None, 31.61),
    ('lugar_fisico', 'vivienda_victima', None, 20.0),
    ('lugar_fisico', 'establecimiento_privado', None, 7.75),
    ('lugar_fisico', 'establecimiento_publico', None, 5.16),
    ('lugar_fisico', 'vivienda_compartida', None, 1.29),
    ('lugar_fisico', 'ruta', None, 1.29),
    ('lugar_fisico', 'rio_zanjon', None, 0.65),
    
    
   
]


def build_master() -> pd.DataFrame:
    """Convierte MASTER_DATA en un DataFrame con el esquema canónico."""
    rows = []
    for (anio, periodo, total_anual), entries in MASTER_DATA.items():
        for dimension, categoria, conteo, porcentaje in entries:
            rows.append({
                'anio': anio,
                'periodo': periodo,
                'dimension': dimension,
                'categoria': categoria,
                'conteo': conteo,
                'porcentaje': porcentaje,
                'total_anual': total_anual,
            })

    df = pd.DataFrame(rows)
    df = df.sort_values(['anio', 'dimension', 'categoria']).reset_index(drop=True)
    return df


def main() -> None:
    df = build_master()

    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    csv_path = PROCESSED_DIR / 'estadisticas_master.csv'
    json_path = PROCESSED_DIR / 'estadisticas_master.json'

    df.to_csv(csv_path, index=False, encoding='utf-8-sig')
    df.to_json(json_path, orient='records', force_ascii=False, indent=2)

    print(f"CSV maestro generado:")
    print(f"  {csv_path.relative_to(BASE_DIR)}  ({len(df)} filas)")
    print(f"  {json_path.relative_to(BASE_DIR)}")
    print(f"\n  Años cubiertos: {sorted(df['anio'].unique().tolist())}")
    print(f"  Dimensiones:    {sorted(df['dimension'].unique().tolist())}")

    # Resumen por año
    print(f"\n  Filas por año:")
    for anio, group in df.groupby('anio'):
        dims = sorted(group['dimension'].unique().tolist())
        print(f"    {anio}: {len(group)} filas — {len(dims)} dimensiones: {dims}")

    # Validación: identidad_victima conteos vs total
    print(f"\n  Validación identidad_victima (conteo vs total_anual):")
    ident = df[df['dimension'] == 'identidad_victima']
    for anio, group in ident.groupby('anio'):
        total = group['total_anual'].iloc[0]
        suma_conteo = group['conteo'].dropna().sum()
        if suma_conteo > 0:
            check = '  OK' if abs(suma_conteo - total) < 5 else '  # REVISAR'
            print(f"    {anio}: suma={int(suma_conteo)}, total={total}{check}")
        else:
            print(f"    {anio}: solo porcentajes (total={total})")


if __name__ == '__main__':
    main()
