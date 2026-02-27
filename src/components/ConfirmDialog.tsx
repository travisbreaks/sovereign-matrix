import { AlertTriangle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="pointer-events-auto bg-gray-900 border-2 border-red-500 p-6 max-w-md w-full mx-4 shadow-[0_0_30px_-10px_var(--color-neon-pink)]"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-2 bg-red-500/20 border border-red-500">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black uppercase text-white mb-2 tracking-tight">{title}</h3>
                  <p className="text-sm text-gray-400">{message}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors uppercase text-sm font-bold tracking-wider"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white hover:brightness-110 transition-all uppercase text-sm font-bold tracking-wider"
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
