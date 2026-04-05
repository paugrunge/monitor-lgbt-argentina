# Monitor LGBT+ — Plataforma de Visualización de Crímenes de Odio

Plataforma web para visibilizar datos sobre crímenes de odio y discriminación hacia la comunidad LGBT+ en Argentina, basada en los informes anuales del Observatorio Nacional de Crímenes de Odio LGBT+ (FALGBT).

El objetivo es transformar los informes anuales del Observatorio Nacional de Crímenes de Odio LGBT en herramientas interactivas que permitan identificar tendencias, zonas críticas y cambios en las tipologías de violencia a lo largo del tiempo.

Fuente de datos: https://falgbt.org/crimenes-de-odio/
Los datos presentados en esta plataforma provienen exclusivamente de los informes anuales publicados por el Observatorio Nacional de Crímenes de Odio LGBT+, una iniciativa de la FALGBT (Federación Argentina LGBT) en conjunto con la Defensoría del Pueblo de la CABA y la Defensoría del Pueblo de la Nación.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Extracción de datos | Python 3.14 + pdfplumber + pandas |
| Base de datos | PostgreSQL (Supabase) |
| Frontend | React + Vite + TypeScript + Tailwind CSS + Recharts |
| Deploy | Vercel (frontend) + Supabase (DB) |

---

## Estructura del proyecto

```
Monitor/
├── Informes_Observatorio/        # 10 PDFs del ONCO/LGBT (2016–2025)
├── scripts/                     # Pipeline de extracción Python
│   ├── main.py                  # Extracción automática vía regex
│   ├── build_master.py          # Genera estadisticas_master.csv (datos corregidos manualmente)
│   ├── seed_db.py               # Carga estadisticas_master.csv a Supabase
│   ├── .env                     # Credenciales Supabase (no commitear)
│   ├── .venv/                   # Entorno virtual Python
│   ├── extract/                 # Extractores PDF y parsers por dimensión
│   └── normalize/               # Normalización de categorías inter-año
├── data/
│   ├── raw/                     # JSON crudo por PDF (output intermedio, no commitear)
│   └── processed/
│       ├── estadisticas_master.csv   # Dataset fuente de verdad (583 filas, 10 años)
│       └── estadisticas_master.json
├── schema/
│   └── database.sql             # DDL PostgreSQL: tablas + vista v_estadisticas
└── frontend/                    # App React
    ├── src/
    │   ├── context/EstadisticasContext.tsx  # Fetch único compartido por todas las páginas
    │   ├── lib/
    │   │   ├── supabase.ts      # Cliente + tipo Estadistica
    │   │   ├── labels.ts        # Labels en español para dimensiones y categorías
    │   │   └── utils.ts         # agregarTodosLosAnios() — agregación cross-año
    │   ├── components/          # Header, charts reutilizables, filtros
    │   └── pages/               # Home, Víctimas, Violencia, Autoría, Geografía
    └── .env                     # VITE_SUPABASE_URL + VITE_SUPABASE_KEY (no commitear)
```

---

## Dimensiones de datos

| Dimensión | Categorías principales |
|---|---|
| `identidad_victima` | mujer_trans, gay_cis, varón_trans, lesbiana, no_binarie |
| `tipo_violacion` | derecho_a_la_vida, integridad_fisica |
| `tipo_muerte` | asesinato, muerte_estructural, suicidio |
| `modalidad` | golpes, balazo, puñalada, estrangulamiento, corte, ... |
| `autoria` | persona_privada, estado, fuerzas_seguridad |
| `vinculo_agresor` | desconocido, pareja_noviazgo, cliente_trabajo_sexual, ... |
| `rango_etario` | 10-19, 20-29, 30-39, 40-49, 50-59, 60-69, 70-79 |
| `provincia` | CABA, Buenos Aires, Tucumán, Salta, ... (24 provincias) |
| `lugar_fisico` | via_publica, vivienda_victima, comisaria_penal, ... |

---

## Setup local

### Python (extracción de datos)

```bash
cd scripts
uv venv .venv
uv pip install pdfplumber pandas supabase python-dotenv

# Regenerar CSV desde datos corregidos:
.venv/Scripts/python.exe build_master.py

# Cargar a Supabase (requiere .env con SUPABASE_URL y SUPABASE_KEY):
.venv/Scripts/python.exe seed_db.py
```

### Frontend

```bash
cd frontend
npm install
# Crear frontend/.env con VITE_SUPABASE_URL y VITE_SUPABASE_KEY
#VITE_SUPABASE_URL=tu_url_de_supabase
#VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
npm run dev       # http://localhost:5173
npm run build
```

### Base de datos

Ejecutar `schema/database.sql` en el SQL Editor de Supabase para crear tablas y la vista `v_estadisticas`.

---

## Decisiones de arquitectura

- **Sin backend custom**: el frontend consume la API REST de Supabase directamente. No hay servidor Node.js intermediario.
- **Fetch único**: `EstadisticasContext` fetcha toda la vista `v_estadisticas` (~583 filas) una sola vez. Las 5 páginas consumen el contexto sin re-fetches.
- **Agregación cross-año**: cuando no hay año seleccionado, `agregarTodosLosAnios()` suma conteos reales y recalcula porcentajes (`conteo_total / total_anual_total × 100`). No usa el último año disponible.
- **Datos maestros**: el pipeline automático (`main.py`) tiene ~60% de cobertura. Los datos definitivos viven en `build_master.py` como dict Python y se corrigen manualmente leyendo los PDFs originales.

---

## Fuente de datos — nota metodológica

Los PDFs del Observatorio **no contienen tablas tradicionales**. Los datos estadísticos están embebidos en prosa narrativa:

> *"el 84% de los casos (108) corresponden a mujeres trans"*
> *"Mujeres trans (142) 62,56%"*

La extracción usa regex sobre texto plano extraído con pdfplumber. Los informes 2016/2017 tienen cobertura parcial por formato más simple. Los datos de 2020 y 2021 son semestrales (no anuales).
