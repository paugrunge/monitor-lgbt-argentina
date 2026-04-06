-- ==========================================================================
-- Migración: agregar datos de población censal INDEC a tabla provincias
-- Fuente: Censo Nacional de Población, Hogares y Viviendas 2010 y 2022 (INDEC)
-- Verificar cifras en https://www.indec.gob.ar antes de usar en producción
-- ==========================================================================

ALTER TABLE provincias
  ADD COLUMN IF NOT EXISTS poblacion_2010 INTEGER,
  ADD COLUMN IF NOT EXISTS poblacion_2022 INTEGER;

COMMENT ON COLUMN provincias.poblacion_2010 IS 'Población según Censo Nacional INDEC 2010.';
COMMENT ON COLUMN provincias.poblacion_2022 IS 'Población según Censo Nacional INDEC 2022.';

-- Cargar datos censales por provincia
-- Censo 2022: datos definitivos publicados por INDEC (https://www.indec.gob.ar)
UPDATE provincias SET poblacion_2010 = 15625084, poblacion_2022 = 17523996 WHERE nombre = 'Buenos Aires';
UPDATE provincias SET poblacion_2010 = 2890151,  poblacion_2022 = 3121707  WHERE nombre = 'CABA';
UPDATE provincias SET poblacion_2010 = 367828,   poblacion_2022 = 429562   WHERE nombre = 'Catamarca';
UPDATE provincias SET poblacion_2010 = 1055259,  poblacion_2022 = 1129606  WHERE nombre = 'Chaco';
UPDATE provincias SET poblacion_2010 = 509108,   poblacion_2022 = 592621   WHERE nombre = 'Chubut';
UPDATE provincias SET poblacion_2010 = 3308876,  poblacion_2022 = 3840905  WHERE nombre = 'Córdoba';
UPDATE provincias SET poblacion_2010 = 992595,   poblacion_2022 = 1212696  WHERE nombre = 'Corrientes';
UPDATE provincias SET poblacion_2010 = 1235994,  poblacion_2022 = 1425578  WHERE nombre = 'Entre Ríos';
UPDATE provincias SET poblacion_2010 = 530162,   poblacion_2022 = 607419   WHERE nombre = 'Formosa';
UPDATE provincias SET poblacion_2010 = 673307,   poblacion_2022 = 811611   WHERE nombre = 'Jujuy';
UPDATE provincias SET poblacion_2010 = 318951,   poblacion_2022 = 361859   WHERE nombre = 'La Pampa';
UPDATE provincias SET poblacion_2010 = 333642,   poblacion_2022 = 383865   WHERE nombre = 'La Rioja';
UPDATE provincias SET poblacion_2010 = 1738929,  poblacion_2022 = 2043540  WHERE nombre = 'Mendoza';
UPDATE provincias SET poblacion_2010 = 1101593,  poblacion_2022 = 1278873  WHERE nombre = 'Misiones';
UPDATE provincias SET poblacion_2010 = 551266,   poblacion_2022 = 726590   WHERE nombre = 'Neuquén';
UPDATE provincias SET poblacion_2010 = 638645,   poblacion_2022 = 750768   WHERE nombre = 'Río Negro';
UPDATE provincias SET poblacion_2010 = 1214441,  poblacion_2022 = 1441351  WHERE nombre = 'Salta';
UPDATE provincias SET poblacion_2010 = 681055,   poblacion_2022 = 822853   WHERE nombre = 'San Juan';
UPDATE provincias SET poblacion_2010 = 432310,   poblacion_2022 = 542069   WHERE nombre = 'San Luis';
UPDATE provincias SET poblacion_2010 = 273964,   poblacion_2022 = 337226   WHERE nombre = 'Santa Cruz';
UPDATE provincias SET poblacion_2010 = 3194537,  poblacion_2022 = 3544908  WHERE nombre = 'Santa Fe';
UPDATE provincias SET poblacion_2010 = 874006,   poblacion_2022 = 1060906  WHERE nombre = 'Santiago del Estero';
UPDATE provincias SET poblacion_2010 = 127205,   poblacion_2022 = 185732   WHERE nombre = 'Tierra del Fuego';
UPDATE provincias SET poblacion_2010 = 1448188,  poblacion_2022 = 1731820  WHERE nombre = 'Tucumán';

-- Verificación: debe retornar 24 filas con ambas columnas pobladas
-- SELECT nombre, poblacion_2010, poblacion_2022
-- FROM provincias
-- WHERE poblacion_2010 IS NOT NULL
-- ORDER BY nombre;
