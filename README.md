# Sovereign Matrix

A dynamic project prioritization system with weighted scoring and real-time visualization. Built to help you ruthlessly prioritize what matters and kill what doesn't.

![sovereign-matrix](https://assets.travisbreaks.com/github/sovereign-matrix.png)

## Features

- **Real-time Weighted Scoring** - Adjust importance across 4 dimensions (Enjoyment, Resources, Viability, Scale)
- **Visual Priority Ranking** - Animated sorting shows what demands your attention
- **LocalStorage Persistence** - Projects and weights survive page refreshes
- **Full CRUD Operations** - Add, edit, and delete projects with intuitive UI
- **Status Gradients** - Color-coded badges from green (BUILD NOW) to red (KILL/ARCHIVE)
- **Cyberpunk Aesthetic** - Neon-themed UI with smooth Framer Motion animations

## Tech Stack

- **React 19** - Modern UI framework with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling with custom neon theme
- **Framer Motion** - Smooth animations and transitions
- **Vite** - Lightning-fast build tool and dev server

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

### Adjusting Weights

Use the sliders in the Control Deck to adjust how much each factor matters:
- **Enjoyment** - How much joy this brings you
- **Resources** - Availability of time, money, skills
- **Viability** - Feasibility and likelihood of success
- **Scale** - Potential impact and reach

Projects automatically re-sort based on your priorities.

### Managing Projects

- **Add** - Click "New Project" button in the header
- **Edit** - Hover over a project card and click the pencil icon
- **Delete** - Hover over a project card and click the trash icon (requires confirmation)

### Status Types

- **BUILD NOW** - Immediate priority, building phase
- **PRIORITIZE** - High priority, ready to execute
- **SUSTAIN** - Maintain current state
- **WATCH** - Monitor but don't invest heavily
- **KILL/ARCHIVE** - Stop or archive

## Data Persistence

All data is stored in browser localStorage:
- `sovereign-projects` - Your project list
- `sovereign-weights` - Your priority weights

Clear your browser data to reset everything.

## License

Personal project - Travis Bonnet © 2026

## Credits

Built with assistance from Gemini and Claude Code.

---

Part of the [travisBREAKS](https://travisbreaks.org) portfolio.
