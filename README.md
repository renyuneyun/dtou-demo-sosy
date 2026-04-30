# DToU Demo — Solid Symposium 2025

A multi-app demonstration of **Solid-DToU** (Data Terms of Use for the Solid ecosystem), showing how data policies are checked automatically — before any data is accessed — and how output data inherits policies from its inputs.

Originally prepared for **Solid Symposium 2026**, and reusable for other venues and general audiences.

## What it demonstrates

Alice stores health data (heart rate, steps, sleep) in her **Solid Pod** and writes a **data policy** once: any app may use her data, but not for `vocab:commercial-research` purposes.

Three apps each declare their own **app policy**. The DToU policy engine checks compatibility automatically:

| App | Theme | DToU outcome | Key feature demonstrated |
|-----|-------|--------------|--------------------------|
| **App A** — Daily Wellness Journal | amber | ✓ Allowed | Basic compatibility check |
| **App B** — Health Insights | teal | ✓ Allowed | Policy derivation — output report inherits Alice's constraints |
| **App C** — HealthShare Pro™ | orange | ✗ Denied | Prohibition — honest app policy triggers automatic block |

The **demo shell** (`http://localhost:5100`) presents all three apps side by side with an explanation of the scenario.

## Background

Solid-DToU is research from the EWADA Project at Oxford's Human-Centred Computing Group, published at WWW 2024.

- Paper: <https://arxiv.org/abs/2403.07587> (DOI: 10.1145/3589334.3645631)
- Policy language specification: <https://me.ryey.icu/solid-dtou/dtou-spec.html>
- Meta-repository: <https://github.com/renyuneyun/solid-dtou>

### Related repositories (from the meta-repo)

| Repository | Description |
|------------|-------------|
| [`renyuneyun/dtou-lang`](https://github.com/renyuneyun/dtou-lang) | DToU policy reasoner — core N3 rules and language |
| [`renyuneyun/CommunitySolidServer`](https://github.com/renyuneyun/CommunitySolidServer) | Modified **Community Solid Server (CSS)** with the DToU engine integrated; exposes the `/dtou` API endpoints used by this demo |
| [`renyuneyun/dtou-demo-app`](https://github.com/renyuneyun/dtou-demo-app) | Earlier demo app accompanying the paper |

> **Where is the CSS code?** The Solid server running at `http://localhost:3000` is the modified Community Solid Server from [`renyuneyun/CommunitySolidServer`](https://github.com/renyuneyun/CommunitySolidServer). That repository contains the DToU engine (as a submodule of `dtou-lang`) and exposes the `/dtou`, `/dtou/compliance`, and `/dtou/derived-policies/{portName}` API endpoints consumed by this demo.

## Project structure

```
dtou-demo-sosy/
├── apps/
│   ├── demo-shell/          # Landing page with scenario overview (port 5100)
│   ├── app-a-journal/       # Daily Wellness Journal (port 5101)
│   ├── app-b-insights/      # Health Insights — writes report back to Pod (port 5102)
│   └── app-c-marketplace/   # HealthShare Pro™ — blocked by DToU (port 5103)
└── packages/
    └── dtou-client/         # Shared client library: policy submission, compliance check, derived-policy fetch
```

## Prerequisites

- Node.js ≥ 18
- The modified Community Solid Server (with DToU extension) running at `http://localhost:3000` (see [`renyuneyun/CommunitySolidServer`](https://github.com/renyuneyun/CommunitySolidServer))
- Alice's Pod and health data fixtures loaded (see `fixtures/`)

## Running

```bash
npm install
npm run dev          # starts all four apps concurrently
```

Or start individually:

```bash
npm run dev:shell    # demo shell   → http://localhost:5100
npm run dev:app-a    # App A        → http://localhost:5101
npm run dev:app-b    # App B        → http://localhost:5102
npm run dev:app-c    # App C        → http://localhost:5103
```

Open the demo shell at <http://localhost:5100> to begin.
