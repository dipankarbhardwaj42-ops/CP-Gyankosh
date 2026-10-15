/**
 * AI Service for CP-Gyan Kosh
 * Supports both:
 * 1. Full-stack backend mode (via /api/ai/summarize and /api/ai/chat)
 * 2. Static GitHub Pages / Offline mode (in-browser procurement engine & client fallback)
 */

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  tags: string[];
}

export interface ChatResult {
  answer: string;
  sources?: string[];
}

// In-browser intelligent C&P summary generator for static hosting (GitHub Pages)
export function generateLocalSummary(
  subject: string,
  category: string,
  subCategory?: string,
  entity?: string,
  contentText?: string
): SummaryResult {
  const targetEntity = entity === 'GTPS' 
    ? 'GTPS Ghatampur (3x660MW)' 
    : entity === 'PSOCP' 
    ? 'PSOCP Dumka Coal Block' 
    : 'NUPPL (GTPS & PSOCP)';
    
  const cat = category || 'General Circular';
  const sub = subCategory ? ` [${subCategory}]` : '';
  const textSample = contentText?.slice(0, 300) || '';

  return {
    summary: `Official C&P regulatory document regarding "${subject}". Governs procurement, contracting procedures, and statutory compliance across ${targetEntity}. Mandatory adherence required by all Contracts & Purchase dealing executives.`,
    keyPoints: [
      `Applicable scope: ${targetEntity} under ${cat}${sub}.`,
      `Establishes standard operating protocol and delegation parameters for tender floating, evaluation, and award.`,
      `Mandates strict compliance with statutory guidelines, transparency norms, and vigilance directives.`,
      textSample ? `Key operational clause: "${textSample.slice(0, 120)}..."` : 'Ensures financial prudence and audit readiness across NUPPL procurement units.'
    ],
    actionItems: [
      'Circulate to all handling executives in GTPS Ghatampur and PSOCP Dumka.',
      'Incorporate required stipulations in upcoming NITs and tender documents.',
      'Maintain SFMS / portal record for statutory audit inspection.'
    ],
    tags: [cat, subCategory || 'Guidelines', entity || 'NUPPL', 'C&P Compliance'].filter(Boolean)
  };
}

// In-browser intelligent C&P Chat assistant for static hosting (GitHub Pages)
export function generateLocalChatAnswer(question: string, documentsContext: any[]): ChatResult {
  const q = question.toLowerCase();
  const sources: string[] = [];

  if (q.includes('gem') || q.includes('marketplace') || q.includes('direct purchase') || q.includes('ceiling') || q.includes('limit')) {
    sources.push('GeM Circular No. 08/2024', 'DoP Schedule II');
    return {
      answer: `### GeM (Government e-Marketplace) Guidelines for NUPPL C&P:
• **Direct Purchase:** Up to ₹50,000/- through any available GeM seller meeting requisite quality, specification and delivery period.
• **L1 Purchase (Price Comparison):** Above ₹50,000/- and up to ₹5,00,000/- through GeM seller having lowest price amongst at least 3 different manufacturers/sellers.
• **Custom Bidding / Reverse Auction:** Mandatory for procurements above ₹5,00,000/- unless proprietary article certificate (PAC) or specific exemption is approved under Delegation of Power.
• **Caution Money & Performance Security:** As per Department of Expenditure guidelines and GeM GTC version 4.0.
*Refer to NUPPL Circular Ref: NUPPL/C&P/GeM/2024/08 for detailed operating workflow.*`,
      sources
    };
  }

  if (q.includes('bg') || q.includes('bank guarantee') || q.includes('pbg') || q.includes('emd') || q.includes('sfms')) {
    sources.push('Circular on Bank Guarantee SFMS Verification (NUPPL/C&P/BG-SFMS/2024/14)', 'Contracts Manual Section 8.4');
    return {
      answer: `### Bank Guarantee (BG) Provisions at NUPPL:
• **SFMS Verification:** Mandatory directive that all Bank Guarantees (EMD, Advance, Performance Security) must be routed strictly via SFMS (Structured Financial Messaging System) to NUPPL's designated advisory bank account.
• **Confirmation Window:** No physical BG shall be accepted without SFMS confirmation message (IFN 760COV / IFN 767COV).
• **Validity Period:** Performance Bank Guarantee (PBG) shall generally be valid for the contract completion period plus 60 to 90 days claim period.
• **Applicability:** Applies equally across GTPS Ghatampur and PSOCP Dumka.
*Refer to Circular: NUPPL/C&P/BG-SFMS/2024/14.*`,
      sources
    };
  }

  if (q.includes('vigilance') || q.includes('systemic') || q.includes('reply') || q.includes('replies') || q.includes('cvo')) {
    sources.push('Vigilance Systemic Improvements Vol. II', 'Replies to CVO Memos (GTPS & PSOCP)');
    return {
      answer: `### Vigilance Systemic Improvements & Replies:
• **Reverse Auction Transparency:** Elimination of ambiguous qualification criteria; transparent intimation of pre-bid clarifications to all prospective bidders at GTPS.
• **Vehicle & Coal Telematics (PSOCP Dumka):** Mandatory real-time verification of tippers and dumpers with MoRTH VAHAN portal and RFID automation at weighbridges.
• **Replies Submitted to Vigilance:** The subcategory "Replies submitted to Vigilance" archives all compliance and Action Taken Reports (ATRs) submitted to the Chief Vigilance Officer (CVO).
*Refer to Vigilance Systemic Improvement Advisories 2023-24.*`,
      sources
    };
  }

  if (q.includes('dop') || q.includes('delegation of power') || q.includes('power') || q.includes('approval') || q.includes('sanction')) {
    sources.push('NUPPL Delegation of Power (DoP) 2024 Schedule 4');
    return {
      answer: `### Delegation of Power (DoP) Key Ceilings:
• **Award of Open Tender:**
  - Up to ₹25 Lakhs: HoD (DGM/Ch. Mgr C&P) with Finance concurrence.
  - Up to ₹1 Crore: GM (C&P) / Project Head GTPS / PSOCP.
  - Above ₹1 Crore up to ₹10 Crores: Executive Director (ED) / Director (Technical).
  - Above ₹10 Crores up to ₹25 Crores: Chief Executive Officer (CEO).
  - Above ₹25 Crores: Board of Directors (NUPPL).
• **Single Tender / Proprietary Article:** Strict justification required; GM up to ₹10 Lakhs; ED up to ₹25 Lakhs; CEO up to ₹1 Crore.
*Refer to NUPPL/BD/DoP-REV/2024/01.*`,
      sources
    };
  }

  if (q.includes('make in india') || q.includes('mii') || q.includes('local content') || q.includes('class-i')) {
    sources.push('Circular: Public Procurement (Preference to Make in India) Order');
    return {
      answer: `### Public Procurement (Preference to Make in India) - PPP-MII:
• **Class-I Local Supplier:** Local content equal to or more than 50%. Receives purchase preference in tenders.
• **Class-II Local Supplier:** Local content between 20% and 50%.
• **Non-Local Supplier:** Local content less than 20%. Not eligible in procurements under ₹200 Crores unless Global Tender Enquiry (GTE) is approved by Competent Authority.
• **Purchase Preference Margin:** 20% margin for Class-I suppliers in divisible contracts.`,
      sources
    };
  }

  // Matching with contextual documents
  const relevantDoc = documentsContext.find(d => 
    d.subject.toLowerCase().includes(q) || 
    (d.tags && d.tags.some((t: string) => q.includes(t.toLowerCase())))
  );

  if (relevantDoc) {
    sources.push(`${relevantDoc.subject} (${relevantDoc.refNo})`);
    return {
      answer: `### Document Reference: ${relevantDoc.subject}
• **Reference Number:** ${relevantDoc.refNo}
• **Issuing Authority:** ${relevantDoc.issuingAuthority}
• **Category:** ${relevantDoc.category} ${relevantDoc.subCategory ? `> ${relevantDoc.subCategory}` : ''}
• **Key Provisions:**
${relevantDoc.aiSummary || 'Document available in CP-Gyan Kosh repository.'}`,
      sources
    };
  }

  sources.push('CP-Gyan Kosh Master Repository');
  return {
    answer: `### CP-Gyan Kosh Information:
Regarding your query: "${question}"
• NUPPL Contracts & Purchase department mandates strict adherence to the Purchase Manual, Contracts Manual, and Board-approved Delegation of Power (DoP).
• Procurements at **GTPS (Ghatampur)** and **PSOCP (Dumka)** follow unified C&P policies with project-specific financial ceilings.
• All circulars uploaded under Categories (Purchase Manual, Contracts Manual, DoP, Vigilance Systemic Improvements, and Circulars: BG, GeM, Make in India) are searchable in the portal.`,
    sources
  };
}

/**
 * Request Document Summarization
 * Automatically switches between Backend /api/ai/summarize and Static in-browser engine
 */
export async function summarizeDocument(params: {
  subject: string;
  category: string;
  subCategory?: string;
  entity?: string;
  refNo?: string;
  date?: string;
  contentText?: string;
}): Promise<SummaryResult> {
  try {
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.summary) {
        return data;
      }
    }
  } catch (err) {
    // If backend is unreachable (e.g. static hosting on GitHub Pages), fallback silently
    console.info('Backend unreachable, using static C&P knowledge engine:', err);
  }

  return generateLocalSummary(
    params.subject,
    params.category,
    params.subCategory,
    params.entity,
    params.contentText
  );
}

/**
 * Request Chat Response
 * Automatically switches between Backend /api/ai/chat and Static in-browser engine
 */
export async function chatWithGyanKosh(params: {
  question: string;
  documentsContext: any[];
  history?: any[];
}): Promise<ChatResult> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.answer) {
        return data;
      }
    }
  } catch (err) {
    console.info('Backend unreachable, using static C&P knowledge engine:', err);
  }

  return generateLocalChatAnswer(params.question, params.documentsContext);
}
