# Hondo

**Think first. Organize later.**

Your thought is allowed to exist before it is organized, labeled, filed, or made useful.

An AI notepad and workspace for messy capture, automatic organization, source-backed
memory, PDF annotation, and connected thinking across desktop and mobile.

```
You capture.   Hondo maintains.
You ask.       Hondo cites.
You correct.   Hondo learns.
```

Most note tools make you organize before thinking. Hondo lets you think first, then
maintains the structure around the work.

Domain: [hondo.wiki](https://hondo.wiki)

## Workflow

```
Capture → Extract → Connect → Cite → Ask → Revise → Remember
```

Desktop is for depth: long-form writing, PDF reading, annotation review, source
comparison, map inspection. Mobile is for momentum: instant capture, quick PDF mark,
highlight, one question, sync later. Mobile is not a squeezed-down desktop cockpit.

## Structure

Monorepo, pnpm workspaces + Turborepo.

```
hondo/
├── apps/
│   ├── web/       the Hondo app
│   ├── mobile/    Hondo iOS — Expo vs SwiftUI undecided
│   └── site/      hondo.wiki showcase + case study
├── packages/
│   ├── ui/        shared components and design tokens
│   ├── core/      shared product logic and data models
│   └── agent/     agent behavior and memory logic
├── docs/
└── references/
```

## Commands

```sh
pnpm install
pnpm dev        # all apps
pnpm build
pnpm typecheck
```

## Scope notes

PDF import and annotation are core scope, not a later luxury. Annotations are stored
separately from the PDF (Zotero's model) — the file stays stable, the thinking lives
beside it as structured data.

Legal posture for v1: user imports files they have rights to access, files are private
by default, no public sharing of original PDFs, no DRM circumvention, AI processing is
opt-in and disclosed. Full rules in the database.

## Canonical planning

`~/WADE-VAULT/HONDO DATABASE.md` — product definition, decisions, architecture,
PDF/annotation planning, legal notes, roadmap, open questions, daily logs. When this
README and the database disagree, the database wins.

## History

The first prototype lives on, archived and read-only, at
[w-ade/hondo-legacy](https://github.com/w-ade/hondo-legacy).
