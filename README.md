# 🖥️ DocuDev

DocuDev es una aplicación MERN (MongoDB, Express, React, Node.js) enfocada en la gestión y elaboración de documentación colaborativa para empresas.

---

## ✨ Características principales

- Creación y edición de documentos de manera colaborativa y en tiempo real.
- Gestión de equipos y organización de colaboradores.
- Vista personalizada para cada usuario con los documentos de sus equipos.
- Control de acceso basado en roles:
  - **Usuario Premium:** permisos avanzados de administración.
  - **Usuario Estándar:** permisos limitados.
- Invitaciones, notificaciones y control de actividad.
- Estadísticas e indicadores visuales.
- UI moderna, clara e intuitiva.

---

## 🛠️ Tecnologías utilizadas

### 🧩 Frontend

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Estado global:** Zustand
- **Llamadas y cacheo de datos:** @tanstack/react-query
- **Tablas dinámicas:** @tanstack/react-table
- **Enrutamiento:** React Router DOM
- **Formularios y validación:** React Hook Form + Zod
- **Editor de texto enriquecido:** BlockNote
- **UI/UX:** React Select, React Datepicker, React Colorful, React Day Picker, Sonner (toasts)
- **Gráficos:** Recharts
- **Internacionalización (i18n):** i18next + react-i18next
- **PDF:** @react-pdf/renderer, html2pdf.js
- **Utilidades:** Axios, Date-fns, Lodash, DOMPurify
- **Componentes adicionales:** React Verification Input, React Swipeable List, React Paginate
- **SVGs como componentes:** vite-plugin-svgr

### 🧪 Backend

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Base de datos:** MongoDB + Mongoose
- **Autenticación:** JWT (jsonwebtoken)
- **Validación de datos:** express-validator
- **Seguridad:** bcrypt, express-rate-limit
- **Gestión de archivos:** Multer
- **Emails transaccionales:** Resend
- **Logs de solicitudes:** Morgan
- **Tareas programadas:** node-cron
- **Entorno y configuración:** dotenv
- **CORS:** cors
- **Colores en consola:** colors

### 🔄 Colaboración en tiempo real

- **Sincronización de documentos:** Yjs + y-websocket + @y/websocket-server

### 🧰 Herramientas de desarrollo

- **Linting y formato:** ESLint + Prettier
- **Transpilación:** TypeScript compiler
- **Servidor de desarrollo:** Nodemon + Concurrently
- **Build tools:** Vite, ts-node
- **Estilos:** PostCSS, Autoprefixer, PostCSS Preset Env
- **Sintaxis coloreada:** Shiki
- **Herramientas de depuración:** @tanstack/react-query-devtools

---

## 🚀 Instalación y configuración

### Requisitos previos

- Node.js >= 18.x
- MongoDB >= 6.x (local o Atlas)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/docudev.git
cd docudev
```

### 2. Configurar el Backend

```bash
cd docudev-back
npm install

# Configurar variables de entorno
cp .env.template .env
# Edita el archivo .env con tus valores:
# - JWT_SECRET: clave secreta para access token JWT
# - JWT_REFRESH_SECRET: clave secreta para refresh token JWT
# - MAX_REFRESH_TOKENS: máximo de refresh tokens permitidos
# - MONGODB_URI: URI de conexión a MongoDB
# - PORT: puerto del servidor API (ej: 3000)
# - WS_PORT: puerto del servidor WebSocket (ej: 1234)
# - FRONTEND_URL: URL del frontend (ej: http://localhost:5173)
# - NODE_ENV: Establece el entorno (development o production)
# - RESEND_API_KEY: clave de API de Resend para emails
# - INACTIVITY_DAYS: días de inactividad antes de cambiar estado a inactivo
```

### 3. Configurar el Frontend

```bash
cd ../docudev-front
npm install

# Configurar variables de entorno
cp .env.template .env
# Las variables por defecto deberían funcionar:
# VITE_API_URL=http://localhost:3000/api
# VITE_WEBSOCKET_URL=ws://localhost:1234
```

---

## 💣 Ejecución

### Desarrollo

#### Backend - API + WebSocket:

```bash
cd docudev-back
npm run dev:all
```

#### Frontend:

```bash
cd docudev-front
npm run dev
```

### Producción

#### Backend:

```bash
cd docudev-back
npm run build
npm run start:all
```

#### Frontend:

```bash
cd docudev-front
npm run build
npm run preview
```

---

## Acceso a la aplicación

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **API:** [http://localhost:3000](http://localhost:3000)

---

## Licencia

**Este software no tiene licencia.**  
Copyright (c) 2025 Gonzalo Vasco López.  
Todos los derechos reservados.  
No está permitido el uso, copia, modificación ni distribución sin autorización expresa del autor.

---
