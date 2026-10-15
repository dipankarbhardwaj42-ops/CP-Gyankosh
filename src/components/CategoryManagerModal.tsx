import React, { useState } from 'react';
import { X, Plus, Layers, ShieldCheck, Trash2, CheckCircle2 } from 'lucide-react';
import { CategoryItem } from '../types';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  onAddCategory: (newCategory: CategoryItem) => void;
  onAddSubCategory: (categoryId: string, subCategoryName: string) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onAddSubCategory
}) => {
  const [mode, setMode] = useState<'new-category' | 'new-subcategory'>('new-category');
  
  // New Category State
  const [categoryName, setCategoryName] = useState('');
  const [subCategoriesList, setSubCategoriesList] = useState<string[]>(['']);
  const [selectedIcon, setSelectedIcon] = useState('Layers');
  
  // New Subcategory State
  const [targetCategoryId, setTargetCategoryId] = useState<string>(categories[0]?.id || '');
  const [newSubName, setNewSubName] = useState('');

  if (!isOpen) return null;

  const handleAddSubInput = () => {
    setSubCategoriesList([...subCategoriesList, '']);
  };

  const handleSubInputChange = (index: number, val: string) => {
    const updated = [...subCategoriesList];
    updated[index] = val;
    setSubCategoriesList(updated);
  };

  const handleRemoveSubInput = (index: number) => {
    setSubCategoriesList(subCategoriesList.filter((_, i) => i !== index));
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const validSubs = subCategoriesList
      .map(s => s.trim())
      .filter(Boolean)
      .map((name, i) => ({
        id: `sub-custom-${Date.now()}-${i}`,
        name,
        isCustom: true
      }));

    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: categoryName.trim(),
      iconName: selectedIcon,
      subCategories: validSubs,
      isCustom: true
    };

    onAddCategory(newCat);
    onClose();
  };

  const handleCreateSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !targetCategoryId) return;

    onAddSubCategory(targetCategoryId, newSubName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Category Management</h3>
              <p className="text-xs text-slate-400">Admin Control • NUPPL C&P Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
          <button
            onClick={() => setMode('new-category')}
            className={`flex-1 py-3 font-semibold text-center transition-colors cursor-pointer ${
              mode === 'new-category'
                ? 'bg-white text-blue-900 border-b-2 border-blue-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Category
          </button>
          <button
            onClick={() => setMode('new-subcategory')}
            className={`flex-1 py-3 font-semibold text-center transition-colors cursor-pointer ${
              mode === 'new-subcategory'
                ? 'bg-white text-blue-900 border-b-2 border-blue-900'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Add Subcategory to Existing
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5">
          {mode === 'new-category' ? (
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Environmental & Forest Clearances"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Subcategories (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSubInput}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Subcategory
                  </button>
                </div>
                <div className="space-y-2">
                  {subCategoriesList.map((sub, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sub}
                        onChange={(e) => handleSubInputChange(idx, e.target.value)}
                        placeholder={`Subcategory ${idx + 1}`}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {subCategoriesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSubInput(idx)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-900 hover:bg-blue-950 shadow-xs cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateSubCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Select Parent Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={targetCategoryId}
                  onChange={(e) => setTargetCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  New Subcategory Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Replies submitted to Vigilance (GTPS Ash Handling)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-900 hover:bg-blue-950 shadow-xs cursor-pointer"
                >
                  Add Subcategory
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
