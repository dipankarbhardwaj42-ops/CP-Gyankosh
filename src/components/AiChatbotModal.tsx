import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  BookOpen, 
  FileText, 
  CornerDownLeft, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { ChatMessage, DocumentItem } from '../types';
import { NupplLogo } from './NupplLogo';

interface AiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentItem[];
  initialPrompt?: string;
  onSelectDoc: (doc: DocumentItem) => void;
}

export const AiChatbotModal: React.FC<AiChatbotModalProps> = ({
  isOpen,
  onClose,
  documents,
  initialPrompt,
  onSelectDoc
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your **Gyan Kosh AI Assistant** for NUPPL Contracts & Purchase department. 

I can instantly query and extract exact clauses, guidelines, thresholds, and provisions from our repository, including:
• **Purchase Manual & Contracts Manual** (LD, EoT, GCC)
• **Delegation of Power (DoP)** financial ceilings
• **Vigilance Systemic Improvements** & **Replies submitted to Vigilance**
• **Circulars**: Bank Guarantee (SFMS), GeM ceilings, and Make in India (PPP-MII)

How may I assist you today with GTPS Ghatampur or PSOCP Dumka procurements?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'What is the GeM threshold for direct purchase and L1 comparison?',
    'What is the mandatory SFMS verification requirement for Bank Guarantees?',
    'What are the replies submitted to Vigilance regarding GTPS and PSOCP?',
    'What are the financial powers of GM and ED under Delegation of Power?',
    'What is the local content percentage required for Class-I suppliers?'
  ];

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build relevant context from documents
      const docsContext = documents.map(d => ({
        subject: d.subject,
        refNo: d.refNo,
        category: d.category,
        subCategory: d.subCategory,
        entity: d.entity,
        date: d.date,
        aiSummary: d.aiSummary,
        keyPoints: d.keyPoints,
        contentSample: d.contentSample || d.fullContent
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          documentsContext: docsContext,
          history: messages.slice(-4)
        })
      });

      if (!res.ok) {
        throw new Error('Failed to get answer from AI');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || []
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ Apologies, could not process request: ${err.message}. Please verify server connection.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Chat history cleared. How may I assist you with NUPPL circulars or manuals?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white px-5 py-4 flex items-center justify-between border-b border-indigo-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">Gyan Kosh AI Assistant</h3>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2 py-0.2 rounded-full font-mono">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                NUPPL C&P Knowledge Engine • GTPS & PSOCP Dumka
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-blue-900 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-line prose-xs">
                    {msg.text}
                  </div>

                  {/* Sources / References Cited */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="font-semibold text-slate-400">Sources:</span>
                      {msg.sources.map((src, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 font-medium border border-indigo-100"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-1.5 font-mono ${
                      isUser ? 'text-blue-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                <Loader2 className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                <span>Extracting information from circulars & manuals...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Query Pills */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 overflow-x-auto flex items-center gap-2 shrink-0 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Quick Queries:
          </span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-900 hover:border-indigo-200 text-slate-700 border border-slate-200 text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors shrink-0 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask anything: e.g. 'What is the BG validity requirement for supply contracts?'"
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-600"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
