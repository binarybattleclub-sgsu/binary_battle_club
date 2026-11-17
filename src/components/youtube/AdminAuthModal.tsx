import React, { useState, useEffect } from 'react';
import { X, Lock, KeyRound, AlertTriangle, ShieldCheck } from 'lucide-react';
import { adminLogin } from '../../services/youtubeService';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPasscode('');
      setError(null);
      setSuccess(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter the administrator passcode.');
      return;
    }

    const ok = adminLogin(passcode);
    if (ok) {
      setError(null);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 600);
    } else {
      setError('Invalid administrator passcode. Access denied.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080D18]/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#101D35] border border-[#243650] rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(8,13,24,0.95)] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close admin modal"
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#080D18] hover:bg-[#172945] border border-[#243650] text-[#9FB0C8] hover:text-[#DCE6F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#38BDF8] flex items-center justify-center shadow-md">
            <Lock size={18} />
          </div>
          <div>
            <h2 id="admin-auth-title" className="text-base sm:text-lg font-bold text-[#DCE6F5]">
              Administrator Authentication
            </h2>
            <p className="text-xs text-[#9FB0C8]">
              Verify club credentials to manage YouTube video resources
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
            <ShieldCheck size={14} className="shrink-0 text-emerald-400" />
            <span>Access verified! Entering administrator session...</span>
          </div>
        )}

        {/* Passcode Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#DCE6F5] mb-1.5">
              <span>ADMIN_ACCESS_KEY</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter club admin passcode..."
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-[#080D18] border border-[#243650] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] text-sm text-[#DCE6F5] placeholder-[#9FB0C8]/50 outline-none transition-all pr-10"
              />
              <KeyRound size={16} className="absolute right-3.5 top-3 text-[#9FB0C8]/60 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={success}
              className="btn-primary flex-1 py-2 text-xs"
            >
              <ShieldCheck size={14} />
              <span>Verify & Enter</span>
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-[#243650]/60 text-center">
          <p className="text-[11px] font-mono text-[#9FB0C8]/60">
            Authorised club leaders and tech wing coordinators only.
          </p>
        </div>
      </div>
    </div>
  );
};
