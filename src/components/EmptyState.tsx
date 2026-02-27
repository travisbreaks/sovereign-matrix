import { AlertCircle, Plus } from 'lucide-react'

interface EmptyStateProps {
  onAddProject: () => void
}

export default function EmptyState({ onAddProject }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-neon-cyan/20 blur-3xl"></div>
        <AlertCircle className="w-24 h-24 text-neon-cyan relative z-10" strokeWidth={1} />
      </div>

      <h3 className="text-2xl font-black uppercase text-white mb-2 tracking-tight">No Projects Yet</h3>

      <p className="text-gray-400 text-center max-w-md mb-8">
        Start building your priority matrix by adding your first project. Track what matters, optimize what works, and
        kill what doesn't.
      </p>

      <button
        type="button"
        onClick={onAddProject}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold uppercase text-sm tracking-wider hover:brightness-110 transition-all shadow-[0_0_20px_-5px_var(--color-neon-cyan)]"
      >
        <Plus className="w-5 h-5" />
        Add Your First Project
      </button>

      <div className="mt-12 grid grid-cols-2 gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-pink"></div>
          <span>Enjoyment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-cyan"></div>
          <span>Resources</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-green"></div>
          <span>Viability</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-neon-gold"></div>
          <span>Scale</span>
        </div>
      </div>
    </div>
  )
}
