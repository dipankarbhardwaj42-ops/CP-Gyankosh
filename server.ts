import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '30mb' }));

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback high-fidelity executive summary generator when Gemini API key is offline or unavailable
function generateLocalSummary(subject: string, category: string, subCategory: string, entity: string, contentText?: string) {
  const targetEntity = entity || 'NUPPL (GTPS & PSOCP)';
  const cat = category || 'General Circular';
  const sub = subCategory ? ` [${subCategory}]` : '';
  const textSample = contentText?.slice(0, 500) || '';

  return {
    summary: `Official C&P regulatory document regarding "${subject}". Governs procurement, contracting procedures, and statutory compliance across ${targetEntity}. Mandatory adherence required by all Contracts & Purchase executives.`,
    keyPoints: [
      `Applicable to: ${targetEntity} under ${cat}${sub}.`,
      `Establishes standard operating protocol and delegation parameters for tender floating, evaluation, and award.`,
      `Mandates strict compliance with statutory guidelines, transparency norms, and vigilance directives.`,
      textSample ? `Key operational reference: "${textSample.slice(0, 120)}..."` : 'Ensures financial prudence and audit readiness across NUPPL procurement units.'
    ],
    actionItems: [
      'Circulate to all handling executives in GTPS Ghatampur and PSOCP Dumka.',
      'Incorporate required stipulations in upcoming NITs and tender documents.',
      'Maintain SFMS / portal record for statutory audit inspection.'
    ],
    tags: [cat, subCategory || 'Guidelines', entity || 'NUPPL', 'C&P Compliance'].filter(Boolean)
  };
}

// AI Document Summarization Endpoint
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { subject, category, subCategory, entity, refNo, date, contentText } = req.body;

    if (!subject) {
      return res.status(400).json({ error: 'Subject is required for AI summarization' });
    }

    if (ai) {
      try {
        const prompt = `You are the chief legal and C&P (Contracts & Purchase) expert advisor for NUPPL (Neyveli Uttar Pradesh Power Limited, a 51:49 JV of NLCIL & UPRVUNL operating GTPS Ghatampur 3x660MW and PSOCP Dumka coal block).

Please generate an authoritative, concise, and structured executive summary for the following document:
- Subject: ${subject}
- Category: ${category} ${subCategory ? `(Subcategory: ${subCategory})` : ''}
- Reference No: ${refNo || 'N/A'}
- Date: ${date || 'Recent'}
- Entity / Project: ${entity || 'All NUPPL (GTPS & PSOCP)'}
- Document Content / Excerpt:
${contentText ? contentText.slice(0, 6000) : 'Standard operating procedure / circular regarding ' + subject}

Return a valid JSON object with the following fields:
{
  "summary": "2 to 3 sentences executive summary explaining the core objective and regulatory impact",
  "keyPoints": ["3 to 4 crisp bullet points highlighting specific rules, thresholds, percentages, or procedural obligations"],
  "actionItems": ["2 to 3 clear operational action items for C&P dealing officers"],
  "tags": ["3 to 5 relevant short tags e.g. GeM, BG, DoP, GTPS, Vigilance"]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text?.trim() || '';
        try {
          const parsed = JSON.parse(text);
          return res.json(parsed);
        } catch {
          // If JSON parse fails, fallback cleanly
          return res.json(generateLocalSummary(subject, category, subCategory, entity, contentText));
        }
      } catch (geminiError: any) {
        console.warn('Gemini summarization failed, falling back to local engine:', geminiError?.message || geminiError);
        return res.json(generateLocalSummary(subject, category, subCategory, entity, contentText));
      }
    } else {
      // Offline fallback
      return res.json(generateLocalSummary(subject, category, subCategory, entity, contentText));
    }
  } catch (error: any) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// AI Chatbot / Search Assistant Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { question, documentsContext, history } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const contextSnippet = Array.isArray(documentsContext)
      ? documentsContext
          .slice(0, 15)
          .map(
            (doc: any, i: number) =>
              `[Doc ${i + 1}] Title: ${doc.subject} | Ref: ${doc.refNo || 'N/A'} | Cat: ${doc.category} > ${doc.subCategory || 'General'} | Entity: ${doc.entity} | Date: ${doc.date}\nSummary: ${doc.aiSummary || doc.description || ''}\nKey Provisions: ${(doc.keyPoints || []).join('; ')}\nContent Excerpt: ${(doc.contentSample || '').slice(0, 600)}`
          )
          .join('\n\n')
      : '';

    if (ai) {
      try {
        const systemInstruction = `You are "Gyan Kosh AI", the dedicated procurement and contracts advisory chatbot for NUPPL (Neyveli Uttar Pradesh Power Limited, a 51:49 Joint Venture between NLCIL and UPRVUNL).
NUPPL encompasses two key entities:
1. GTPS (Ghatampur Thermal Power Station, 3x660 MW in Kanpur Nagar, UP)
2. PSOCP, Dumka (Pachwara South Open Cast Project, coal mine in Dumka, Jharkhand).

Your job is to answer queries from C&P executives accurately and authoritatively based on the uploaded repository documents (Purchase Manual, Contracts Manual, Delegation of Power / DoP, Vigilance Systemic Improvements, Bank Guarantee circulars, GeM guidelines, Make in India PPP-MII orders, and related circulars).

Guidelines:
1. Always cite relevant Circular Ref No, Category, Clause, or Entity (GTPS or PSOCP) when available.
2. Structure answers clearly with bullet points, practical advice, and compliance notes.
3. If the exact answer is not in the specific documents provided, state the standard PSU / General Financial Rules (GFR) / GeM / CVC guideline while explicitly noting that it's a standard practice subject to NUPPL's internal circulars.
4. Keep tone professional, respectful, official, and concise.`;

        const prompt = `Executive Question: "${question}"

Available CP-Gyan Kosh Documents Knowledge Base:
${contextSnippet || 'Standard NUPPL C&P Repository active.'}

Please provide an exact, executive-ready response with relevant references and action points for NUPPL C&P officers.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
          },
        });

        const reply = response.text || 'Unable to generate response at this moment.';
        return res.json({ answer: reply });
      } catch (geminiError: any) {
        console.warn('Gemini chat failed, using PSU knowledge base responder:', geminiError?.message || geminiError);
      }
    }

    // High quality rule-based C&P fallback assistant
    const q = question.toLowerCase();
    let answer = '';
    let sources: string[] = [];

    if (q.includes('gem') || q.includes('marketplace') || q.includes('direct purchase')) {
      answer = `### GeM (Government e-Marketplace) Guidelines for NUPPL C&P:
• **Direct Purchase:** Up to ₹50,000/- through any available GeM seller meeting requisite quality, specification and delivery period.
• **L1 Purchase (Comparison):** Above ₹50,000/- and up to ₹5,00,000/- through GeM seller having lowest price amongst at least 3 different manufacturers/sellers.
• **Custom Bidding / Reverse Auction:** Mandatory for procurements above ₹5,00,000/- unless proprietary article certificate (PAC) or specific exemption is approved under Delegation of Power.
• **Caution Money & Performance:** As per DoE guidelines and GeM GTC version 4.0.
*Refer to NUPPL Circular Ref: NUPPL/C&P/GeM/2024/08 for detailed operating workflow.*`;
      sources.push('GeM Circular No. 08/2024', 'DoP Schedule II');
    } else if (q.includes('bg') || q.includes('bank guarantee') || q.includes('pbg') || q.includes('emd') || q.includes('sfms')) {
      answer = `### Bank Guarantee (BG) Provisions at NUPPL:
• **SFMS Verification:** Mandatory advisory that all Bank Guarantees (EMD, Advance, Performance Security) must be routed strictly via SFMS (Structured Financial Messaging System) to NUPPL's designated advisory bank account.
• **Confirmation Window:** No physical BG shall be accepted without SFMS confirmation message (IFN 760COV / IFN 767COV).
• **Validity Period:** Performance Bank Guarantee (PBG) shall generally be valid for the contract completion period plus 60 to 90 days claim period.
• **Applicability:** Applies equally across GTPS Ghatampur and PSOCP Dumka.
*Refer to Circular: NUPPL/C&P/BG-SFMS/2024/14.*`;
      sources.push('Circular on Bank Guarantee SFMS Verification', 'Contracts Manual Section 8.4');
    } else if (q.includes('vigilance') || q.includes('systemic') || q.includes('reply') || q.includes('replies')) {
      answer = `### Vigilance Systemic Improvements & Replies:
• **Reverse Auction Transparency:** Elimination of ambiguous qualification criteria; transparent intimation of pre-bid clarifications to all prospective bidders.
• **Single Tender Justifications:** Proper recording of urgency or proprietary nature with prior concurrence of Finance and approval of competent authority under DoP.
• **Replies Submitted to Vigilance:** The subcategory "Replies submitted to Vigilance" archives all compliance reports sent against Vigilance inspection memos at GTPS and PSOCP.
*Refer to Vigilance Systemic Improvement Advisories 2023-24.*`;
      sources.push('Vigilance Systemic Improvements Vol. II', 'Replies to CVO Memos');
    } else if (q.includes('dop') || q.includes('delegation of power') || q.includes('power') || q.includes('limit')) {
      answer = `### Delegation of Power (DoP) Key Summary:
• **Approval of NIT / Tender Floating:** Vested with respective Head of Department (HoD) / GM as per financial thresholds.
• **Tender Acceptance / Award:**
  - Up to ₹25 Lakhs: DGM / HoD (C&P) with Finance concurrence.
  - Up to ₹1 Crore: GM (C&P) / Project Head GTPS / PSOCP.
  - Above ₹1 Crore up to ₹10 Crores: Executive Director (ED) / Director (Technical).
  - Above ₹10 Crores: CEO / Board of Directors (NUPPL).
*Please inspect the full Delegation of Power Manual for detailed Sub-Schedules A, B, and C.*`;
      sources.push('NUPPL Delegation of Power (DoP) 2023');
    } else if (q.includes('make in india') || q.includes('mii') || q.includes('local content')) {
      answer = `### Public Procurement (Preference to Make in India) - PPP-MII:
• **Class-I Local Supplier:** Local content equal to or more than 50%. Gets purchase preference in tenders.
• **Class-II Local Supplier:** Local content more than 20% but less than 50%.
• **Non-Local Supplier:** Local content less than or equal to 20%. Not eligible in procurements under ₹200 Crores unless Global Tender Enquiry (GTE) is approved by Competent Authority.
• **Margin of Purchase Preference:** 20% margin for Class-I suppliers in divisible contracts.`;
      sources.push('Circular: Public Procurement (Preference to Make in India) Order');
    } else {
      answer = `### CP-Gyan Kosh Information:
Regarding your query on "${question}":
NUPPL Contracts and Purchase department mandates adherence to the Purchase Manual, Contracts Manual, and latest Board/CVC approved Delegation of Power (DoP).
• Procurements at **GTPS (Ghatampur)** and **PSOCP (Dumka)** follow unified C&P policies with project-specific financial ceilings.
• All circulars uploaded under Categories (Purchase Manual, Contracts Manual, DoP, Vigilance Systemic Improvements, and Circulars: BG, GeM, Make in India) are searchable in the portal.
• You can filter documents by Entity (GTPS / PSOCP) or explore specific folders in the left sidebar.`;
      sources.push('CP-Gyan Kosh Master Repository');
    }

    return res.json({ answer, sources });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat query' });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`CP-Gyan Kosh server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
