/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { 
  FolderSidebar 
} from './components/FolderSidebar';
import { 
  SearchAndAiBar 
} from './components/SearchAndAiBar';
import { 
  DocumentCard 
} from './components/DocumentCard';
import { 
  DocumentModal 
} from './components/DocumentModal';
import { 
  UploadModal 
} from './components/UploadModal';
import { 
  AiChatbotModal 
} from './components/AiChatbotModal';
import { 
  CategoryManagerModal 
} from './components/CategoryManagerModal';
import { 
  FolderManagerModal 
} from './components/FolderManagerModal';
import { 
  AdminLoginModal 
} from './components/AdminLoginModal';
import { 
  CategoryItem, 
  DocumentItem, 
  EntityType, 
  FolderItem 
} from './types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_DOCUMENTS, 
  INITIAL_FOLDERS 
} from './data/initialData';
import { 
  Layers, 
  Grid, 
  List, 
  SlidersHorizontal, 
  FolderOpen, 
  FileCheck2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function App() {
  // Master state with persistent storage in localStorage
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem('nuppl_cpgk_docs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DOCUMENTS;
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('nuppl_cpgk_categories');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CATEGORIES;
  });

  const [folders, setFolders] = useState<FolderItem[]>(() => {
    try {
      const saved = localStorage.getItem('nuppl_cpgk_folders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FOLDERS;
  });

  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('nuppl_cpgk_admin') === 'true';
  });
  const [adminUser, setAdminUser] = useState<string>(() => {
    return localStorage.getItem('nuppl_cpgk_admin_user') || 'admin@nuppl.in';
  });

  // Filter & Search states
  const [selectedEntity, setSelectedEntity] = useState<EntityType>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<FolderItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal visibility states
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiChatInitialPrompt, setAiChatInitialPrompt] = useState<string>('');
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isFolderManagerOpen, setIsFolderManagerOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nuppl_cpgk_docs', JSON.stringify(documents));
    } catch {}
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem('nuppl_cpgk_categories', JSON.stringify(categories));
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('nuppl_cpgk_folders', JSON.stringify(folders));
    } catch {}
  }, [folders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAdminLogin = (id: string) => {
    setIsAdmin(true);
    setAdminUser(id);
    localStorage.setItem('nuppl_cpgk_admin', 'true');
    localStorage.setItem('nuppl_cpgk_admin_user', id);
    showToast(`Signed in as Administrator (${id})`);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('nuppl_cpgk_admin');
    showToast('Logged out of Admin mode');
  };

  const handleUploadClick = () => {
    if (!isAdmin) {
      showToast('Admin login required to upload new circulars.');
      setIsAdminLoginOpen(true);
    } else {
      setIsUploadOpen(true);
    }
  };

  const handleUploadSuccess = (newDoc: DocumentItem) => {
    setDocuments(prev => [newDoc, ...prev]);
    showToast(`"${newDoc.subject}" uploaded successfully.`);
  };

  const handleDeleteDoc = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    if (selectedDoc?.id === docId) setSelectedDoc(null);
    showToast('Document removed.');
  };

  // Generate / Regenerate AI summary for a document
  const handleGenerateSummary = async (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: doc.subject,
          category: doc.category,
          subCategory: doc.subCategory,
          entity: doc.entity,
          refNo: doc.refNo,
          date: doc.date,
          contentText: doc.fullContent || doc.contentSample || doc.subject
        })
      });

      if (!res.ok) throw new Error('Summarization failed');
      const data = await res.json();

      setDocuments(prev =>
        prev.map(d => {
          if (d.id === docId) {
            return {
              ...d,
              aiSummary: data.summary || d.aiSummary,
              keyPoints: data.keyPoints || d.keyPoints,
              actionItems: data.actionItems || d.actionItems,
              tags: data.tags || d.tags,
              isAiSummaryPending: false,
              summaryGeneratedAt: new Date().toISOString()
            };
          }
          return d;
        })
      );

      // If document is open in modal, update modal view too
      if (selectedDoc?.id === docId) {
        setSelectedDoc(prev =>
          prev
            ? {
                ...prev,
                aiSummary: data.summary || prev.aiSummary,
                keyPoints: data.keyPoints || prev.keyPoints,
                actionItems: data.actionItems || prev.actionItems,
                tags: data.tags || prev.tags,
                isAiSummaryPending: false,
                summaryGeneratedAt: new Date().toISOString()
              }
            : null
        );
      }

      showToast('AI Executive Summary generated via Gemini.');
    } catch (err: any) {
      showToast('Could not generate AI summary. Please retry.');
    }
  };

  const handleAddCategory = (newCat: CategoryItem) => {
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added successfully.`);
  };

  const handleAddSubCategory = (categoryId: string, subCategoryName: string) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subCategories: [
              ...cat.subCategories,
              {
                id: `sub-${Date.now()}`,
                name: subCategoryName,
                isCustom: true
              }
            ]
          };
        }
        return cat;
      })
    );
    showToast(`Subcategory "${subCategoryName}" added.`);
  };

  const handleAddFolder = (newFolder: FolderItem) => {
    setFolders(prev => [...prev, newFolder]);
    showToast(`Folder "${newFolder.name}" created.`);
  };

  const handleOpenAiChatWithPrompt = (prompt: string) => {
    setAiChatInitialPrompt(prompt);
    setIsAiChatOpen(true);
  };

  // Filtered documents calculation
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Entity match
      if (selectedEntity !== 'ALL' && doc.entity !== 'ALL' && doc.entity !== selectedEntity) {
        return false;
      }

      // Folder match
      if (selectedFolder && doc.folderId !== selectedFolder.id) {
        return false;
      }

      // Category match
      if (selectedCategory && doc.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Subcategory match
      if (selectedSubCategory && doc.subCategory?.toLowerCase() !== selectedSubCategory.toLowerCase()) {
        return false;
      }

      // Text search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inSubject = doc.subject.toLowerCase().includes(q);
        const inRef = doc.refNo.toLowerCase().includes(q);
        const inSummary = (doc.aiSummary || '').toLowerCase().includes(q);
        const inAuthority = doc.issuingAuthority.toLowerCase().includes(q);
        const inCategory = doc.category.toLowerCase().includes(q);
        const inSub = (doc.subCategory || '').toLowerCase().includes(q);
        const inTags = doc.tags.some(t => t.toLowerCase().includes(q));

        if (!inSubject && !inRef && !inSummary && !inAuthority && !inCategory && !inSub && !inTags) {
          return false;
        }
      }

      return true;
    });
  }, [documents, selectedEntity, selectedFolder, selectedCategory, selectedSubCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        selectedEntity={selectedEntity}
        onSelectEntity={setSelectedEntity}
        isAdmin={isAdmin}
        onOpenLogin={() => setIsAdminLoginOpen(true)}
        onLogout={handleAdminLogout}
        onOpenUpload={handleUploadClick}
        onOpenAiChat={() => handleOpenAiChatWithPrompt('')}
        totalDocs={documents.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* Search & AI Chatbot Bar */}
        <SearchAndAiBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedSubCategory={selectedSubCategory}
          onSelectSubCategory={setSelectedSubCategory}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          selectedEntity={selectedEntity}
          onSelectEntity={setSelectedEntity}
          categories={categories}
          onOpenAiChatWithPrompt={handleOpenAiChatWithPrompt}
        />

        {/* Content Layout: Folder Sidebar + Document Grid */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Sidebar */}
          <FolderSidebar
            categories={categories}
            folders={folders}
            documents={documents}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedSubCategory={selectedSubCategory}
            onSelectSubCategory={setSelectedSubCategory}
            selectedFolder={selectedFolder}
            onSelectFolder={setSelectedFolder}
            isAdmin={isAdmin}
            onOpenAddCategory={() => setIsCategoryManagerOpen(true)}
            onOpenAddFolder={() => setIsFolderManagerOpen(true)}
          />

          {/* Main Documents Content Area */}
          <div className="flex-1 w-full space-y-4">
            {/* Action Bar / Status Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {selectedCategory || (selectedFolder ? selectedFolder.name : 'Knowledge Repository')}
                </span>
                {selectedSubCategory && (
                  <>
                    <span className="text-slate-300">/</span>
                    <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                      {selectedSubCategory}
                    </span>
                  </>
                )}
                <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                  {filteredDocuments.length} Document{filteredDocuments.length === 1 ? '' : 's'}
                </span>
              </div>

              {/* View Controls & Admin Add shortcut */}
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="text-xs font-semibold text-blue-900 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>+ Upload to this Section</span>
                  </button>
                )}

                <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Grid view"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                      viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="List view"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredDocuments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No documents match the current filter</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting the entity filter, resetting folder or category selections, or searching for other procurement terms.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                      setSelectedSubCategory(null);
                      setSelectedFolder(null);
                      setSelectedEntity('ALL');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocuments.map(doc => {
                  const docFolder = folders.find(f => f.id === doc.folderId);
                  return (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      folder={docFolder}
                      onOpenDoc={setSelectedDoc}
                      onGenerateSummary={handleGenerateSummary}
                      onDeleteDoc={handleDeleteDoc}
                      isAdmin={isAdmin}
                    />
                  );
                })}
              </div>
            ) : (
              /* List / Table View */
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Subject & Reference</th>
                      <th className="py-3 px-3">Entity</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">AI Summary</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDocuments.map(doc => (
                      <tr
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="font-bold text-slate-900 group-hover:text-blue-900 line-clamp-1">
                            {doc.subject}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                            {doc.refNo}
                          </p>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            doc.entity === 'GTPS'
                              ? 'bg-blue-100 text-blue-900'
                              : doc.entity === 'PSOCP'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {doc.entity}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <p className="font-medium text-slate-800">{doc.category}</p>
                          {doc.subCategory && (
                            <p className="text-[10px] text-slate-500">{doc.subCategory}</p>
                          )}
                        </td>

                        <td className="py-3.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                          {doc.date}
                        </td>

                        <td className="py-3.5 px-3 max-w-xs">
                          {doc.isAiSummaryPending ? (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                              Pending (Fast Upload)
                            </span>
                          ) : (
                            <p className="text-slate-600 line-clamp-1 text-[11px]">
                              {doc.aiSummary || 'Summary available'}
                            </p>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDoc(doc);
                            }}
                            className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            Read
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-white font-bold text-sm">
              CP-Gyan Kosh • NUPPL Contracts and Purchase Department
            </p>
            <p className="text-slate-400 text-[11px]">
              A Joint Venture of Neyveli Lignite Corporation India Limited (NLCIL) & UPRVUNL (51:49)
            </p>
            <p className="text-slate-500 text-[10px]">
              GTPS (Ghatampur 3x660MW, Kanpur Nagar) • PSOCP (Dumka Coal Mine, Jharkhand)
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Knowledge Management System</span>
            <span>•</span>
            <span>All Circulars Open Access</span>
            <span>•</span>
            <button
              onClick={() => {
                if (isAdmin) handleAdminLogout();
                else setIsAdminLoginOpen(true);
              }}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              {isAdmin ? 'Admin Sign Out' : 'Admin Portal'}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DocumentModal
        document={selectedDoc}
        folder={folders.find(f => f.id === selectedDoc?.folderId)}
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        onRegenerateSummary={handleGenerateSummary}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        categories={categories}
        folders={folders}
        onUploadSuccess={handleUploadSuccess}
      />

      <AiChatbotModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        documents={documents}
        initialPrompt={aiChatInitialPrompt}
        onSelectDoc={(doc) => {
          setSelectedDoc(doc);
          setIsAiChatOpen(false);
        }}
      />

      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onAddSubCategory={handleAddSubCategory}
      />

      <FolderManagerModal
        isOpen={isFolderManagerOpen}
        onClose={() => setIsFolderManagerOpen(false)}
        onAddFolder={handleAddFolder}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLogin}
      />
    </div>
  );
}
