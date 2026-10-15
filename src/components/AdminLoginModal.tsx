import React, { useState } from 'react';
import { X, Lock, ShieldCheck, UserCheck, Key, Info } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminId: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [adminId, setAdminId] = useState('admin@nuppl.in');
  const [password, setPassword] = useState('nuppl@admin');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId.trim()) {
      setError('Please provide an Admin ID');
      return;
    }
    // Accept standard NUPPL admin ID
    onLoginSuccess(adminId.trim());
    onClose();
  };

  const handleQuickDemoAdmin = () => {
    onLoginSuccess('admin@nuppl.in');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Admin Authentication</h3>
              <p className="text-xs text-slate-400">Contracts & Purchase Department</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Info */}
        <div className="p-4 bg-blue-50/70 border-b border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Public Read Access:</strong> All documents, search, and the AI Chatbot are available to all executives without login. Admin ID is required only to upload circulars and add new categories.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Admin ID
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="admin@nuppl.in"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
              />
              <span className="absolute right-3 top-2.5 text-[10px] text-slate-400 font-mono">
                Defined Admin
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
            />
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Sign In as Admin</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="w-full py-2 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-amber-700" />
              <span>One-Click Sign In (admin@nuppl.in)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
