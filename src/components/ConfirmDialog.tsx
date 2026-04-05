import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', cancelLabel = 'Cancel', danger = true, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60" onClick={onCancel} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 8 }} transition={{ duration: 0.2 }}
            className="relative bg-surface-1 rounded-2xl border border-[rgba(255,255,255,0.08)] w-full max-w-[380px] p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-500/10' : 'bg-accent/10'}`}>
                <AlertTriangle size={18} className={danger ? 'text-red-400' : 'text-accent'} />
              </div>
              <div>
                <h3 className="text-[16px] text-text-primary font-medium mb-1" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>{title}</h3>
                <p className="text-[14px] text-text-secondary leading-[1.5]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{message}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={onCancel}
                className="px-4 py-2 rounded-lg text-[13px] text-text-secondary hover:text-text-primary border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all"
                style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
              >{cancelLabel}</button>
              <button onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-[13px] text-white transition-all ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-accent hover:bg-accent-dark'}`}
                style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
              >{confirmLabel}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
