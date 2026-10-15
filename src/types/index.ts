export type EntityType = 'ALL' | 'GTPS' | 'PSOCP' | 'CORPORATE';

export interface SubCategoryItem {
  id: string;
  name: string;
  description?: string;
  isCustom?: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName?: string;
  subCategories: SubCategoryItem[];
  isCustom?: boolean;
}

export interface FolderItem {
  id: string;
  name: string;
  description?: string;
  color?: string;
  entity?: EntityType;
  parentId?: string | null;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  subject: string;
  refNo: string;
  date: string;
  category: string;
  subCategory?: string;
  entity: EntityType;
  folderId?: string;
  issuingAuthority: string;
  fileName: string;
  fileSize: string;
  fileType?: 'pdf' | 'doc' | 'other';
  pdfUrl?: string;
  
  // AI Summary properties
  aiSummary?: string;
  keyPoints?: string[];
  actionItems?: string[];
  tags: string[];
  isAiSummaryPending?: boolean; // When uploaded with deferred summary to speed up upload
  summaryGeneratedAt?: string;

  // Content for search and AI reasoning
  fullContent?: string;
  contentSample?: string;
  uploadedBy?: string;
  uploadedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  relatedDocIds?: string[];
}
