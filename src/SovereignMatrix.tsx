import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    GraduationCap,
    Palette,
    Video,
    Briefcase,
    HeartHandshake,
    Activity,
    Plus,
    Pencil,
    Trash2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Project, Weights } from './types/project';
import { useLocalStorage } from './hooks/useLocalStorage';
import { sortProjectsByScore, generateProjectId, getStatusGradient } from './utils/projectUtils';
import Modal from './components/Modal';
import ProjectForm from './components/ProjectForm';
import ConfirmDialog from './components/ConfirmDialog';
import EmptyState from './components/EmptyState';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// --- Data ---
const initialProjects: Project[] = [
    // === BUILD NOW ===
    { id: "1", name: "travisBREAKS (Portfolio)", category: "Creative", enjoyment: 10, resources: 10, viability: 10, scale: 8, status: "BUILD NOW", action: "Adaptive discovery engine: genre-selective music paths, SEO/GEO, blog refactor." },
    { id: "2", name: "Project Jasper (AWS/Clawdbot)", category: "Tech (Core)", enjoyment: 9, resources: 10, viability: 9, scale: 8, status: "BUILD NOW", action: "Finalize EC2 instance & repo connection." },
    { id: "3", name: "WGU Psychology Degree", category: "Education", enjoyment: 6, resources: 10, viability: 10, scale: 10, status: "BUILD NOW", action: "Complete current course module THIS WEEK." },

    // === PRIORITIZE ===
    { id: "4", name: "Blog / Content Engine", category: "Creative", enjoyment: 9, resources: 9, viability: 9, scale: 7, status: "PRIORITIZE", action: "Rename from 'codex' (OpenAI stole it). Persona-based routing. SEO driver. IN-FLIGHT." },
    { id: "5", name: "SEO & GEO Implementation", category: "Tech (Core)", enjoyment: 7, resources: 10, viability: 9, scale: 8, status: "PRIORITIZE", action: "Netlify Prerender, JSON-LD schema, /llms.txt, robots.txt, sitemap." },
    { id: "6", name: "Sovereign Matrix", category: "Tech (Core)", enjoyment: 8, resources: 10, viability: 10, scale: 4, status: "PRIORITIZE", action: "Deploy to Netlify. Add data export. Weekly check-in ritual." },
    { id: "7", name: "Anemone Chorales", category: "Creative", enjoyment: 10, resources: 9, viability: 8, scale: 5, status: "PRIORITIZE", action: "Could feed into travisBREAKS music experience. Deploy standalone + integrate." },
    { id: "8", name: "Roots, Ruin, Redemption EP", category: "Creative", enjoyment: 10, resources: 9, viability: 8, scale: 4, status: "PRIORITIZE", action: "Finish mix for 'The People Tree'." },
    { id: "9", name: "Song: BPD Compassion", category: "Creative", enjoyment: 9, resources: 10, viability: 8, scale: 6, status: "PRIORITIZE", action: "Record scratch vocal." },
    { id: "10", name: "Song: Psychosis vs Awakening", category: "Creative", enjoyment: 9, resources: 10, viability: 8, scale: 5, status: "PRIORITIZE", action: "Draft lyrics in blog." },
    { id: "11", name: "Personal Finance (DCA)", category: "Lifestyle", enjoyment: 5, resources: 8, viability: 10, scale: 9, status: "PRIORITIZE", action: "Set auto-transfer; forget it exists." },

    // === SUSTAIN ===
    { id: "12", name: "Kimi Agent Mandala", category: "Creative", enjoyment: 8, resources: 10, viability: 10, scale: 3, status: "SUSTAIN", action: "SHIPPED. Lives on research page. Done unless graduating to main site." },
    { id: "13", name: "Realmskeep Brand Ident", category: "Creative", enjoyment: 7, resources: 10, viability: 10, scale: 3, status: "SUSTAIN", action: "SHIPPED. Porting to Buddy's repo. Done." },
    { id: "14", name: "Claude Usage Dashboard", category: "Tech (Core)", enjoyment: 7, resources: 10, viability: 10, scale: 2, status: "SUSTAIN", action: "SHIPPED to research page. Maintain only." },
    { id: "15", name: "Codex Archive (figma-contribution)", category: "Creative", enjoyment: 6, resources: 10, viability: 10, scale: 3, status: "SUSTAIN", action: "SHIPPED. May evolve as blog refactor lands." },
    { id: "16", name: "Suno Prompting System", category: "Creative", enjoyment: 7, resources: 10, viability: 9, scale: 2, status: "SUSTAIN", action: "Transfer from ChatGPT to Jasper." },
    { id: "17", name: "Jurassic Coders (Satire)", category: "Content", enjoyment: 8, resources: 10, viability: 7, scale: 6, status: "SUSTAIN", action: "Post only when bored; zero pressure." },
    { id: "18", name: "Sandcastle Dreams (Video)", category: "Creative", enjoyment: 9, resources: 7, viability: 5, scale: 6, status: "SUSTAIN", action: "Mocap testing only; do not animate full eps." },
    { id: "19", name: "Dudes 'n Dragons Media", category: "Content", enjoyment: 8, resources: 8, viability: 6, scale: 5, status: "SUSTAIN", action: "Hobby category, not brand." },
    { id: "20", name: "Spirituality Brand", category: "Business", enjoyment: 5, resources: 8, viability: 6, scale: 6, status: "SUSTAIN", action: "Put content on travisBREAKS blog." },
    { id: "21", name: "Project 1137", category: "Tech (Exp)", enjoyment: 8, resources: 10, viability: 10, scale: 2, status: "SUSTAIN", action: "COMPLETE. Lives in portfolio. Stop developing." },

    // === WATCH / EXPERIMENTAL ===
    { id: "22", name: "Visualizer → Music Experience", category: "Tech (Exp)", enjoyment: 9, resources: 8, viability: 7, scale: 5, status: "WATCH", action: "Absorbing into travisBREAKS adaptive music layer. Not standalone." },
    { id: "23", name: "Cymatic Experience", category: "Tech (Exp)", enjoyment: 8, resources: 7, viability: 6, scale: 4, status: "WATCH", action: "R3F decision tree. Untracked. Experimental." },
    { id: "24", name: "Creative Lab", category: "Tech (Exp)", enjoyment: 8, resources: 7, viability: 5, scale: 4, status: "WATCH", action: "Next.js 16 playground. Experimental. No deploy pressure." },
    { id: "25", name: "Sovereign Fitness PWA", category: "Tech (Core)", enjoyment: 8, resources: 8, viability: 9, scale: 6, status: "WATCH", action: "Deprioritized. Push MVP when bandwidth opens." },
    { id: "26", name: "Tiny Home Eval (Bingham)", category: "Lifestyle", enjoyment: 7, resources: 5, viability: 6, scale: 5, status: "WATCH", action: "Collect data; do not buy land yet." },
    { id: "27", name: "Self-Defense Training", category: "Business", enjoyment: 7, resources: 8, viability: 4, scale: 2, status: "WATCH", action: "Do it for fun; don't sell it." },

    // === KILL/ARCHIVE ===
    { id: "28", name: "Men's Community / Red Pill", category: "Business", enjoyment: 4, resources: 6, viability: 5, scale: 7, status: "KILL/ARCHIVE", action: "High burnout; low joy." },
    { id: "29", name: "Homelessness Venture", category: "Business", enjoyment: 6, resources: 2, viability: 3, scale: 9, status: "KILL/ARCHIVE", action: "Operational nightmare." },
    { id: "30", name: "Philanthropic Fund", category: "Business", enjoyment: 8, resources: 0, viability: 1, scale: 10, status: "KILL/ARCHIVE", action: "Requires millions you don't have." },
    { id: "31", name: "Amazon/SBA Funding", category: "Business", enjoyment: 4, resources: 2, viability: 3, scale: 8, status: "KILL/ARCHIVE", action: "Debt trap risk." },
    { id: "32", name: "Business Acquisition", category: "Business", enjoyment: 2, resources: 1, viability: 4, scale: 8, status: "KILL/ARCHIVE", action: "You are buying a job you will hate." },
    { id: "33", name: "Crypto Mining (Home)", category: "Business", enjoyment: 3, resources: 4, viability: 2, scale: 3, status: "KILL/ARCHIVE", action: "3000W heat/noise is sovereign hell." },
    { id: "34", name: "Adv. Creative Web Dev Tech Stack", category: "Business", enjoyment: 8, resources: 6, viability: 5, scale: 7, status: "KILL/ARCHIVE", action: "Absorbed into Jasper development." }
];

// --- Icons Helper ---
const getCategoryIcon = (category: string) => {
    if (category.includes("Tech")) return <Cpu className="w-4 h-4" />;
    if (category.includes("Education")) return <GraduationCap className="w-4 h-4" />;
    if (category.includes("Creative")) return <Palette className="w-4 h-4" />;
    if (category.includes("Content")) return <Video className="w-4 h-4" />;
    if (category.includes("Business")) return <Briefcase className="w-4 h-4" />;
    if (category.includes("Lifestyle")) return <HeartHandshake className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
};

// --- Components ---

const Slider = ({
    label,
    value,
    onChange,
    colorClass,
    accentColor
}: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    colorClass: string;
    accentColor: string;
}) => (
    <div className="flex flex-col gap-1 w-full sm:w-48">
        <div className="flex justify-between text-xs font-bold tracking-wider uppercase">
            <span className={colorClass}>{label}</span>
            <span className="text-gray-400">{value.toFixed(1)}</span>
        </div>
        <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className={cn(
                "w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer hover:brightness-110 transition-all",
                accentColor
            )}
        />
    </div>
);

const ProjectCard = ({
    project,
    score,
    rank,
    totalProjects,
    onEdit,
    onDelete
}: {
    project: Project;
    score: number;
    rank: number;
    totalProjects: number;
    onEdit?: (project: Project) => void;
    onDelete?: (id: string) => void;
}) => {
    const isTop3 = rank < 3;
    const isKillZone = rank >= totalProjects - 5; // Bottom 5 roughly

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isKillZone ? 0.6 : 1, y: 0, scale: isTop3 ? 1.02 : 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
                "relative p-4 border border-gray-800 bg-gray-900/40 backdrop-blur-sm rounded-none",
                "hover:border-gray-600 transition-colors group",
                isTop3 ? "border-neon-cyan/50 bg-gray-900/80 shadow-[0_0_15px_-5px_var(--color-neon-cyan)]" : "",
                isKillZone ? "border-red-900/30 bg-black/50" : ""
            )}
        >
            {/* Action Buttons */}
            {(onEdit || onDelete) && (
                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(project)}
                            className="p-1.5 bg-gray-800/80 hover:bg-neon-cyan/20 border border-gray-700 hover:border-neon-cyan transition-colors"
                            title="Edit project"
                        >
                            <Pencil className="w-3 h-3 text-neon-cyan" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(project.id)}
                            className="p-1.5 bg-gray-800/80 hover:bg-red-500/20 border border-gray-700 hover:border-red-500 transition-colors"
                            title="Delete project"
                        >
                            <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                    )}
                </div>
            )}

            {/* Rank Indicator */}
            <div className="absolute top-2 right-2 flex flex-col items-end">
                <span className={cn(
                    "text-2xl font-black tabular-nums tracking-tighter leading-none",
                    isTop3 ? "text-neon-cyan" : "text-gray-700",
                    isKillZone && "text-red-900"
                )}>
                    {score.toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">Score</span>
            </div>

            <div className="flex flex-col gap-2 pr-12">

                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                        "p-1 rounded bg-gray-800/50",
                        isTop3 ? "text-neon-pink" : "text-gray-400"
                    )}>
                        {getCategoryIcon(project.category)}
                    </span>
                    <h3 className={cn(
                        "font-bold text-lg uppercase tracking-tight truncate",
                        isTop3 ? "text-white" : "text-gray-300"
                    )}>
                        {project.name}
                    </h3>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs uppercase tracking-wider text-gray-500 mb-2">
                    <div className="flex flex-col">
                        <span className="text-neon-pink/70">Enjoyment</span>
                        <span className="font-mono text-gray-300">{project.enjoyment}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-neon-cyan/70">Resources</span>
                        <span className="font-mono text-gray-300">{project.resources}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-neon-green/70">Viability</span>
                        <span className="font-mono text-gray-300">{project.viability}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-neon-gold/70">Scale</span>
                        <span className="font-mono text-gray-300">{project.scale}</span>
                    </div>
                </div>

                {/* Action */}
                <div className="mt-auto pt-3 border-t border-gray-800 flex flex-col gap-2">
                    <span className={cn(
                        "text-xs font-bold px-3 py-1.5 text-white text-center rounded bg-gradient-to-r",
                        getStatusGradient(project.status),
                        isKillZone && "opacity-100" // Ensure status color is visible even in kill zone
                    )}>
                        {project.status}
                    </span>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Next Steps:</span>
                        <span className="text-xs text-gray-400 italic" title={project.action}>
                            "{project.action}"
                        </span>
                    </div>
                </div>
            </div>

            {/* Decorative Corner */}
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-600" />
        </motion.div>
    );
};

export default function SovereignMatrix() {
    const [projects, setProjects] = useLocalStorage<Project[]>('sovereign-projects', initialProjects);
    const [weights, setWeights] = useLocalStorage<Weights>('sovereign-weights', {
        enjoyment: 1.0,
        resources: 1.0,
        viability: 1.0,
        scale: 1.0
    });

    const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const sortedProjects = useMemo(() => {
        return sortProjectsByScore(projects, weights);
    }, [projects, weights]);

    const handleAddProject = useCallback((project: Omit<Project, 'id'>) => {
        setProjects(prev => [...prev, { ...project, id: generateProjectId() }]);
        setModalMode(null);
    }, [setProjects]);

    const handleEditProject = useCallback((updatedProject: Project) => {
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        setModalMode(null);
        setEditingProject(null);
    }, [setProjects]);

    const handleDeleteProject = useCallback((id: string) => {
        setDeleteConfirmId(id);
    }, []);

    const confirmDelete = useCallback(() => {
        if (deleteConfirmId) {
            setProjects(prev => prev.filter(p => p.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        }
    }, [deleteConfirmId, setProjects]);

    const handleEditClick = useCallback((project: Project) => {
        setEditingProject(project);
        setModalMode('edit');
    }, []);

    return (
        <div className="min-h-screen bg-void p-4 md:p-8 font-mono text-gray-100 selection:bg-neon-pink selection:text-white">
            {/* Header Block */}
            <header className="mb-8 border-b border-gray-800 pb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 mb-2">
                            Sovereign Matrix
                        </h1>
                        <p className="text-neon-cyan text-sm tracking-widest uppercase opacity-80">
                            Priority Orchestration // v2.0.0
                        </p>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex gap-4 items-center">
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{projects.length}</div>
                            <div className="text-[10px] uppercase text-gray-500 tracking-wider">Active Entities</div>
                        </div>
                        <button
                            onClick={() => setModalMode('add')}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-green text-black font-bold uppercase text-sm tracking-wider hover:brightness-110 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            New Project
                        </button>
                    </div>
                </div>

                {/* Control Deck */}
                <div className="bg-gray-900/30 border border-gray-800 p-6 backdrop-blur-md">
                    <div className="flex flex-wrap gap-x-8 gap-y-6 justify-between">
                        <Slider
                            label="Enjoyment Weight"
                            value={weights.enjoyment}
                            onChange={(v) => setWeights(prev => ({ ...prev, enjoyment: v }))}
                            colorClass="text-neon-pink"
                            accentColor="accent-neon-pink"
                        />
                        <Slider
                            label="Resource Weight"
                            value={weights.resources}
                            onChange={(v) => setWeights(prev => ({ ...prev, resources: v }))}
                            colorClass="text-neon-cyan"
                            accentColor="accent-neon-cyan"
                        />
                        <Slider
                            label="Viability Weight"
                            value={weights.viability}
                            onChange={(v) => setWeights(prev => ({ ...prev, viability: v }))}
                            colorClass="text-neon-green"
                            accentColor="accent-neon-green"
                        />
                        <Slider
                            label="Scale Weight"
                            value={weights.scale}
                            onChange={(v) => setWeights(prev => ({ ...prev, scale: v }))}
                            colorClass="text-neon-gold"
                            accentColor="accent-neon-gold"
                        />
                    </div>
                </div>
            </header>

            {/* Matrix Grid */}
            <main>
                {projects.length === 0 ? (
                    <EmptyState onAddProject={() => setModalMode('add')} />
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        <AnimatePresence>
                            {sortedProjects.map((project, index) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    score={project.score}
                                    rank={index}
                                    totalProjects={projects.length}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteProject}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-12 text-center text-gray-600 text-xs uppercase tracking-widest">
                System Operating Normal • {new Date().getFullYear()} • Travis Bonnet
            </footer>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalMode !== null}
                onClose={() => {
                    setModalMode(null);
                    setEditingProject(null);
                }}
                title={modalMode === 'edit' ? 'Edit Project' : 'Add New Project'}
            >
                <ProjectForm
                    project={editingProject || undefined}
                    onSubmit={(project) => {
                        if (modalMode === 'edit' && 'id' in project) {
                            handleEditProject(project);
                        } else {
                            handleAddProject(project as Omit<Project, 'id'>);
                        }
                    }}
                    onCancel={() => {
                        setModalMode(null);
                        setEditingProject(null);
                    }}
                    mode={modalMode || 'add'}
                />
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={deleteConfirmId !== null}
                title="Delete Project"
                message="Are you sure you want to delete this project? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteConfirmId(null)}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
}
