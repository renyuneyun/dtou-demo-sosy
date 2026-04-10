# Task 01 — Project Setup

## Goal

Bootstrap the monorepo project structure for the Solid-DToU demo. This creates the
scaffolding that all subsequent tasks build on.

---

## Context

We are building a demo for **Solid-DToU** — a data-usage-policy system that lets a user
declare once how their data may be used, and lets apps declare how they handle data, so
an automated reasoner can check compatibility without the user needing to read each app's
privacy policy manually.

The demo consists of:
- A shared library (`packages/dtou-client`) wrapping Solid-DToU API calls and types
- Three demo apps in `apps/`:
  - `app-a-journal` — Daily Wellness Journal: reads health data as personal context (policy check: **pass**)
  - `app-b-insights` — Health Insights: reads + writes insights report back to Pod (policy check: **pass**)
  - `app-c-marketplace` — HealthShare Pro: reads + exports for commercial use (policy check: **fail**)
- A demo shell (`apps/demo-shell`) — landing page tying the three apps together

The project root uses **npm workspaces** so all packages share `node_modules`.

---

## Tech Stack

| Concern | Choice |
|---------|--------|
| Build / dev server | Vite 5 |
| UI framework | **Vue 3** + TypeScript (Composition API, `<script setup>`) |
| Styling | Tailwind CSS v3 |
| Solid auth | `@inrupt/solid-client-authn-browser` |
| Solid data access | `@inrupt/solid-client` |
| RDF parsing | `n3` |
| HTTP client | native `fetch` |

---

## Steps

### 1. Root `package.json`

```json
{
  "name": "dtou-demo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "dev:shell":  "npm run dev -w apps/demo-shell",
    "dev:app-a":  "npm run dev -w apps/app-a-journal",
    "dev:app-b":  "npm run dev -w apps/app-b-insights",
    "dev:app-c":  "npm run dev -w apps/app-c-marketplace",
    "build:all":  "npm run build --workspaces --if-present"
  }
}
```

### 2. Root TypeScript config (`tsconfig.base.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

### 3. Scaffold `packages/dtou-client`

```
packages/dtou-client/
  package.json
  tsconfig.json
  src/
    index.ts          (empty barrel — filled in Task 03)
```

`packages/dtou-client/package.json`:
```json
{
  "name": "@dtou-demo/dtou-client",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "dependencies": {
    "n3": "^1.21.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  }
}
```

### 4. Scaffold each app workspace

For each app create the following directory structure.
Apps: `app-a-journal` (port 5101), `app-b-insights` (port 5102),
`app-c-marketplace` (port 5103), `demo-shell` (port 5100).

```
apps/<name>/
  package.json
  tsconfig.json
  vite.config.ts
  index.html
  tailwind.config.js
  postcss.config.js
  .env.example
  src/
    main.ts
    App.vue
    vite-env.d.ts
```

#### `apps/<name>/package.json`

```json
{
  "name": "@dtou-demo/<name>",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev":     "vite --port <port>",
    "build":   "vue-tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@dtou-demo/dtou-client": "*",
    "@inrupt/solid-client": "^2.0.0",
    "@inrupt/solid-client-authn-browser": "^2.0.0",
    "n3": "^1.21.0",
    "vue": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^5.3.0",
    "vue-tsc": "^2.0.0"
  }
}
```

#### `apps/<name>/vite.config.ts`

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@dtou-demo/dtou-client': new URL('../../packages/dtou-client/src/index.ts', import.meta.url).pathname,
    },
  },
})
```

#### `apps/<name>/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "useDefineForClassFields": true
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `apps/<name>/tsconfig.node.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "composite": true },
  "include": ["vite.config.ts"]
}
```

#### `apps/<name>/tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,vue}'],
  theme: { extend: {} },
  plugins: [],
}
```

#### `apps/<name>/postcss.config.js`

```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

#### `apps/<name>/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><!-- App title --></title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

#### `apps/<name>/src/main.ts`

```ts
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
```

Create `apps/<name>/src/style.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### `apps/<name>/src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />
```

#### `apps/<name>/src/App.vue` — placeholder

```vue
<script setup lang="ts">
// Filled in per-app tasks
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <h1 class="text-3xl font-bold text-gray-800"><!-- App Name --></h1>
  </div>
</template>
```

App names / header text:
- `app-a-journal`: "Daily Wellness Journal"
- `app-b-insights`: "Health Insights"
- `app-c-marketplace`: "HealthShare Pro"
- `demo-shell`: "Solid-DToU Demo"

#### `.env.example` (same for all apps)

```
# URL of the Community Solid Server running solid-dtou
VITE_SOLID_SERVER=http://localhost:3000

# WebID of the demo user (Alice)
VITE_WEBID=http://localhost:3000/alice/profile/card#me

# Set to "true" to use mock data without a live server
VITE_DTOU_MOCK=true
```

### 5. `.gitignore`

```
node_modules/
dist/
.env
*.local
```

---

## Acceptance Criteria

- `npm install` from the root succeeds (all workspaces resolve).
- `npm run dev:shell` starts Vite on port 5100.
- `npm run dev:app-a` starts on port 5101, etc.
- Each app renders its placeholder heading without TypeScript or Vue errors.
- `packages/dtou-client/src/index.ts` exists (empty barrel).
