import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Sparkles, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Share2, 
  Calendar, 
  Building, 
  Folder, 
  Layers, 
  ShieldAlert, 
  RefreshCw, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DocumentItem, FolderItem } from '../types';
import { NupplLogo } from './NupplLogo';

interface DocumentModalProps {
  document: DocumentItem | null;
  folder?: FolderItem;
  isOpen: boolean;
  onClose: () => void;
  onRegenerateSummary: (docId: string) => Promise<void>;
  onOpenDocByRef?: (refNo: string) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  document,
  folder,
  isOpen,
  onClose,
  onRegenerateSummary,
  onOpenDocByRef
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'content' | 'pdf'>('summary');
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!isOpen || !document) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${document.subject}\nRef: ${document.refNo}\nDate: ${document.date}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerateSummary(document.id);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <NupplLogo size="sm" showSubtitle={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                  {document.refNo}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {document.date}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                {document.subject}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copy citation"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 px-6 pt-2 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-t border-x ${
                activeTab === 'summary'
                  ? 'bg-white text-blue-900 border-slate-200 -mb-px'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Executive Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-t border-x ${
                activeTab === 'content'
                  ? 'bg-white text-blue-900 border-slate-200 -mb-px'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Circular Text</span>
            </button>

            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-t border-x ${
                activeTab === 'pdf'
                  ? 'bg-white text-blue-900 border-slate-200 -mb-px'
                  : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>PDF Document Preview</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 pb-2">
            <span>Size: {document.fileSize}</span>
            <span>•</span>
            <span className="font-mono">{document.fileName}</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Metadata Pill Ribbon */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-semibold text-slate-700">Entity:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-medium">
              {document.entity === 'GTPS' ? 'GTPS Ghatampur (3x660MW)' : document.entity === 'PSOCP' ? 'PSOCP Dumka Coal Block' : 'All NUPPL Units (GTPS & PSOCP)'}
            </span>

            <span className="text-slate-300">|</span>

            <span className="font-semibold text-slate-700">Category:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-900 font-medium">
              {document.category}
            </span>

            {document.subCategory && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
                {document.subCategory}
              </span>
            )}

            {folder && (
              <>
                <span className="text-slate-300">|</span>
                <span className="font-semibold text-slate-700">Folder:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                  <Folder className="w-3 h-3 text-amber-600" />
                  {folder.name}
                </span>
              </>
            )}

            <span className="text-slate-300">|</span>
            <span className="text-slate-500">
              Authority: <strong>{document.issuingAuthority}</strong>
            </span>
          </div>

          {/* TAB 1: AI Executive Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-blue-50/40 to-slate-50 border border-indigo-100 relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                    <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span>AI Executive Brief (Gemini 3.8 Flash)</span>
                  </div>

                  <button
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="flex items-center gap-1.5 text-xs text-indigo-700 hover:text-indigo-950 bg-white hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                    <span>{isRegenerating ? 'Regenerating...' : 'Regenerate AI Analysis'}</span>
                  </button>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed font-normal">
                  {document.aiSummary || 'Summary is being computed or was fast-uploaded. Click Regenerate AI Analysis to compute summary.'}
                </p>
              </div>

              {/* Key Provisions & Mandates */}
              {document.keyPoints && document.keyPoints.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Key Regulatory Rules & Thresholds
                  </h4>
                  <ul className="space-y-2.5">
                    {document.keyPoints.map((point, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Items for C&P Executives */}
              {document.actionItems && document.actionItems.length > 0 && (
                <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-5 shadow-xs">
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    Mandatory Action Items for C&P Executives
                  </h4>
                  <ul className="space-y-2">
                    {document.actionItems.map((act, i) => (
                      <li key={i} className="text-xs text-slate-800 flex items-start gap-2">
                        <span className="font-mono text-amber-700 font-bold">0{i+1}.</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-xs text-slate-400 font-medium">Keywords:</span>
                {document.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Official Circular Layout */}
          {activeTab === 'content' && (
            <div className="bg-slate-50 rounded-2xl border border-slate-300 p-8 shadow-inner font-serif text-slate-900 space-y-6">
              {/* PSU Letterhead */}
              <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
                <h3 className="text-lg font-black tracking-wider text-slate-950 uppercase">
                  Neyveli Uttar Pradesh Power Limited
                </h3>
                <p className="text-xs font-sans tracking-wide text-slate-600">
                  (A Joint Venture of NLC India Limited & UPRVUNL • Equity: 51:49)
                </p>
                <p className="text-xs font-sans text-slate-500 font-medium">
                  Contracts & Purchase Department • GTPS Ghatampur & PSOCP Dumka
                </p>
              </div>

              {/* Ref & Date Block */}
              <div className="flex justify-between items-center text-xs font-sans font-medium text-slate-700">
                <p>Ref No: <span className="font-mono font-bold text-slate-950">{document.refNo}</span></p>
                <p>Date: <span className="font-bold text-slate-950">{document.date}</span></p>
              </div>

              {/* Circular Subject */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 font-sans">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  SUBJECT:
                </span>
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  {document.subject}
                </p>
              </div>

              {/* Circular Clauses Content */}
              <div className="space-y-4 text-xs font-sans leading-relaxed text-slate-800">
                <p>
                  1. In compliance with directives issued by the Board of Directors of NUPPL and statutory guidelines from Ministry of Power / Central Vigilance Commission (CVC), the following procedural instructions are hereby notified for strict implementation across all procurement activities.
                </p>
                <p>
                  2. <strong>Applicability:</strong> This circular applies to all ongoing and upcoming tenders floated for Ghatampur Thermal Power Station (GTPS, 3x660MW) and Pachwara South Open Cast Project (PSOCP, Dumka coal block).
                </p>
                <p>
                  3. <strong>Operational Mandate:</strong>
                  {document.contentSample || document.aiSummary || 'All contracts and purchase dealing officers must ensure due diligence, prompt verification of bank guarantees through SFMS, adherence to GeM thresholds, and transparent tender evaluation.'}
                </p>
                <p>
                  4. Any deviation from these approved guidelines shall require prior written approval of the Competent Authority under the approved Delegation of Power (DoP) with explicit concurrence of Finance.
                </p>
              </div>

              {/* Signatory */}
              <div className="pt-8 border-t border-slate-200 flex justify-between items-end font-sans text-xs">
                <div>
                  <p className="text-slate-500 text-[11px]">Copy to:</p>
                  <ul className="text-[11px] text-slate-600 list-disc list-inside">
                    <li>CEO, NUPPL - for kind info</li>
                    <li>Director (Technical) / Director (Finance)</li>
                    <li>Head of Project, GTPS & PSOCP Dumka</li>
                    <li>Chief Vigilance Officer (CVO)</li>
                    <li>All C&P Executives / Intranet Repository</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-950">{document.issuingAuthority}</p>
                  <p className="text-slate-500">NUPPL Corporate Office</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PDF Document Preview */}
          {activeTab === 'pdf' && (
            <div className="bg-slate-900 rounded-2xl p-6 text-white text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-amber-400">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold">{document.fileName}</h4>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Format: PDF Document • Size: {document.fileSize} • Uploaded by {document.uploadedBy || 'Admin'}
                </p>
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Official scanned PDF document stored securely in CP-Gyan Kosh archive. You can download the pristine file or print an official executive copy.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => alert(`Initiating download for ${document.fileName}...`)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Document</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors border border-slate-700"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Circular</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="font-mono text-[11px]">
            CP-Gyan Kosh Knowledge System • NUPPL
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
