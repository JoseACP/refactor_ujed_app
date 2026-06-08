# Flujo: Croquis y Coordenadas Dinámicas

## Contexto

Actualmente las coordenadas de edificios/aulas y los SVGs de los mapas están hardcodeados en la app móvil. Cualquier cambio requiere publicar una nueva versión. El objetivo es mover todo al backend + Cloudflare R2.

---

## Arquitectura

```
Cloudflare R2          Backend (DB + API)          App Móvil
──────────────         ──────────────────          ──────────────
SVG / imagen  ←─url──  Faculty.mapUrl              fetch mapUrl
del croquis             Building.svgPath            render SVG
                        Room.name / slug            tap → location string
```

---

## Modelo de datos

```sql
Faculty
  id          UUID        PK
  name        VARCHAR     "FAEO"
  slug        VARCHAR     "faeo"
  mapUrl      VARCHAR     "https://r2.dominio.com/maps/faeo.svg"
  createdAt   DATETIME

Building
  id          UUID        PK
  facultyId   UUID        FK → Faculty
  name        VARCHAR     "Planta baja"
  slug        VARCHAR     "planta-baja"
  svgPath     TEXT        "M 10,20 L 80,20 L 80,60 Z"
  createdAt   DATETIME

Room
  id          UUID        PK
  buildingId  UUID        FK → Building
  name        VARCHAR     "Aula 1"
  slug        VARCHAR     "aula-1"
  createdAt   DATETIME
```

> **`svgPath`**: es el atributo `d` del `<path>` dentro del SVG del croquis.
> Permite que la app dibuje el highlight del edificio seleccionado sin hardcodear nada.

---

## Endpoints

### Lectura — usados por la app móvil

```
GET /api/maps/faculties
```
```json
[
  { "id": "uuid", "name": "FAEO", "slug": "faeo", "mapUrl": "https://r2.../faeo.svg" }
]
```

```
GET /api/maps/faculties/:facultyId/buildings
```
```json
[
  { "id": "uuid", "name": "Planta baja", "slug": "planta-baja", "svgPath": "M 10,20 ..." }
]
```

```
GET /api/maps/buildings/:buildingId/rooms
```
```json
[
  { "id": "uuid", "name": "Aula 1", "slug": "aula-1" }
]
```

---

### Admin — para registrar mapas y ubicaciones

```
POST /api/admin/maps/upload
  body: multipart/form-data { file: <SVG> }
  → { url: "https://r2.dominio.com/maps/faeo.svg" }
```
El backend sube el archivo a Cloudflare R2 y devuelve la URL pública.

```
POST /api/admin/maps/faculties
  body: { name, slug, mapUrl }

POST /api/admin/maps/buildings
  body: { facultyId, name, slug, svgPath }

POST /api/admin/maps/rooms
  body: { buildingId, name, slug }
```

---

## Flujo de carga inicial (una vez por facultad)

```
1. Admin sube el SVG del croquis → POST /api/admin/maps/upload
2. Backend sube a R2 (bucket público) → devuelve URL
3. Admin crea la facultad con esa URL → POST /api/admin/maps/faculties
4. Admin registra cada edificio con su svgPath → POST /api/admin/maps/buildings
   (svgPath = el atributo d="" del <path> correspondiente en el SVG)
5. Admin registra cuartos/aulas por edificio → POST /api/admin/maps/rooms
```

---

## Flujo en la app móvil al crear un reporte

```
1. GET /api/maps/faculties
   → mostrar lista de facultades

2. Usuario selecciona facultad
   → GET /api/maps/faculties/:id/buildings
   → descargar Faculty.mapUrl y renderizar el SVG como imagen

3. Usuario toca un edificio en el mapa
   → highlight con el svgPath del edificio

4. GET /api/maps/buildings/:id/rooms
   → mostrar lista de cuartos/aulas

5. Usuario selecciona cuarto
   → construir location: `${faculty.slug}/${building.slug}/${room.slug}`
   → ejemplo: "faeo/planta-baja/aula-1"
```

---

## Formato `location` para POST `/api/reports`

Sin cambios al contrato actual — solo que ahora los slugs vienen de la DB:

```
"faeo/planta-baja/aula-1"
```

---

## Cloudflare R2 — configuración

```
Bucket:       maps-ujed
Acceso:       público (lectura sin autenticación)
Región:       auto

Permisos del backend:
  s3:PutObject     (subir SVGs)
  s3:DeleteObject  (reemplazar)

URL pública base: https://pub-xxxxxx.r2.dev/maps/
```

El backend usa el **AWS S3 SDK** apuntando al endpoint de R2 (son compatibles).
Las variables de entorno necesarias:

```env
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=maps-ujed
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxxxxx.r2.dev
```

---

## Tareas para el backend

| Prioridad | Tarea |
|-----------|-------|
| 1 | Crear modelos `Faculty`, `Building`, `Room` en la DB |
| 2 | Implementar `GET /api/maps/faculties` y sus sub-endpoints |
| 3 | Integrar Cloudflare R2: `POST /api/admin/maps/upload` |
| 4 | Implementar endpoints admin para registrar facultades/edificios/cuartos |

La app móvil **solo consume los GET** — no necesita credenciales de R2 ni acceso admin.

---

## Datos de seed — ubicaciones actuales hardcodeadas

Estas son **todas** las ubicaciones que actualmente están hardcodeadas en la app móvil.
Deben insertarse en la DB como datos iniciales.

> Las coordenadas `x` / `y` son proporcionales a la pantalla (rango 0.0–1.0).
> La app las multiplica por `Dimensions.get('window').width/height` para posicionar los puntos sobre la imagen del mapa.
> El campo `mapImageFile` indica el archivo de imagen local — debe subirse a R2 y guardarse la URL en `Faculty.mapUrl` o `Building.mapUrl` si se decide tener mapa por edificio.

---

### Facultad: FAEO
```
slug:  faeo
name:  FAEO (Antigua Facultad de Enfermería)
```

---

#### Edificio 1 — Planta Alta
```
slug:       planta-alta
name:       Planta Alta
mapImage:   ANTIGUA FAC DE ENFERMERIA PLANTA ALTA-2.png
```

Cuartos y sus coordenadas proporcionales:

| name                  | slug                   | x     | y     | subedificio  |
|-----------------------|------------------------|-------|-------|--------------|
| Aula 1                | aula-1                 | 0.150 | 0.432 | Edificio E   |
| Aula 2                | aula-2                 | 0.150 | 0.472 | Edificio E   |
| Aula 3                | aula-3                 | 0.150 | 0.510 | Edificio E   |
| Aula 4                | aula-4                 | 0.150 | 0.550 | Edificio E   |
| Aula 5                | aula-5                 | 0.150 | 0.590 | Edificio E   |
| Aula 6                | aula-6                 | 0.150 | 0.627 | Edificio E   |
| Aula 7                | aula-7                 | 0.370 | 0.410 | Edificio D   |
| Aula 8                | aula-8                 | 0.370 | 0.442 | Edificio D   |
| Aula 9                | aula-9                 | 0.370 | 0.523 | Edificio D   |
| Aula 10               | aula-10                | 0.370 | 0.556 | Edificio D   |
| Aula 11               | aula-11                | 0.370 | 0.590 | Edificio D   |
| Aula 12               | aula-12                | 0.370 | 0.627 | Edificio D   |
| Aula 13               | aula-13                | 0.460 | 0.300 | Edificio C   |
| Aula 14               | aula-14                | 0.587 | 0.300 | Edificio C   |
| Aula 15               | aula-15                | 0.632 | 0.300 | Edificio C   |
| Aula 16               | aula-16                | 0.830 | 0.305 | Edificio G   |
| Aula 17               | aula-17                | 0.830 | 0.416 | Edificio G   |
| Aula 18               | aula-18                | 0.830 | 0.464 | Edificio G   |
| Aula 19               | aula-19                | 0.830 | 0.507 | Edificio G   |
| Aula 20               | aula-20                | 0.780 | 0.620 | Edificio A   |

---

#### Edificio 2 — Planta Baja
```
slug:       planta-baja
name:       Planta Baja
mapImage:   ANTIGUA FAC DE ENFERMERIA PLANTA BAJA-1.png
```

Cuartos y sus coordenadas proporcionales:

| name                              | slug                              | x     | y     |
|-----------------------------------|-----------------------------------|-------|-------|
| Baños                             | banos                             | 0.190 | 0.470 |
| Bodega                            | bodega                            | 0.100 | 0.470 |
| Aulas de humanidades              | aulas-de-humanidades              | 0.190 | 0.560 |
| Aula 6                            | aula-6                            | 0.190 | 0.640 |
| Archivo Histórico Judicial        | archivo-historico-judicial        | 0.445 | 0.368 |
| Sala de consejo posgrado          | sala-de-consejo-posgrado          | 0.380 | 0.456 |
| Aula A                            | aula-a                            | 0.380 | 0.536 |
| Aula B                            | aula-b                            | 0.380 | 0.564 |
| Oficinas de posgrado Famen        | oficinas-de-posgrado-famen        | 0.380 | 0.590 |
| Baños (zona central)              | banos-zona-central                | 0.587 | 0.356 |
| Archivero                         | archivero                         | 0.586 | 0.376 |
| Comedor                           | comedor                           | 0.757 | 0.338 |
| Restauración de archivos          | restauracion-de-archivos          | 0.757 | 0.358 |
| Archivo histórico                 | archivo-historico                 | 0.757 | 0.380 |
| Aulas de filosofía                | aulas-de-filosofia                | 0.757 | 0.446 |
| Comisión electoral universitaria  | comision-electoral-universitaria  | 0.757 | 0.490 |
| Cafetería                         | cafeteria                         | 0.757 | 0.523 |
| Oficinas administrativas          | oficinas-administrativas          | 0.720 | 0.610 |
| Vestíbulo                         | vestibulo                         | 0.600 | 0.610 |

---

### Notas sobre las coordenadas

- El campo `x` / `y` **no está en el modelo de datos propuesto arriba** — está en `Room`.
  Agrega dos campos `pointX FLOAT` y `pointY FLOAT` al modelo `Room` para guardarlas.
- La app usará estas coordenadas para renderizar los puntos interactivos sobre la imagen del mapa.
- El `subedificio` de Planta Alta es informativo; si se quiere modelar, puede ser un campo `zone VARCHAR` en `Room` o un nivel extra en la jerarquía.

### Resumen de registros a insertar

| Tabla    | Cantidad |
|----------|----------|
| Faculty  | 1        |
| Building | 2        |
| Room     | 39       |
