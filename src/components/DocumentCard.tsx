import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Calendar, 
  Building, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Folder, 
  Loader2, 
  AlertCircle,
  Trash2,
  Share2
} from 'lucide-react';
import { DocumentItem, FolderItem } from '../types';

interface DocumentCardProps {
  document: DocumentItem;
  folder?: FolderItem;
  onOpenDoc: (doc: DocumentItem) => void;
  onGenerateSummary: (docId: string) => Promise<void>;
  onDeleteDoc?: (docId: string) => void;
  isAdmin: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  folder,
  onOpenDoc,
  onGenerateSummary,
  onDeleteDoc,
  isAdmin
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopyRef = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${document.subject} (Ref: ${document.refNo})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerSummary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGenerating(true);
    try {
      await onGenerateSummary(document.id);
    } finally {
      setIsGenerating(false);
    }
  };

  const getEntityBadge = () => {
    switch (document.entity) {
      case 'GTPS':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            GTPS Ghatampur
          </span>
        );
      case 'PSOCP':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            PSOCP Dumka
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            All NUPPL
          </span>
        );
    }
  };

  return (
    <div 
      onClick={() => onOpenDoc(document)}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between cursor-pointer relative overflow-hidden"
    >
      {/* Top Meta Line: Badges & Ref No */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {getEntityBadge()}

            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
              {document.category}
            </span>

            {document.subCategory && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {document.subCategory}
              </span>
            )}
          </div>

          {folder && (
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              <Folder className="w-3 h-3 text-amber-600" />
              <span className="truncate max-w-[120px]">{folder.name}</span>
            </div>
          )}
        </div>

        {/* Ref No & Date Row */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
          <span className="truncate max-w-[240px] font-medium text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
            {document.refNo}
          </span>
          <span className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Calendar className="w-3 h-3" />
            {document.date}
          </span>
        </div>

        {/* Document Subject */}
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 mb-3 leading-snug">
          {document.subject}
        </h3>

        {/* AI Summary Box */}
        {document.isAiSummaryPending ? (
          <div className="my-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="font-semibold text-[11px]">Fast-Upload: AI Summary Pending</p>
                <p className="text-[10px] text-amber-700">Uploaded fast without waiting</p>
              </div>
            </div>
            <button
              onClick={handleTriggerSummary}
              disabled={isGenerating}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3" />
                  Generate Now
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="my-2 p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-blue-50/40 group-hover:border-blue-100 transition-colors">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-900 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                AI Executive Summary
              </span>
              <span className="text-[9px] text-slate-400 font-mono">Gemini 3.8</span>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {document.aiSummary || 'Document summary available. Click to open and read executive brief.'}
            </p>
          </div>
        )}

        {/* Issuing Authority */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate text-[11px] font-medium text-slate-600">
            {document.issuingAuthority}
          </span>
        </div>
      </div>

      {/* Footer Tags & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Tags */}
        <div className="flex items-center gap-1 overflow-hidden">
          {document.tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] text-slate-500 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md truncate max-w-[90px]"
            >
              #{tag}
            </span>
          ))}
          {document.tags.length > 2 && (
            <span className="text-[10px] text-slate-400 font-mono">
              +{document.tags.length - 2}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopyRef}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Copy reference info"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {isAdmin && onDeleteDoc && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Are you sure you want to delete "${document.subject}"?`)) {
                  onDeleteDoc(document.id);
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Delete Document (Admin)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 group-hover:text-blue-700 pl-1">
            Read
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
