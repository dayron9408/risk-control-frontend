# 📋 Frontend - Sistema de Control de Riesgo

<img width="2483" height="1320" alt="image" src="https://github.com/user-attachments/assets/03e86e1f-6164-4e5e-9806-d534e9bb6466" />

## Descripción

Frontend del sistema de control de riesgo desarrollado con **Next.js 16** y **TypeScript**. Proporciona un panel administrativo para gestionar reglas de riesgo, cuentas, operaciones e incidencias.

## Tecnologías principales

- **Next.js 16.0.7** - Framework React con App Router
- **React 19.2.0** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos
- **DaisyUI** - Componentes UI
- **React Query (@tanstack/react-query)** - Gestión de estado y caché
- **Axios** - Cliente HTTP
- **PNPM** - Gestor de paquetes

## Estructura de carpetas

```
src/app/
├── (dashboard)/
│   ├── accounts/          # Página de cuentas
│   ├── incidents/         # Página de incidencias
│   ├── rules/            # Página de reglas
│   └── page.tsx          # Dashboard principal
├── layout.tsx            # Layout principal
├── globals.css           # Estilos globales
├── api.ts                # Cliente API
└── types/                # Tipos TypeScript

src/components/
├── layout/               # Componentes de layout
├── accounts/             # Componentes de cuentas
├── incidents/            # Componentes de incidencias
├── riskrules/            # Componentes de reglas
└── dashboard/            # Componentes del dashboard

src/hooks/                # Custom hooks
src/services/             # Servicios y llamadas API
```

## Configuración

### Prerrequisitos

- **Node.js** >= 18.0.0
- **PNPM** >= 9.0.0

### Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_API_KEY=mW60I7w1FxgUSH2QaGQYroiQouIks5QFa2R4FMi6bTZDFDTjjTp81c2i0neLfn9M
```

> **Nota:** El backend debe estar corriendo en `http://localhost:8000` y aceptar conexiones del frontend.

### Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
pnpm install
```

## Comandos disponibles

| Comando      | Descripción                                              |
| ------------ | -------------------------------------------------------- |
| `pnpm dev`   | Inicia servidor de desarrollo en `http://localhost:3000` |
| `pnpm build` | Construye la aplicación para producción                  |
| `pnpm start` | Inicia la aplicación construida                          |
| `pnpm lint`  | Ejecuta ESLint para verificar calidad de código          |

## 🔌 Conexión con el backend

El frontend se comunica con el backend Laravel mediante:

- **URL Base:** `http://localhost:8000/api/v1`
- **Autenticación:** Header `X-API-KEY` con la clave configurada
- **Cliente API:** Implementado en `/src/services/api.ts`

Ejemplo de configuración:

```typescript
// src/services/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
    "Content-Type": "application/json",
  },
});
```

## Funcionalidades implementadas

### Módulos del panel

1. **Dashboard**

   - Vista general del sistema
   - Métricas y resumen de incidencias

2. **Reglas de Riesgo (Risk Rules)**

   - Listado de reglas configuradas
   - Crear/editar reglas con parámetros dinámicos
   - Asignar acciones a reglas
   - Activar/desactivar reglas

3. **Incidencias (Incidents)**

   - Listado de violaciones de reglas
   - Filtros por usuario, regla o fecha
   - Detalle de cada incidencia

4. **Cuentas (Accounts)**
   - Listado de cuentas de trading
   - Estado de trading (enable/disable)
   - Historial de operaciones

### 🔧 Tipos de reglas soportadas

1. **Duración mínima de operaciones**
2. **Consistencia de volumen de trade**
3. **Cantidad de operaciones en ventana de tiempo**

## UI/UX

- **Diseño responsivo** con Tailwind CSS
- **Componentes modulares** con DaisyUI
- **Notificaciones toast** con react-toastify
- **Iconografía** con Heroicons y Lucide React
- **Formularios accesibles** con Headless UI

## Gestión de estado

- **React Query** para caché y sincronización con el backend
- **Server Components** de Next.js para renderizado optimizado
- **Custom hooks** para lógica reutilizable

## Despliegue

### Desarrollo

```bash
pnpm dev
```

### Producción

```bash
pnpm build
pnpm start
```

La aplicación estará disponible en `http://localhost:3000` (o el puerto configurado).

---
