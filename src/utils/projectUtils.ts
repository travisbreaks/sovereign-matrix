import type { Project, ProjectStatus, ProjectWithScore, Weights } from '../types/project'

export function calculateScore(project: Project, weights: Weights): number {
  return (
    project.enjoyment * weights.enjoyment +
    project.resources * weights.resources +
    project.viability * weights.viability +
    project.scale * weights.scale
  )
}

export function sortProjectsByScore(projects: Project[], weights: Weights): ProjectWithScore[] {
  return [...projects]
    .map((p) => ({
      ...p,
      score: calculateScore(p, weights),
    }))
    .sort((a, b) => b.score - a.score)
}

export function generateProjectId(): string {
  return crypto.randomUUID()
}

export function getStatusGradient(status: ProjectStatus): string {
  const gradients: Record<ProjectStatus, string> = {
    'BUILD NOW': 'from-green-500 to-cyan-500',
    PRIORITIZE: 'from-green-400 to-yellow-500',
    SUSTAIN: 'from-yellow-500 to-orange-500',
    WATCH: 'from-orange-500 to-red-500',
    'KILL/ARCHIVE': 'from-red-500 to-red-900',
  }

  return gradients[status]
}

export function getStatusTextColor(status: ProjectStatus): string {
  const colors: Record<ProjectStatus, string> = {
    'BUILD NOW': 'text-green-400',
    PRIORITIZE: 'text-yellow-400',
    SUSTAIN: 'text-orange-400',
    WATCH: 'text-orange-500',
    'KILL/ARCHIVE': 'text-red-400',
  }

  return colors[status]
}
