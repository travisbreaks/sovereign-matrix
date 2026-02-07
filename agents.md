# Sovereign Matrix — Agent Context

**Updated**: 2026-02-07 | **Stack**: React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion

## What This Is

Project prioritization system. Scores projects across 4 dimensions (Enjoyment, Resources, Viability, Scale) and sorts them into tiers: BUILD NOW → PRIORITIZE → SUSTAIN → WATCH → KILL/ARCHIVE. The name is intentional — sovereignty over creative direction, ruthless self-honesty about where energy goes.

Currently tracks 24 projects (tech, creative, business, lifestyle, education).

## Architecture

```
src/
├── App.tsx                    # Router shell, renders SovereignMatrix
├── SovereignMatrix.tsx        # Main component (~412 lines) — all UI + state
├── main.tsx                   # Entry point
├── components/
│   ├── ProjectForm.tsx        # Add/edit project form
│   ├── Modal.tsx              # Reusable modal wrapper
│   ├── ConfirmDialog.tsx      # Delete confirmation
│   └── EmptyState.tsx         # No-projects state
├── hooks/
│   └── useLocalStorage.ts     # Generic localStorage persistence hook
├── types/
│   └── project.ts             # Project, Weights, ProjectWithScore, ProjectStatus
└── utils/
    └── projectUtils.ts        # calculateScore, sortProjectsByScore, getStatusGradient
```

## Key Concepts

### Scoring
Linear weighted sum: `score = (E * wE) + (R * wR) + (V * wV) + (S * wS)`

Default weights: all 1.0. User adjusts via sliders in the Control Deck.

### Data Flow
1. Seed data lives in `SovereignMatrix.tsx` (lines ~31-56) — 24 projects with scores
2. On first load, seed data populates localStorage (`sovereign-projects`)
3. All mutations (add/edit/delete) update localStorage via `useLocalStorage` hook
4. Projects are scored and sorted on every render via `sortProjectsByScore()`

### Status Tiers
Each project has a manual `status` field (not auto-calculated from score):
- `BUILD NOW` — green gradient
- `PRIORITIZE` — green-yellow
- `SUSTAIN` — yellow-orange
- `WATCH` — orange-red
- `KILL/ARCHIVE` — red

Color mapping: `getStatusGradient()` in `projectUtils.ts`

## Types

```typescript
interface Project {
  id: string
  name: string
  category: string        // "Creative" | "Tech (Core)" | "Business" | etc.
  enjoyment: number       // 0-10
  resources: number       // 0-10
  viability: number       // 0-10
  scale: number           // 0-10
  status: ProjectStatus
  action: string          // Next action text
}
```

## Dependencies

- `framer-motion` — card animations, layout transitions
- `lucide-react` — icons
- `clsx` + `tailwind-merge` — conditional class composition

## Known Limitations

- **LocalStorage only** — no export, no sync, no backup. Data lives in the browser.
- **No auth** — single user assumed
- **SovereignMatrix.tsx is monolithic** — 412 lines, could be decomposed further

## Development

```bash
npm run dev --workspace=sovereign-matrix   # http://localhost:5173
npm run build --workspace=sovereign-matrix
```
