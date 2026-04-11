<div align="center">

# 🤖 Chatbot AI — Frontend

**Interfaz de chat moderna con soporte Markdown, dark mode y arquitectura de hooks personalizados.**

[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite)](https://vite.dev/)

</div>

---

## ✨ Features

- 💬 **Chat en tiempo real** conectado al backend AI vía `POST /ask`
- 🌙 **Dark mode** como único tema, con paleta de colores indigo/violeta
- 📝 **Renderizado Markdown** — tablas, negritas, listas, código y más
- ⌨️ **Typing indicator** animado mientras el AI procesa la respuesta
- 📜 **Auto-scroll** al último mensaje al recibir nuevas respuestas
- 🧹 **Limpiar chat** con un solo clic
- ⚡ **Enter para enviar**, Shift+Enter para nueva línea
- 🔧 **Variables de entorno** para configurar la URL del backend

---

## 🏗️ Arquitectura

La conexión al backend se maneja a través de **dos hooks personalizados** con separación clara de responsabilidades:

```
src/hooks/
├── useFetch.ts   ← HTTP genérico (GET, POST, PUT, DELETE)
└── useChat.ts    ← Lógica del chat, consume useFetch
```

### `useFetch`
Hook genérico que encapsula los métodos HTTP. Recibe una `baseUrl` (por defecto desde `.env`) y retorna funciones tipadas con genéricos `<T>`:

```ts
const { get, post, put, del } = useFetch();

const data = await post<{ answer: string }>('/ask', { message: 'Hola' });
```

### `useChat`
Consume `useFetch` y maneja el estado completo de la conversación:

```ts
const { messages, isLoading, error, sendMessage, clearChat } = useChat();
```

| Valor | Tipo | Descripción |
|---|---|---|
| `messages` | `Message[]` | Historial de la conversación |
| `isLoading` | `boolean` | `true` mientras espera respuesta del AI |
| `error` | `string \| null` | Mensaje de error si el request falla |
| `sendMessage` | `(text: string) => void` | Envía un mensaje al backend |
| `clearChat` | `() => void` | Limpia el historial |

---

## 📁 Estructura del proyecto

```
chatbot_frontend/
├── public/
├── src/
│   ├── hooks/
│   │   ├── useFetch.ts       # Hook HTTP genérico
│   │   └── useChat.ts        # Hook del chatbot
│   ├── App.tsx               # UI principal del chat
│   ├── App.css               # Estilos dark mode
│   ├── index.css             # Reset y base
│   └── main.tsx
├── .env                      # Variables de entorno (no se sube al repo)
├── .env.example              # Plantilla de variables
└── vite.config.ts
```

---

## ⚙️ Variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

> Las variables deben tener el prefijo `VITE_` para ser accesibles desde el cliente. Reiniciar el servidor de desarrollo tras cualquier cambio en `.env`.

---

## 🚀 Instalación y uso

```bash
# 1. Clonar el repositorio
git clone https://github.com/MNATorres/chatbot_frontend.git
cd chatbot_frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# 4. Iniciar el servidor de desarrollo
npm run dev
```

> Asegúrate de que el backend esté corriendo en la URL configurada antes de abrir el chat.

---

## 🔌 API

El frontend consume los siguientes endpoints del backend:

| Método | Endpoint | Body | Respuesta |
|--------|----------|------|-----------|
| `POST` | `/ask` | `{ "message": "string" }` | `{ "answer": "string" }` |
| `GET` | `/` | — | Health check |

---

## 🛠️ Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo con HMR
npm run build    # Build de producción
npm run preview  # Vista previa del build
npm run lint     # Análisis estático con ESLint
```

---

## 📦 Stack

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | UI y estado |
| TypeScript | 6 | Tipado estático |
| Vite | 8 | Bundler y dev server |
| react-markdown | latest | Renderizado de Markdown |
