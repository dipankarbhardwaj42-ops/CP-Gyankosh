import React, { useState } from 'react';
import { 
  Folder, 
  FolderPlus, 
  ChevronRight, 
  ChevronDown, 
  BookOpen, 
  Scale, 
  ShieldAlert, 
  Bell, 
  FileText, 
  Plus, 
  Tag, 
  Layers, 
  Flame, 
  Filter,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { CategoryItem, DocumentItem, FolderItem } from '../types';

interface FolderSidebarProps {
  categories: CategoryItem[];
  folders: FolderItem[];
  documents: DocumentItem[];
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  selectedSubCategory: string | null;
  onSelectSubCategory: (sub: string | null) => void;
  selectedFolder: FolderItem | null;
  onSelectFolder: (folder: FolderItem | null) => void;
  isAdmin: boolean;
  onOpenAddCategory: () => void;
  onOpenAddFolder: () => void;
}

export const FolderSidebar: React.FC<FolderSidebarProps> = ({
  categories,
  folders,
  documents,
  selectedCategory,
  onSelectCategory,
  selectedSubCategory,
  onSelectSubCategory,
  selectedFolder,
  onSelectFolder,
  isAdmin,
  onOpenAddCategory,
  onOpenAddFolder
}) => {
  // Keep track of which category accordions are expanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'cat-circulars': true,
    'cat-vigilance': true,
    'cat-dop': true,
    'cat-purchase-manual': false,
    'cat-contracts-manual': false
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const getDocCountForCategory = (catName: string) => {
    return documents.filter(d => d.category.toLowerCase() === catName.toLowerCase()).length;
  };

  const getDocCountForSubCategory = (catName: string, subName: string) => {
    return documents.filter(
      d => d.category.toLowerCase() === catName.toLowerCase() && 
           d.subCategory?.toLowerCase() === subName.toLowerCase()
    ).length;
  };

  const getDocCountForFolder = (folderId: string) => {
    return documents.filter(d => d.folderId === folderId).length;
  };

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Scale':
        return <Scale className="w-4 h-4 text-purple-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'Bell':
        return <Bell className="w-4 h-4 text-amber-600" />;
      case 'ShoppingBag':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'FileText':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      default:
        return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Folder Organization Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Folder Organization
            </h2>
          </div>
          {isAdmin && (
            <button
              onClick={onOpenAddFolder}
              className="p-1 rounded-md text-amber-700 hover:text-amber-900 hover:bg-amber-50 cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
              title="Add New Folder"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          )}
        </div>

        <div className="space-y-1">
          <button
            onClick={() => onSelectFolder(null)}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              selectedFolder === null
                ? 'bg-slate-900 text-white font-medium'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Folder className="w-3.5 h-3.5" />
              <span>All Folders</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedFolder === null ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {documents.length}
            </span>
          </button>

          {folders.map(folder => {
            const isSelected = selectedFolder?.id === folder.id;
            const count = getDocCountForFolder(folder.id);

            return (
              <button
                key={folder.id}
                onClick={() => onSelectFolder(isSelected ? null : folder)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-amber-100 text-amber-950 font-semibold ring-1 ring-amber-300'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: folder.color || '#f59e0b' }}
                  />
                  <span className="truncate">{folder.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories & Subcategories Hierarchy */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-700" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Categories & Circulars
            </h2>
          </div>
          {isAdmin && (
            <button
              onClick={onOpenAddCategory}
              className="p-1 rounded-md text-blue-700 hover:text-blue-900 hover:bg-blue-50 cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
              title="Add New Category / Subcategory"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {/* Show All Categories Option */}
          <button
            onClick={() => {
              onSelectCategory(null);
              onSelectSubCategory(null);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              selectedCategory === null
                ? 'bg-blue-900 text-white font-medium'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Categories</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedCategory === null ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {documents.length}
            </span>
          </button>

          {/* Render Each Category Accordion */}
          {categories.map(category => {
            const isCatActive = selectedCategory?.toLowerCase() === category.name.toLowerCase();
            const isExpanded = !!expandedCategories[category.id];
            const catDocCount = getDocCountForCategory(category.name);

            return (
              <div key={category.id} className="rounded-xl border border-slate-100 overflow-hidden">
                <div
                  className={`w-full flex items-center justify-between px-2.5 py-2 text-xs transition-colors ${
                    isCatActive && !selectedSubCategory
                      ? 'bg-blue-50 text-blue-900 font-semibold'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectCategory(isCatActive && !selectedSubCategory ? null : category.name);
                      onSelectSubCategory(null);
                    }}
                    className="flex items-center gap-2 flex-1 text-left cursor-pointer min-w-0"
                  >
                    {getCategoryIcon(category.iconName)}
                    <span className="truncate">{category.name}</span>
                    {category.isCustom && (
                      <span className="text-[9px] bg-slate-200 text-slate-700 px-1 py-0.2 rounded">Custom</span>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {catDocCount}
                    </span>
                    {category.subCategories && category.subCategories.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCategory(category.id);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                        title={isExpanded ? "Collapse subcategories" : "Expand subcategories"}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Subcategories List */}
                {isExpanded && category.subCategories && category.subCategories.length > 0 && (
                  <div className="bg-slate-50/70 border-t border-slate-100 py-1 pl-4 pr-2 space-y-0.5">
                    {category.subCategories.map(sub => {
                      const isSubActive =
                        isCatActive &&
                        selectedSubCategory?.toLowerCase() === sub.name.toLowerCase();
                      const subDocCount = getDocCountForSubCategory(category.name, sub.name);

                      // Special highlight for "Replies submitted to Vigilance" as mentioned in prompt
                      const isVigilanceReplies = sub.name.toLowerCase().includes('replies submitted');

                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            onSelectCategory(category.name);
                            onSelectSubCategory(isSubActive ? null : sub.name);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-[11px] transition-colors text-left cursor-pointer ${
                            isSubActive
                              ? 'bg-indigo-600 text-white font-semibold'
                              : isVigilanceReplies
                              ? 'text-rose-700 hover:bg-rose-50 font-medium'
                              : 'text-slate-600 hover:bg-slate-200/60'
                          }`}
                        >
                          <span className="truncate pr-1 flex items-center gap-1">
                            <span className="text-slate-400">•</span>
                            {sub.name}
                          </span>
                          <span className={`text-[10px] px-1 rounded ${
                            isSubActive ? 'bg-indigo-700 text-white' : 'text-slate-400'
                          }`}>
                            {subDocCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* NUPPL Executive Quick Reference Info */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-4 shadow-sm text-xs">
        <div className="flex items-center gap-2 mb-2 text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
          <Flame className="w-3.5 h-3.5" />
          <span>Entity Highlights</span>
        </div>
        <div className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
          <div className="border-b border-slate-800 pb-1.5">
            <strong className="text-white block">GTPS (Kanpur Nagar)</strong>
            3x660 MW Supercritical Thermal Power Project.
          </div>
          <div>
            <strong className="text-white block">PSOCP (Dumka, Jharkhand)</strong>
            Pachwara South Open Cast Project captive coal mine.
          </div>
        </div>
      </div>
    </aside>
  );
};
