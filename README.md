# Hondo

**Think first. Organize later.**

Shared working memory between a person and an AI agent.

The conversation is not the source of truth — a live Markdown file is. As you and the
agent talk, Hondo keeps that file current: decisions, direction, open questions, context.
Talking is simply how the file gets modified.

Domain: [hondo.wiki](https://hondo.wiki)

## Structure

Monorepo, pnpm workspaces + Turborepo.

```
hondo/
├── apps/
│   ├── web/       the Hondo app
│   ├── mobile/    Expo / React Native
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

## History

The first prototype lives on, archived and read-only, at
[w-ade/hondo-legacy](https://github.com/w-ade/hondo-legacy).
