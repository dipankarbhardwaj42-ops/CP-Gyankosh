import React, { useState } from 'react';
import { X, FolderPlus, Folder } from 'lucide-react';
import { EntityType, FolderItem } from '../types';

interface FolderManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFolder: (folder: FolderItem) => void;
}

export const FolderManagerModal: React.FC<FolderManagerModalProps> = ({
  isOpen,
  onClose,
  onAddFolder
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0f766e');
  const [entity, setEntity] = useState<EntityType>('ALL');

  if (!isOpen) return null;

  const colorPalette = [
    '#0f766e', // teal
    '#1d4ed8', // blue
    '#b45309', // amber
    '#be123c', // rose
    '#4338ca', // indigo
    '#047857', // emerald
    '#334155'  // slate
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      entity,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddFolder(newFolder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Create New Folder</h3>
              <p className="text-xs text-slate-400">Folder Organization System</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Folder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. FY 2024-25 Bank Guarantee Advisories"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Circulars pertaining to SFMS and BG confirmation"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Primary Entity Scope
            </label>
            <select
              value={entity}
              onChange={(e) => setEntity(e.target.value as EntityType)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 bg-white"
            >
              <option value="ALL">All NUPPL (Both GTPS & PSOCP)</option>
              <option value="GTPS">GTPS (Ghatampur 3x660MW)</option>
              <option value="PSOCP">PSOCP (Dumka Coal Mine)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Folder Color Accent
            </label>
            <div className="flex items-center gap-2">
              {colorPalette.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-xs cursor-pointer"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
