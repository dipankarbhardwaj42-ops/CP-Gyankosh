import React from 'react';
import { NupplLogo } from './NupplLogo';
import { EntityType } from '../types';
import { 
  Sparkles, 
  Upload, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Flame, 
  Layers, 
  HelpCircle
} from 'lucide-react';

interface NavbarProps {
  selectedEntity: EntityType;
  onSelectEntity: (entity: EntityType) => void;
  isAdmin: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenUpload: () => void;
  onOpenAiChat: () => void;
  totalDocs: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedEntity,
  onSelectEntity,
  isAdmin,
  onOpenLogin,
  onLogout,
  onOpenUpload,
  onOpenAiChat,
  totalDocs
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Gazette / Enterprise Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            NUPPL • Contracts & Purchase Department
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-300">
            A Joint Venture of <strong className="text-white">NLCIL</strong> & <strong className="text-white">UPRVUNL</strong> (Equity: 51:49)
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono">
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
            <Flame className="w-3 h-3 text-orange-400" /> GTPS: 3x660 MW
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
            <Layers className="w-3 h-3 text-amber-400" /> PSOCP: Dumka Coal Mine
          </span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
            {totalDocs} Records
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo & Portal Identity */}
        <div className="flex items-center gap-6">
          <NupplLogo />
        </div>

        {/* Entity Switcher Buttons */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
          <button
            onClick={() => onSelectEntity('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              selectedEntity === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Entities
          </button>
          <button
            onClick={() => onSelectEntity('GTPS')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedEntity === 'GTPS'
                ? 'bg-blue-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            GTPS (Ghatampur)
          </button>
          <button
            onClick={() => onSelectEntity('PSOCP')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              selectedEntity === 'PSOCP'
                ? 'bg-amber-700 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-300"></span>
            PSOCP (Dumka)
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* AI Gyan Kosh Chat Assistant Trigger */}
          <button
            onClick={onOpenAiChat}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all shadow-xs cursor-pointer group"
            title="Ask Gyan Kosh AI Assistant about circulars, GeM, DoP, or Vigilance replies"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Ask AI Assistant</span>
          </button>

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-900 rounded-xl transition-all shadow-xs cursor-pointer"
            title={isAdmin ? "Upload new circular / document" : "Admin login required to upload"}
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Upload Document</span>
          </button>

          {/* Admin Mode Status / Toggle */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline font-semibold">Admin Mode</span>
              <button
                onClick={onLogout}
                className="ml-1 text-emerald-700 hover:text-emerald-950 p-0.5 rounded cursor-pointer"
                title="Log out of Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title="Admin Login for managing categories & uploading"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline font-medium">Admin Portal</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Entity Filter Row */}
      <div className="lg:hidden px-4 pb-2 pt-1 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Entity:</span>
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => onSelectEntity('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium ${
              selectedEntity === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 bg-white border border-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onSelectEntity('GTPS')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium ${
              selectedEntity === 'GTPS' ? 'bg-blue-900 text-white' : 'text-slate-600 bg-white border border-slate-200'
            }`}
          >
            GTPS
          </button>
          <button
            onClick={() => onSelectEntity('PSOCP')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium ${
              selectedEntity === 'PSOCP' ? 'bg-amber-700 text-white' : 'text-slate-600 bg-white border border-slate-200'
            }`}
          >
            PSOCP
          </button>
        </div>
      </div>
    </header>
  );
};
