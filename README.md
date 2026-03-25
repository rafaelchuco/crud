# API REST CRUD - Usuarios (Node.js + Express + Supabase)

Backend CRUD completo para la tabla `usuarios` usando solamente el cliente oficial de Supabase (`@supabase/supabase-js`).

## Estructura del proyecto

```bash
/project
├── server.js
├── routes/
│   └── usuarios.routes.js
├── controllers/
│   └── usuarios.controller.js
├── config/
│   └── supabase.js
├── .env
├── .gitignore
└── package.json
```

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm run dev
```

o en produccion:

```bash
npm start
```

Servidor por defecto: `http://localhost:10000`

## Variables de entorno

Archivo `.env`:

```env
SUPABASE_URL=TU_URL
SUPABASE_KEY=TU_ANON_KEY
PORT=10000
```

## Endpoints CRUD

### 1) Obtener todos los usuarios

- Metodo: `GET`
- URL: `/usuarios`

### 2) Obtener usuario por ID

- Metodo: `GET`
- URL: `/usuarios/:id`

### 3) Crear usuario

- Metodo: `POST`
- URL: `/usuarios`
- Body JSON:

```json
{
  "nombre": "Juan Perez",
  "email": "juan@correo.com"
}
```

### 4) Actualizar usuario

- Metodo: `PUT`
- URL: `/usuarios/:id`
- Body JSON (uno o ambos):

```json
{
  "nombre": "Juan Actualizado",
  "email": "nuevo@correo.com"
}
```

### 5) Eliminar usuario

- Metodo: `DELETE`
- URL: `/usuarios/:id`

## Ejemplos para Postman

### Crear usuario (POST)

- URL: `http://localhost:10000/usuarios`
- Headers: `Content-Type: application/json`
- Body:

```json
{
  "nombre": "Ana Torres",
  "email": "ana@correo.com"
}
```

### Obtener todos (GET)

- URL: `http://localhost:10000/usuarios`

### Obtener por ID (GET)

- URL: `http://localhost:10000/usuarios/UUID_AQUI`

### Actualizar (PUT)

- URL: `http://localhost:10000/usuarios/UUID_AQUI`
- Body:

```json
{
  "nombre": "Ana Actualizada"
}
```

### Eliminar (DELETE)

- URL: `http://localhost:10000/usuarios/UUID_AQUI`

## Configuracion de Supabase paso a paso

### 1. Crear proyecto en Supabase

1. Entra a https://supabase.com y crea una cuenta o inicia sesion.
2. Crea un nuevo proyecto.
3. Espera a que termine el aprovisionamiento.
4. En `Project Settings` -> `API`, copia:
   - `Project URL` -> valor para `SUPABASE_URL`
   - `anon public key` -> valor para `SUPABASE_KEY`

### 2. Crear tabla `usuarios`

1. En el panel de Supabase, abre `Table Editor`.
2. Crea una nueva tabla con nombre: `usuarios`.
3. Agrega columnas:
   - `id`: tipo `uuid`, Primary Key, Default: `gen_random_uuid()`
   - `nombre`: tipo `text`, Required
   - `email`: tipo `text`, Required
   - `created_at`: tipo `timestamp`, Default: `now()`
4. Guarda los cambios.

Alternativa por SQL:

```sql
create extension if not exists pgcrypto;

create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  created_at timestamp with time zone default now()
);
```

### 3. Desactivar RLS (Row Level Security)

1. En `Table Editor`, entra a la tabla `usuarios`.
2. Ve a la pestaña de seguridad/policies.
3. Desactiva `Enable RLS` para esta tabla.

Nota: Para produccion real, se recomienda mantener RLS activo y crear policies seguras.

## Deploy en Render

### 1. Subir proyecto a GitHub

1. Inicializa repositorio (si aun no existe).
2. Haz commit y push a GitHub.

### 2. Crear Web Service en Render

1. Entra a https://render.com
2. `New` -> `Web Service`
3. Conecta tu repositorio
4. Configura:
   - Build Command: `npm install`
   - Start Command: `npm start`

### 3. Variables de entorno en Render

En `Environment` agrega:

- `SUPABASE_URL` = tu URL de Supabase
- `SUPABASE_KEY` = tu anon key de Supabase
- `PORT` = 10000 (opcional, Render ya inyecta `PORT`)

### 4. Deploy

1. Guarda la configuracion.
2. Render construira y desplegara automaticamente.
3. Prueba:
   - `GET https://TU-SERVICIO.onrender.com/`
   - `GET https://TU-SERVICIO.onrender.com/usuarios`

## Notas tecnicas

- Se usa `async/await` en todos los controladores.
- Hay manejo de errores con `try/catch` y respuestas JSON consistentes.
- Validacion basica para `nombre` y `email`.
- No se usa conexion directa a PostgreSQL.
- Solo se usa el cliente oficial de Supabase.
