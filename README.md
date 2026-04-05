# Monitor Crímenes de Odio LGBT+ Argentina

Plataforma web de visualización de datos sobre crímenes de odio y discriminación hacia la comunidad LGBT+ en Argentina (2016–2025).

Los datos provienen exclusivamente de los informes anuales del **Observatorio Nacional de Crímenes de Odio LGBT+**, una iniciativa de la [FALGBT](https://falgbt.org/crimenes-de-odio/) (Federación Argentina LGBT) en conjunto con la Defensoría del Pueblo de la CABA y la Defensoría del Pueblo de la Nación.

---

## Sobre el proyecto

El Observatorio publica informes anuales (y en algunos períodos, semestrales) con estadísticas sobre violencia hacia la comunidad LGBT+. Sin embargo, estos informes son PDFs con datos en prosa narrativa, sin tablas ni formatos reutilizables.

Este proyecto transforma esos informes en una plataforma interactiva que permite:

- Visualizar la evolución de los casos a lo largo del tiempo
- Explorar distribuciones por identidad, provincia, modalidad, autoría, vínculo con el agresor, lugar físico, rango etario y tipo de violencia
- Filtrar por año para comparar períodos
- Acceder a los datos de forma abierta y reutilizable

## Uso de inteligencia artificial

Este proyecto fue desarrollado con asistencia de [Claude Code](https://claude.ai/code) (Anthropic). La IA colaboró en el diseño del pipeline de extracción de datos, la arquitectura del frontend, la escritura de código y la documentación. Todos los datos fueron verificados manualmente por la autora leyendo los informes originales.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Extracción de datos | Python 3.14 + pdfplumber + pandas |
| Base de datos | PostgreSQL vía [Supabase](https://supabase.com) |
| Frontend | React + Vite + TypeScript + Tailwind CSS + Recharts |
| Deploy | Vercel |

---

## Estructura del proyecto

```
monitor-lgbt-argentina/
├── Informes_Observatorio/       # 10 PDFs originales del ONCO/LGBT (2016–2025)
├── scripts/                     # Pipeline de extracción Python
│   ├── main.py                  # Extracción automática vía regex
│   ├── build_master.py          # Genera el dataset desde datos corregidos manualmente
│   ├── seed_db.py               # Carga el dataset a Supabase
│   └── extract/ + normalize/   # Parsers por dimensión + normalización inter-año
├── data/processed/
│   ├── estadisticas_master.csv  # Dataset fuente de verdad (583 filas, 10 años)
│   └── estadisticas_master.json
├── schema/
│   └── database.sql             # DDL PostgreSQL: tablas + vista v_estadisticas
└── frontend/                    # App React (Vite + TypeScript + Tailwind)
    └── src/
        ├── context/             # Fetch único de datos compartido por todas las páginas
        ├── components/          # Gráficos reutilizables (Recharts) + filtros
        ├── pages/               # Home, Víctimas, Violencia, Autoría, Geografía
        └── lib/                 # Cliente Supabase, labels en español, utilidades
```

## Decisiones de arquitectura

- **Sin backend custom**: el frontend consume la API REST de Supabase directamente con `@supabase/supabase-js`. No hay servidor intermediario.
- **Fetch único**: los datos se cargan una sola vez al montar la app y se comparten entre todas las páginas vía React Context.
- **Agregación cross-año**: cuando no hay año seleccionado, los gráficos muestran la suma real de todos los períodos (`conteo_total / total_anual_acumulado × 100`), no el último año disponible.
- **Datos maestros manuales**: el pipeline automático tiene ~60% de cobertura (los PDFs no tienen tablas, todo son datos en prosa). El dataset definitivo se construye en `build_master.py` con correcciones manuales verificadas leyendo cada informe.

---

## Instalación y configuración

### Requisitos previos

- Python 3.11+ con [uv](https://github.com/astral-sh/uv)
- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) (plan gratuito es suficiente)

### 1. Base de datos

1. Crear un proyecto en Supabase
2. Ejecutar `schema/database.sql` en el SQL Editor para crear las tablas y la vista `v_estadisticas`

### 2. Pipeline de datos (Python)

```bash
cd scripts

# Crear entorno virtual e instalar dependencias
uv venv .venv
uv pip install pdfplumber pandas supabase python-dotenv

# Crear archivo de credenciales
cp .env.example .env
# Completar SUPABASE_URL y SUPABASE_KEY en .env

# Regenerar el dataset desde los datos corregidos
.venv/Scripts/python.exe build_master.py   # Windows
# .venv/bin/python build_master.py         # macOS/Linux

# Cargar datos a Supabase
.venv/Scripts/python.exe seed_db.py
```

### 3. Frontend

```bash
cd frontend
npm install

# Crear archivo de variables de entorno
cp .env.example .env
# Completar VITE_SUPABASE_URL y VITE_SUPABASE_KEY en .env

npm run dev       # http://localhost:5173
npm run build     # Build de producción
```

---

## Datos y dimensiones

El dataset cubre 9 dimensiones de análisis para cada año (2016–2025):

| Dimensión | Descripción |
|---|---|
| `identidad_victima` | Identidad de género/orientación sexual de la víctima |
| `tipo_violacion` | Derecho lesionado (vida o integridad física) |
| `tipo_muerte` | Clasificación de las muertes (asesinato, estructural, suicidio) |
| `modalidad` | Cómo ocurrió la violencia (golpes, balazo, puñalada, etc.) |
| `autoria` | Quién perpetró el crimen (personas privadas, Estado, fuerzas de seguridad) |
| `vinculo_agresor` | Relación entre víctima y agresor |
| `rango_etario` | Distribución etaria de las víctimas |
| `provincia` | Distribución geográfica por provincia |
| `lugar_fisico` | Dónde ocurrió el crimen |

---

## Contribuciones

Este es un proyecto con enfoque social y abierto a la comunidad. Si encontrás un error en los datos, tenés una sugerencia de visualización o querés agregar información de nuevos informes, sentite libre de abrir un [Issue](https://github.com/paugrunge/monitor-lgbt-argentina/issues) o enviar un Pull Request.

Al contribuir, por favor tené en cuenta que los datos tratan violencia real hacia personas. Cualquier corrección debe estar respaldada por los informes originales del Observatorio.

---

## Licencia

[MIT](LICENSE) — libre para usar, compartir y adaptar, con atribución.

---

*Datos: [Observatorio Nacional de Crímenes de Odio LGBT+](https://falgbt.org/crimenes-de-odio/) — FALGBT, Defensoría del Pueblo CABA, Defensoría del Pueblo de la Nación.*
