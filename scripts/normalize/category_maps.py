"""
Diccionarios de normalización para homologar variaciones de nombres
entre los informes 2016–2025 del Observatorio Nacional de Crímenes de Odio LGBT+.

Cada mapa es: {variante_en_minúsculas: nombre_canónico}
"""

# ---------------------------------------------------------------------------
# identidad_victima
# ---------------------------------------------------------------------------
IDENTITY_MAP: dict[str, str] = {
    # Mujeres trans / travesti / transexual
    'mujeres trans': 'mujer_trans',
    'mujer trans': 'mujer_trans',
    'travestis': 'mujer_trans',
    'travesti': 'mujer_trans',
    'transexuales': 'mujer_trans',
    'transexual': 'mujer_trans',
    'transgéneros': 'mujer_trans',
    'transgénero': 'mujer_trans',
    'trans': 'mujer_trans',
    'personas trans': 'mujer_trans',
    # Varones gays cis
    'varones gays cis': 'gay_cis',
    'varón gay cis': 'gay_cis',
    'gays cis': 'gay_cis',
    'gay cis': 'gay_cis',
    'gays': 'gay_cis',
    'gay': 'gay_cis',
    'varones gays': 'gay_cis',
    # Varones trans
    'varones trans': 'varón_trans',
    'varón trans': 'varón_trans',
    # Lesbianas
    'lesbianas': 'lesbiana',
    'lesbiana': 'lesbiana',
    # No binaries
    'personas no binarias': 'no_binarie',
    'no binarias': 'no_binarie',
    'no binaries': 'no_binarie',
    'personas no binaries': 'no_binarie',
    # Bisexuales (aparecen en algunos informes)
    'bisexuales': 'bisexual',
    'bisexual': 'bisexual',
}

# ---------------------------------------------------------------------------
# tipo_violacion
# ---------------------------------------------------------------------------
RIGHTS_MAP: dict[str, str] = {
    'lesiones al derecho a la vida': 'derecho_a_la_vida',
    'derecho a la vida': 'derecho_a_la_vida',
    'vida': 'derecho_a_la_vida',
    'asesinatos y muertes por violencia estructural': 'derecho_a_la_vida',
    'asesinatos': 'derecho_a_la_vida',
    'lesiones a la integridad física': 'integridad_fisica',
    'integridad física': 'integridad_fisica',
    'integridad fisica': 'integridad_fisica',
    'violencia física': 'integridad_fisica',
    'violencia fisica': 'integridad_fisica',
}

# ---------------------------------------------------------------------------
# tipo_muerte
# ---------------------------------------------------------------------------
DEATH_MAP: dict[str, str] = {
    'asesinatos': 'asesinato',
    'asesinato': 'asesinato',
    'homicidios': 'asesinato',
    'muertes por violencia estructural': 'muerte_estructural',
    'violencia estructural': 'muerte_estructural',
    'muerte estructural': 'muerte_estructural',
    'muertes estructurales': 'muerte_estructural',
    'suicidios': 'suicidio',
    'suicidio': 'suicidio',
}

# ---------------------------------------------------------------------------
# modalidad
# ---------------------------------------------------------------------------
MODALITY_MAP: dict[str, str] = {
    'violencia estructural': 'violencia_estructural',
    'consecuencias de la violencia estructural': 'violencia_estructural',
    'muerte por violencia estructural': 'violencia_estructural',
    'golpes': 'golpes',
    'golpe': 'golpes',
    'balazos': 'balazo',
    'balazo': 'balazo',
    'balazo/s': 'balazo',
    'tiro': 'balazo',
    'tiros': 'balazo',
    'disparo': 'balazo',
    'disparos': 'balazo',
    'puñaladas': 'puñalada',
    'puñalada': 'puñalada',
    'puñalada/s': 'puñalada',
    'acuchillamiento': 'puñalada',
    'estrangulamiento': 'estrangulamiento',
    'ahorcamiento': 'estrangulamiento',
    'asfixia': 'estrangulamiento',
    'estrangulamiento, ahorcamiento y/o asfixia': 'estrangulamiento',
    'abuso sexual': 'abuso_sexual',
    'violación': 'abuso_sexual',
    'fuego': 'fuego_calcinamiento',
    'calcinamiento': 'fuego_calcinamiento',
    'fuego / calcinamiento': 'fuego_calcinamiento',
    'corte': 'corte',
    'cortes': 'corte',
    'degüello': 'degüello',
    'ahogo': 'ahogo',
    'otra': 'otro',
    'otro': 'otro',
    'otros': 'otro',
}

# ---------------------------------------------------------------------------
# autoria
# ---------------------------------------------------------------------------
AUTHORSHIP_MAP: dict[str, str] = {
    'personas privadas': 'persona_privada',
    'persona privada': 'persona_privada',
    'particulares': 'persona_privada',
    'estado': 'estado',
    'el estado': 'estado',
    'fuerzas de seguridad': 'fuerzas_seguridad',
    'personal de las fuerzas de seguridad': 'fuerzas_seguridad',
    'policía': 'fuerzas_seguridad',
    'violencia institucional': 'fuerzas_seguridad',
}

# ---------------------------------------------------------------------------
# vinculo_agresor
# ---------------------------------------------------------------------------
RELATIONSHIP_MAP: dict[str, str] = {
    'personas desconocidas': 'desconocido',
    'desconocidos': 'desconocido',
    'desconocido': 'desconocido',
    'vecinos': 'vecino_conocido',
    'vecines': 'vecino_conocido',
    'vecinos o personas conocidas': 'vecino_conocido',
    'vecines o personas conocidas': 'vecino_conocido',
    'clientes del trabajo sexual': 'cliente_trabajo_sexual',
    'clientes': 'cliente_trabajo_sexual',
    'pareja': 'pareja_noviazgo',
    'pareja/noviazgo': 'pareja_noviazgo',
    'noviazgo': 'pareja_noviazgo',
    'familiares': 'familiar',
    'familiar': 'familiar',
}

# ---------------------------------------------------------------------------
# lugar_fisico
# ---------------------------------------------------------------------------
LOCATION_MAP: dict[str, str] = {
    'vía pública': 'via_publica',
    'via publica': 'via_publica',
    'vivienda particular de la víctima': 'vivienda_victima',
    'vivienda de la víctima': 'vivienda_victima',
    'vivienda propia': 'vivienda_victima',
    'vivienda de la persona agresora': 'vivienda_agresor',
    'vivienda del agresor': 'vivienda_agresor',
    'viviendas compartidas': 'vivienda_compartida',
    'vivienda compartida': 'vivienda_compartida',
    'otra vivienda': 'otra_vivienda',
    'establecimientos privados de acceso público': 'establecimiento_privado',
    'establecimiento privado': 'establecimiento_privado',
    'establecimientos públicos': 'establecimiento_publico',
    'establecimiento público': 'establecimiento_publico',
    'comisarías o penales': 'comisaria_penal',
    'comisaria': 'comisaria_penal',
    'penal': 'comisaria_penal',
    'descampado/terreno baldío/basural': 'descampado',
    'descampado': 'descampado',
    'terreno baldío': 'descampado',
    'vehículo': 'vehiculo',
    'vehiculo': 'vehiculo',
    'rutas/caminos': 'ruta',
    'ruta': 'ruta',
}

# ---------------------------------------------------------------------------
# provincia — mapa a nombre oficial ISO
# ---------------------------------------------------------------------------
PROVINCE_MAP: dict[str, str] = {
    'ciudad autónoma de buenos aires': 'CABA',
    'ciudad autonoma de buenos aires': 'CABA',
    'ciudad de buenos aires': 'CABA',
    'caba': 'CABA',
    'buenos aires': 'Buenos Aires',
    'catamarca': 'Catamarca',
    'chaco': 'Chaco',
    'chubut': 'Chubut',
    'córdoba': 'Córdoba',
    'cordoba': 'Córdoba',
    'corrientes': 'Corrientes',
    'entre ríos': 'Entre Ríos',
    'entre rios': 'Entre Ríos',
    'formosa': 'Formosa',
    'jujuy': 'Jujuy',
    'la pampa': 'La Pampa',
    'la rioja': 'La Rioja',
    'mendoza': 'Mendoza',
    'misiones': 'Misiones',
    'neuquén': 'Neuquén',
    'neuquen': 'Neuquén',
    'río negro': 'Río Negro',
    'rio negro': 'Río Negro',
    'salta': 'Salta',
    'san juan': 'San Juan',
    'san luis': 'San Luis',
    'santa cruz': 'Santa Cruz',
    'santa fe': 'Santa Fe',
    'santiago del estero': 'Santiago del Estero',
    'tierra del fuego': 'Tierra del Fuego',
    'tucumán': 'Tucumán',
    'tucuman': 'Tucumán',
}

# ---------------------------------------------------------------------------
# Mapa maestro: dimension → dict de normalización
# ---------------------------------------------------------------------------
DIMENSION_MAPS: dict[str, dict[str, str]] = {
    'identidad_victima': IDENTITY_MAP,
    'tipo_violacion': RIGHTS_MAP,
    'tipo_muerte': DEATH_MAP,
    'modalidad': MODALITY_MAP,
    'autoria': AUTHORSHIP_MAP,
    'vinculo_agresor': RELATIONSHIP_MAP,
    'lugar_fisico': LOCATION_MAP,
    'provincia': PROVINCE_MAP,
    # rango_etario no necesita mapa: las categorías "20-29" ya son canónicas
}
