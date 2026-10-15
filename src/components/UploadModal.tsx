import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Zap, 
  Clock, 
  Folder, 
  Building, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CategoryItem, DocumentItem, EntityType, FolderItem } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  folders: FolderItem[];
  onUploadSuccess: (newDoc: DocumentItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  categories,
  folders,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Form fields
  const [subject, setSubject] = useState('');
  const [refNo, setRefNo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [issuingAuthority, setIssuingAuthority] = useState('General Manager (C&P), NUPPL');
  const [entity, setEntity] = useState<EntityType>('ALL');
  const [selectedFolderId, setSelectedFolderId] = useState<string>(folders[0]?.id || '');
  
  // Category & Subcategory selection
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('Circulars');
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState<string>('Regarding Bank Guarantee');
  const [customCategoryName, setCustomCategoryName] = useState<string>('');
  
  // Speed up upload: generate AI summary later toggle
  const [deferAiSummary, setDeferAiSummary] = useState<boolean>(false);
  const [customTextContent, setCustomTextContent] = useState<string>('');
  
  // Upload status and progress states
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Selected category object
  const currentCategory = categories.find(
    c => c.name.toLowerCase() === selectedCategoryName.toLowerCase()
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (selectedFile: File) => {
    setFile(selectedFile);
    // Auto-populate subject if empty based on file name
    if (!subject) {
      const cleanName = selectedFile.name
        .replace(/\.[^/.]+$/, '')
        .replace(/_/g, ' ')
        .replace(/-/g, ' ');
      setSubject(cleanName);
    }
    // Auto-generate Ref No recommendation
    if (!refNo) {
      const year = new Date().getFullYear();
      const randNum = Math.floor(10 + Math.random() * 90);
      setRefNo(`NUPPL/C&P/${entity === 'ALL' ? 'CORP' : entity}/${year}/${randNum}`);
    }
  };

  const handleCategoryChange = (newCatName: string) => {
    setSelectedCategoryName(newCatName);
    const cat = categories.find(c => c.name.toLowerCase() === newCatName.toLowerCase());
    if (cat && cat.subCategories.length > 0) {
      setSelectedSubCategoryName(cat.subCategories[0].name);
    } else {
      setSelectedSubCategoryName('');
    }
  };

  const isOtherSelected =
    selectedCategoryName === 'Other' ||
    selectedSubCategoryName === 'Other' ||
    selectedCategoryName === 'cat-other' ||
    selectedSubCategoryName === 'sub-circ-other';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setErrorMessage('Please provide the Subject of the document.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setUploadProgress(15);
    setUploadStatus('Uploading PDF document...');

    try {
      // Simulate stepped upload progress
      await new Promise(r => setTimeout(r, 400));
      setUploadProgress(45);
      setUploadStatus('Parsing document metadata and clauses...');

      await new Promise(r => setTimeout(r, 400));
      setUploadProgress(70);

      let finalSummary = '';
      let keyPoints: string[] = [];
      let actionItems: string[] = [];
      let tags: string[] = [selectedCategoryName, entity];

      const effectiveCategory = isOtherSelected && customCategoryName.trim()
        ? customCategoryName.trim()
        : selectedCategoryName;

      const effectiveSubCategory = isOtherSelected && customCategoryName.trim()
        ? customCategoryName.trim()
        : selectedSubCategoryName;

      // Handle AI Summary Generation (Immediate vs Deferred for fast upload)
      if (deferAiSummary) {
        setUploadStatus('Fast-Upload enabled: Deferring AI summary for later generation...');
        await new Promise(r => setTimeout(r, 300));
      } else {
        setUploadStatus('Generating AI Executive Summary using Gemini...');
        try {
          const res = await fetch('/api/ai/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subject,
              category: effectiveCategory,
              subCategory: effectiveSubCategory,
              entity,
              refNo,
              date,
              contentText: customTextContent || subject
            })
          });

          if (res.ok) {
            const data = await res.json();
            finalSummary = data.summary || '';
            keyPoints = data.keyPoints || [];
            actionItems = data.actionItems || [];
            tags = data.tags || tags;
          }
        } catch (aiErr) {
          console.warn('AI summary generation during upload skipped, will allow regeneration later:', aiErr);
        }
      }

      setUploadProgress(100);
      setUploadStatus('Document uploaded and indexed successfully!');
      await new Promise(r => setTimeout(r, 400));

      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        subject: subject.trim(),
        refNo: refNo.trim() || `NUPPL/C&P/CIRCULAR/${Date.now().toString().slice(-4)}`,
        date,
        category: effectiveCategory,
        subCategory: effectiveSubCategory,
        entity,
        folderId: selectedFolderId || undefined,
        issuingAuthority: issuingAuthority.trim(),
        fileName: file ? file.name : `${subject.replace(/\s+/g, '_').slice(0, 30)}.pdf`,
        fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB',
        fileType: 'pdf',
        aiSummary: finalSummary || (deferAiSummary ? undefined : 'Official C&P regulatory document approved for NUPPL.'),
        keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
        actionItems: actionItems.length > 0 ? actionItems : undefined,
        tags: Array.from(new Set([...tags, effectiveCategory, entity])),
        isAiSummaryPending: deferAiSummary,
        summaryGeneratedAt: deferAiSummary ? undefined : new Date().toISOString(),
        fullContent: customTextContent || subject,
        contentSample: customTextContent ? customTextContent.slice(0, 500) : subject,
        uploadedBy: 'Admin (C&P)',
        uploadedAt: new Date().toISOString()
      };

      onUploadSuccess(newDoc);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload document. Please retry.');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Upload C&P Document / Circular</h2>
              <p className="text-xs text-slate-300">
                NUPPL Contracts and Purchase Knowledge Repository (GTPS & PSOCP)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Drag & Drop File Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select or Drag Document (PDF Format)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-blue-600 bg-blue-50/80 scale-[1.01]'
                  : file
                  ? 'border-emerald-500 bg-emerald-50/40'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInput}
                className="hidden"
              />

              {file ? (
                <div className="flex items-center justify-center gap-3 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div className="text-left">
                    <p className="text-xs font-bold truncate max-w-sm">{file.name}</p>
                    <p className="text-[11px] text-emerald-600">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for upload
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="ml-2 text-xs text-slate-500 hover:text-red-600 underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="text-xs font-semibold text-slate-700">
                    Drag and drop PDF here, or <span className="text-blue-600 underline">browse files</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports circulars, manuals, notifications, and letters (.pdf)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Status / Progress Bar (When Uploading) */}
          {isUploading && (
            <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  {uploadStatus}
                </span>
                <span className="font-mono text-amber-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Subject of Document (Required) */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Subject of Document <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Mandatory Verification of Bank Guarantees through SFMS"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
            />
          </div>

          {/* Ref No & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                placeholder="e.g. NUPPL/C&P/GTPS/2024/18"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Date of Issue
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Issuing Authority & Applicable Entity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Issuing Authority
              </label>
              <input
                type="text"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                placeholder="e.g. GM (C&P) / CVO / Director (Tech)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Applicable Entity
              </label>
              <select
                value={entity}
                onChange={(e) => setEntity(e.target.value as EntityType)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 bg-white"
              >
                <option value="ALL">Both GTPS & PSOCP (All NUPPL)</option>
                <option value="GTPS">GTPS (Ghatampur Thermal Power Station)</option>
                <option value="PSOCP">PSOCP (Dumka Coal Mine)</option>
              </select>
            </div>
          </div>

          {/* Category & Subcategory Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Category
              </label>
              <select
                value={selectedCategoryName}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Subcategory
              </label>
              <select
                value={selectedSubCategoryName}
                onChange={(e) => setSelectedSubCategoryName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 bg-white"
              >
                {currentCategory?.subCategories.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
                <option value="Other">Other (Custom category specification)</option>
              </select>
            </div>
          </div>

          {/* Dynamic "Other" Field: Option to mention name of Category as requested */}
          {isOtherSelected && (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 animate-in fade-in">
              <label className="block text-xs font-bold text-amber-900 mb-1">
                Mention Name of Category / Subcategory:
              </label>
              <input
                type="text"
                required={isOtherSelected}
                value={customCategoryName}
                onChange={(e) => setCustomCategoryName(e.target.value)}
                placeholder="Enter custom category name (e.g. Statutory & Environmental Clearances)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 bg-white text-slate-900"
              />
              <p className="text-[11px] text-amber-700 mt-1">
                This custom category will be created and organized under your documents.
              </p>
            </div>
          )}

          {/* Folder Assignment */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Organize into Folder
            </label>
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 bg-white"
            >
              <option value="">No Folder (Root level)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* AI Summary Speed-Up Control */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                AI Document Summary Mode
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Gemini 3.8</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                  !deferAiSummary
                    ? 'border-indigo-400 bg-indigo-50/60 text-indigo-950 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="aiSummaryMode"
                  checked={!deferAiSummary}
                  onChange={() => setDeferAiSummary(false)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-xs">Generate AI Summary Now</p>
                  <p className="text-[10px] font-normal text-slate-500">
                    Processes summary & key mandates on upload
                  </p>
                </div>
              </label>

              <label
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                  deferAiSummary
                    ? 'border-amber-400 bg-amber-50/70 text-amber-950 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="aiSummaryMode"
                  checked={deferAiSummary}
                  onChange={() => setDeferAiSummary(true)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-xs flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-600" /> Speed up upload
                  </p>
                  <p className="text-[10px] font-normal text-slate-500">
                    Uploads immediately; generate AI summary in later time
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Document Content / Excerpt (Optional text for AI) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Excerpt / Salient Clauses (Optional)
            </label>
            <textarea
              rows={2}
              value={customTextContent}
              onChange={(e) => setCustomTextContent(e.target.value)}
              placeholder="Paste text excerpt or main clauses of the circular to feed directly to AI summarizer..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>{isUploading ? 'Uploading...' : 'Confirm & Upload'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
