# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server with HMR
npm run build    # Type-check (tsc -b) then production build — build fails on any TS error
npm run lint     # ESLint over all .ts/.tsx
npm run preview  # Serve the production build locally
```

There is no test runner configured. `npm run build` is the type-check gate.

## Environment

Requires a `.env` with `VITE_API_BASE_URL` (e.g. `http://localhost:8000`) pointing at the backend. Vite only exposes env vars prefixed with `VITE_`; restart the dev server after editing `.env`. `useFetch` reads this at module load — a missing value makes every request hit an `undefined`-prefixed URL rather than failing loudly.

## Architecture

Single-view React 19 + TypeScript + Vite SPA. The entire UI is `src/App.tsx`; there is no router. Backend communication flows through two layered hooks:

- **`src/hooks/useFetch.ts`** — generic typed HTTP wrapper around `fetch` (`get`/`post`/`put`/`del`), each returning `Promise<T>` and throwing `Error` on non-2xx. Base URL and default JSON headers are set here.
- **`src/hooks/useChat.ts`** — consumes `useFetch` and owns all chat state (`messages`, `isLoading`, `error`, `sessionId`). `sendMessage` optimistically appends the user `Message`, POSTs to `/ask` as `{ message, session_id }`, and appends the assistant reply from `{ answer }`. The `session_id` keys the backend's conversational memory (last 8 messages, 30 min inactivity TTL); `clearChat` regenerates it so "New chat" also resets the server-side conversation. The `Message` shape (`id`/`role`/`timestamp`) is defined and exported here.

`App.tsx` is presentation only — it consumes `useChat` and manages local input/textarea/auto-scroll state. When changing the request/response contract, edit `useChat.ts`, not `App.tsx`.

The `/ask` request/response contract (`{ message, session_id }` → `{ answer }`) is the coupling point with the separate backend service; `session_id` is optional server-side (omitting it makes the request stateless). Keep it in sync with the backend.

Styling is a hand-written dark theme in `src/App.css` (chat layout, bubbles, typing indicator) plus `src/index.css` (reset/base). No CSS framework or component library.
