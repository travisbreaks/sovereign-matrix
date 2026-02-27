import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="pointer-events-auto bg-gray-900 border border-neon-cyan shadow-[0_0_30px_-10px_var(--color-neon-cyan)] max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-green">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 border border-gray-700 hover:border-neon-pink transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-neon-pink" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
