import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  X, 
  Filter, 
  ArrowRight, 
  MessageSquare, 
  FileText,
  CornerDownLeft
} from 'lucide-react';
import { CategoryItem, EntityType, FolderItem } from '../types';

interface SearchAndAiBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  selectedSubCategory: string | null;
  onSelectSubCategory: (sub: string | null) => void;
  selectedFolder: FolderItem | null;
  onSelectFolder: (folder: FolderItem | null) => void;
  selectedEntity: EntityType;
  onSelectEntity: (entity: EntityType) => void;
  categories: CategoryItem[];
  onOpenAiChatWithPrompt: (prompt: string) => void;
}

export const SearchAndAiBar: React.FC<SearchAndAiBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedSubCategory,
  onSelectSubCategory,
  selectedFolder,
  onSelectFolder,
  selectedEntity,
  onSelectEntity,
  categories,
  onOpenAiChatWithPrompt
}) => {
  const [isAiMode, setIsAiMode] = useState(false);

  const sampleQuestions = [
    { label: 'GeM Purchase Ceilings', query: 'What is the GeM threshold for direct purchase and L1 comparison?' },
    { label: 'BG SFMS Verification', query: 'What is the mandatory SFMS verification requirement for Bank Guarantees?' },
    { label: 'DoP for GM/ED', query: 'What are the financial powers of GM and ED under Delegation of Power?' },
    { label: 'Vigilance Reply GTPS', query: 'What reply was submitted to Vigilance regarding reverse auction at GTPS?' },
    { label: 'Make in India Class-I', query: 'What is the local content percentage required for Class-I suppliers?' }
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (isAiMode) {
        onOpenAiChatWithPrompt(searchQuery);
      }
    }
  };

  const hasActiveFilters = Boolean(
    selectedCategory || selectedSubCategory || selectedFolder || selectedEntity !== 'ALL' || searchQuery
  );

  const clearAllFilters = () => {
    onSearchChange('');
    onSelectCategory(null);
    onSelectSubCategory(null);
    onSelectFolder(null);
    onSelectEntity('ALL');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-6">
      {/* Search Input Bar with Integrated AI Assistant Toggle */}
      <div className="relative flex flex-col md:flex-row items-stretch gap-2.5">
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none">
            {isAiMode ? (
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
            ) : (
              <Search className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isAiMode
                ? "Ask Gyan Kosh AI: e.g. 'What is the BG validity for supply contracts at NUPPL?'"
                : "Search circulars, manuals, clauses, GeM guidelines, Bank Guarantee rules, DoP..."
            }
            className={`w-full pl-11 pr-24 py-3 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 ${
              isAiMode
                ? 'border-indigo-300 bg-indigo-50/30 text-indigo-950 placeholder-indigo-400/80 focus:border-indigo-500 focus:ring-indigo-200'
                : 'border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:ring-blue-100'
            }`}
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-12 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Quick Enter Key Indicator */}
          {searchQuery && (
            <button
              onClick={() => {
                if (isAiMode) {
                  onOpenAiChatWithPrompt(searchQuery);
                }
              }}
              className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 cursor-pointer"
              title="Submit search"
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Button: AI Assistant in Search Bar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (searchQuery.trim()) {
                onOpenAiChatWithPrompt(searchQuery);
              } else {
                onOpenAiChatWithPrompt('What are the key circulars and manuals available in CP-Gyan Kosh?');
              }
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 hover:from-indigo-950 hover:to-blue-950 text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ask Gyan Kosh AI</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAiMode(!isAiMode)}
            className={`px-3 py-3 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              isAiMode 
                ? 'bg-indigo-100 border-indigo-300 text-indigo-900' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/70'
            }`}
            title="Toggle between Keyword Filter and AI Question mode"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">{isAiMode ? 'AI Question Mode' : 'AI Prompt Mode'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> AI Prompts:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onOpenAiChatWithPrompt(q.query)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 hover:border-indigo-200 text-slate-600 border border-slate-200/80 transition-all text-[11px] cursor-pointer flex items-center gap-1"
          >
            <span>{q.label}</span>
            <ArrowRight className="w-2.5 h-2.5 opacity-50" />
          </button>
        ))}
      </div>

      {/* Active Filter Tags Row */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium text-[11px]">Filtered By:</span>

            {selectedEntity !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 font-medium">
                Entity: {selectedEntity === 'GTPS' ? 'GTPS Ghatampur' : 'PSOCP Dumka'}
                <button
                  onClick={() => onSelectEntity('ALL')}
                  className="hover:text-blue-950 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedFolder && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-medium">
                📁 Folder: {selectedFolder.name}
                <button
                  onClick={() => onSelectFolder(null)}
                  className="hover:text-amber-950 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                Category: {selectedCategory}
                <button
                  onClick={() => {
                    onSelectCategory(null);
                    onSelectSubCategory(null);
                  }}
                  className="hover:text-slate-950 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSubCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-900 border border-indigo-200 font-medium">
                Subcategory: {selectedSubCategory}
                <button
                  onClick={() => onSelectSubCategory(null)}
                  className="hover:text-indigo-950 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium">
                Query: "{searchQuery}"
                <button
                  onClick={() => onSearchChange('')}
                  className="hover:text-emerald-950 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <button
            onClick={clearAllFilters}
            className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
