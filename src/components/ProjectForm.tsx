import { Activity, Briefcase, Cpu, GraduationCap, HeartHandshake, Palette, Video } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import type { Project, ProjectStatus } from '../types/project'

interface ProjectFormProps {
  project?: Project
  onSubmit: (project: Omit<Project, 'id'> | Project) => void
  onCancel: () => void
  mode: 'add' | 'edit'
}

const categories = [
  { value: 'Tech (Core)', icon: Cpu },
  { value: 'Tech (Exp)', icon: Cpu },
  { value: 'Education', icon: GraduationCap },
  { value: 'Creative', icon: Palette },
  { value: 'Content', icon: Video },
  { value: 'Business', icon: Briefcase },
  { value: 'Lifestyle', icon: HeartHandshake },
]

const statuses: ProjectStatus[] = ['BUILD NOW', 'PRIORITIZE', 'SUSTAIN', 'WATCH', 'KILL/ARCHIVE']

export default function ProjectForm({ project, onSubmit, onCancel, mode }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    category: project?.category || 'Tech (Core)',
    enjoyment: project?.enjoyment || 5,
    resources: project?.resources || 5,
    viability: project?.viability || 5,
    scale: project?.scale || 5,
    status: project?.status || ('WATCH' as ProjectStatus),
    action: project?.action || '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (mode === 'edit' && project) {
      onSubmit({ ...formData, id: project.id })
    } else {
      onSubmit(formData)
    }
  }

  const handleSliderChange = (field: keyof typeof formData, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getCategoryIcon = (categoryValue: string) => {
    const category = categories.find((c) => c.value === categoryValue)
    const Icon = category?.icon || Activity
    return <Icon className="w-4 h-4" />
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="block text-sm font-bold uppercase tracking-wider text-neon-cyan">Project Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none"
          placeholder="Enter project name"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="block text-sm font-bold uppercase tracking-wider text-neon-cyan">Category *</label>
        <div className="relative">
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:border-neon-cyan focus:outline-none appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.value}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neon-pink">
            {getCategoryIcon(formData.category)}
          </div>
        </div>
      </div>

      {/* Metrics Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex justify-between text-sm font-bold uppercase tracking-wider text-neon-pink">
            <span>Enjoyment</span>
            <span className="text-gray-400">{formData.enjoyment}</span>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={formData.enjoyment}
            onChange={(e) => handleSliderChange('enjoyment', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-pink"
          />
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm font-bold uppercase tracking-wider text-neon-cyan">
            <span>Resources</span>
            <span className="text-gray-400">{formData.resources}</span>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={formData.resources}
            onChange={(e) => handleSliderChange('resources', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
          />
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm font-bold uppercase tracking-wider text-neon-green">
            <span>Viability</span>
            <span className="text-gray-400">{formData.viability}</span>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={formData.viability}
            onChange={(e) => handleSliderChange('viability', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-green"
          />
        </div>

        <div className="space-y-2">
          <label className="flex justify-between text-sm font-bold uppercase tracking-wider text-neon-gold">
            <span>Scale</span>
            <span className="text-gray-400">{formData.scale}</span>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={formData.scale}
            onChange={(e) => handleSliderChange('scale', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-gold"
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="block text-sm font-bold uppercase tracking-wider text-neon-cyan">Status *</label>
        <select
          required
          value={formData.status}
          onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as ProjectStatus }))}
          className="w-full bg-gray-800 border border-gray-700 px-4 py-2 text-white focus:border-neon-cyan focus:outline-none appearance-none cursor-pointer"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Action */}
      <div className="space-y-2">
        <label className="block text-sm font-bold uppercase tracking-wider text-neon-cyan">Next Steps / Action *</label>
        <textarea
          required
          value={formData.action}
          onChange={(e) => setFormData((prev) => ({ ...prev, action: e.target.value }))}
          className="w-full bg-gray-800 border border-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:border-neon-cyan focus:outline-none min-h-[100px]"
          placeholder="What are the next steps for this project?"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors uppercase text-sm font-bold tracking-wider"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={mode === 'add'}
          className="px-6 py-2 bg-gradient-to-r from-neon-cyan to-neon-green text-black hover:brightness-110 transition-all uppercase text-sm font-bold tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === 'edit' ? 'Save Changes' : 'Add Project'}
        </button>
      </div>
    </form>
  )
}
