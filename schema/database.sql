-- ==========================================================================
-- Schema PostgreSQL — Plataforma de Visualización de Crímenes de Odio LGBT+
-- Observatorio Nacional de Crímenes de Odio LGBT+ (FALGBT) | Argentina
-- ==========================================================================

-- ---------------------------------------------------------------------------
-- Tabla de informes (una fila por informe PDF procesado)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reportes (
    id          SERIAL PRIMARY KEY,
    anio        INTEGER      NOT NULL,
    periodo     VARCHAR(20)  NOT NULL CHECK (periodo IN ('anual', 'semestral')),
    semestre    INTEGER               CHECK (semestre IN (1, 2)),
    filename    VARCHAR(255),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    UNIQUE (anio, periodo, semestre)
);

COMMENT ON TABLE  reportes           IS 'Un registro por informe PDF del Observatorio.';
COMMENT ON COLUMN reportes.anio      IS 'Año del período relevado.';
COMMENT ON COLUMN reportes.periodo   IS '"anual" o "semestral".';
COMMENT ON COLUMN reportes.semestre  IS '1 o 2 para informes semestrales; NULL para anuales.';

-- ---------------------------------------------------------------------------
-- Tabla de estadísticas (tabla de hechos — fact table)
-- Una fila por (informe × dimensión × categoría)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS estadisticas (
    id          SERIAL PRIMARY KEY,
    reporte_id  INTEGER      NOT NULL REFERENCES reportes(id) ON DELETE CASCADE,
    dimension   VARCHAR(50)  NOT NULL,
    -- 'identidad_victima' | 'tipo_violacion' | 'tipo_muerte' | 'modalidad'
    -- 'autoria' | 'vinculo_agresor' | 'rango_etario' | 'provincia' | 'lugar_fisico'
    categoria   VARCHAR(100) NOT NULL,  -- nombre canónico normalizado
    conteo      INTEGER,                -- número absoluto de casos (puede ser NULL)
    porcentaje  DECIMAL(5, 2),          -- porcentaje del total (puede ser NULL)
    total_anual INTEGER,                -- total de crímenes del informe ese año
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    UNIQUE (reporte_id, dimension, categoria)
);

COMMENT ON TABLE  estadisticas             IS 'Fact table: estadísticas por dimensión y año.';
COMMENT ON COLUMN estadisticas.dimension   IS 'Dimensión analítica (ej: provincia, modalidad).';
COMMENT ON COLUMN estadisticas.categoria   IS 'Valor normalizado dentro de la dimensión.';
COMMENT ON COLUMN estadisticas.conteo      IS 'Número absoluto. NULL si el PDF solo reportó %.';
COMMENT ON COLUMN estadisticas.total_anual IS 'Total de crímenes del año (denominador).';

-- ---------------------------------------------------------------------------
-- Índices para queries temporales y geográficas
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_est_reporte   ON estadisticas(reporte_id);
CREATE INDEX IF NOT EXISTS idx_est_dimension ON estadisticas(dimension);
CREATE INDEX IF NOT EXISTS idx_est_categoria ON estadisticas(categoria);
CREATE INDEX IF NOT EXISTS idx_rep_anio      ON reportes(anio);

-- Índice compuesto para queries de series temporales por dimensión
CREATE INDEX IF NOT EXISTS idx_est_dim_cat ON estadisticas(dimension, categoria);

-- ---------------------------------------------------------------------------
-- Tabla auxiliar de provincias (para joins geográficos futuros con PostGIS)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS provincias (
    id         SERIAL PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL UNIQUE,
    codigo_iso CHAR(2),          -- ISO 3166-2:AR (ej: 'BA', 'C', 'X')
    region     VARCHAR(50),
    -- geometry GEOMETRY(MULTIPOLYGON, 4326)  -- descomentar al agregar PostGIS
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE provincias IS 'Dimensión geográfica. Agrega PostGIS geometry para mapas.';

-- Poblar provincias
INSERT INTO provincias (nombre, codigo_iso, region) VALUES
    ('Buenos Aires',          'B',  'Centro'),
    ('CABA',                  'C',  'Centro'),
    ('Catamarca',             'K',  'Noroeste'),
    ('Chaco',                 'H',  'Noreste'),
    ('Chubut',                'U',  'Patagonia'),
    ('Córdoba',               'X',  'Centro'),
    ('Corrientes',            'W',  'Noreste'),
    ('Entre Ríos',            'E',  'Centro'),
    ('Formosa',               'P',  'Noreste'),
    ('Jujuy',                 'Y',  'Noroeste'),
    ('La Pampa',              'L',  'Centro'),
    ('La Rioja',              'F',  'Noroeste'),
    ('Mendoza',               'M',  'Cuyo'),
    ('Misiones',              'N',  'Noreste'),
    ('Neuquén',               'Q',  'Patagonia'),
    ('Río Negro',             'R',  'Patagonia'),
    ('Salta',                 'A',  'Noroeste'),
    ('San Juan',              'J',  'Cuyo'),
    ('San Luis',              'D',  'Cuyo'),
    ('Santa Cruz',            'Z',  'Patagonia'),
    ('Santa Fe',              'S',  'Centro'),
    ('Santiago del Estero',   'G',  'Noroeste'),
    ('Tierra del Fuego',      'V',  'Patagonia'),
    ('Tucumán',               'T',  'Noroeste')
ON CONFLICT (nombre) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Vista desnormalizada para el frontend / API
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_estadisticas AS
    SELECT
        r.anio,
        r.periodo,
        r.semestre,
        e.dimension,
        e.categoria,
        e.conteo,
        e.porcentaje,
        e.total_anual
    FROM estadisticas e
    JOIN reportes r ON r.id = e.reporte_id;

COMMENT ON VIEW v_estadisticas IS 'Vista desnormalizada lista para consumir desde la API.';

-- ---------------------------------------------------------------------------
-- Queries de ejemplo (comentadas)
-- ---------------------------------------------------------------------------

-- Total de crímenes por año:
-- SELECT anio, MAX(total_anual) AS total_casos
-- FROM v_estadisticas
-- GROUP BY anio ORDER BY anio;

-- Serie temporal de identidades:
-- SELECT anio, categoria, conteo, porcentaje
-- FROM v_estadisticas
-- WHERE dimension = 'identidad_victima'
-- ORDER BY anio, conteo DESC NULLS LAST;

-- Distribución geográfica para un año:
-- SELECT e.categoria, e.conteo, e.porcentaje, p.region
-- FROM v_estadisticas e
-- LEFT JOIN provincias p ON p.nombre = e.categoria
-- WHERE e.anio = 2022 AND e.dimension = 'provincia'
-- ORDER BY e.porcentaje DESC NULLS LAST;
