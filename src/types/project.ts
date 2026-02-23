export type ProjectStatus = 'BUILD NOW' | 'SUSTAIN' | 'PRIORITIZE' | 'WATCH' | 'KILL/ARCHIVE'

export interface Project {
  id: string
  name: string
  category: string
  enjoyment: number
  resources: number
  viability: number
  scale: number
  status: ProjectStatus
  action: string
}

export interface Weights {
  enjoyment: number
  resources: number
  viability: number
  scale: number
}

export interface ProjectWithScore extends Project {
  score: number
}
