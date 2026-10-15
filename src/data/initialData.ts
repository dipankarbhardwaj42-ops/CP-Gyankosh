import { CategoryItem, DocumentItem, FolderItem } from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-purchase-manual',
    name: 'Purchase Manual',
    iconName: 'ShoppingBag',
    subCategories: [
      { id: 'sub-pm-general', name: 'General Purchase Principles' },
      { id: 'sub-pm-indenting', name: 'Indenting & Estimate Preparation' },
      { id: 'sub-pm-eval', name: 'Tender Floating & Technical Evaluation' },
      { id: 'sub-pm-ld', name: 'Liquidated Damages & Price Variation' }
    ]
  },
  {
    id: 'cat-contracts-manual',
    name: 'Contracts Manual',
    iconName: 'FileText',
    subCategories: [
      { id: 'sub-cm-epc', name: 'EPC & Turnkey Works Guidelines' },
      { id: 'sub-cm-sbd', name: 'Standard Bidding Documents (SBD)' },
      { id: 'sub-cm-variation', name: 'Variations, Amendments & Claims' },
      { id: 'sub-cm-arbitration', name: 'Dispute Resolution & Conciliation' }
    ]
  },
  {
    id: 'cat-dop',
    name: 'Delegation of Power',
    iconName: 'Scale',
    subCategories: [
      { id: 'sub-dop-tender', name: 'Powers for Tender Approval & Award' },
      { id: 'sub-dop-variation', name: 'Sanction of Variations & Extra Items' },
      { id: 'sub-dop-emergency', name: 'Emergency & Proprietary Procurements' },
      { id: 'sub-dop-finance', name: 'Financial Ceilings for GTPS & PSOCP' }
    ]
  },
  {
    id: 'cat-vigilance',
    name: 'Vigilance Systemic Improvements',
    iconName: 'ShieldAlert',
    subCategories: [
      { id: 'sub-vig-replies', name: 'Replies submitted to Vigilance' },
      { id: 'sub-vig-advisories', name: 'Systemic Improvement Advisories' },
      { id: 'sub-vig-integrity', name: 'Integrity Pact & Independent External Monitors' }
    ]
  },
  {
    id: 'cat-circulars',
    name: 'Circulars',
    iconName: 'Bell',
    subCategories: [
      { id: 'sub-circ-bg', name: 'Regarding Bank Guarantee' },
      { id: 'sub-circ-gem', name: 'GeM' },
      { id: 'sub-circ-mii', name: 'Make in India' },
      { id: 'sub-circ-other', name: 'Other' }
    ]
  }
];

export const INITIAL_FOLDERS: FolderItem[] = [
  {
    id: 'folder-fy24-25',
    name: 'FY 2024-25 C&P Circulars',
    description: 'Current financial year operational circulars, notifications and advisories',
    color: '#0f766e',
    entity: 'ALL',
    createdAt: '2024-04-01'
  },
  {
    id: 'folder-gtps-procurements',
    name: 'GTPS Ghatampur Packages',
    description: 'Ghatampur 3x660MW thermal power station C&P packages, SBDs and local guidelines',
    color: '#1d4ed8',
    entity: 'GTPS',
    createdAt: '2024-02-15'
  },
  {
    id: 'folder-psocp-dumka',
    name: 'PSOCP Dumka Mining & Coal Evacuation',
    description: 'Pachwara South Open Cast Project coal transportation, mining tenders and safety contracts',
    color: '#b45309',
    entity: 'PSOCP',
    createdAt: '2024-03-10'
  },
  {
    id: 'folder-manuals-dop',
    name: 'Core Manuals & Delegation of Power',
    description: 'Purchase Manual, Works Contracts Manual, and Board-approved DoP schedules',
    color: '#4338ca',
    entity: 'ALL',
    createdAt: '2023-11-20'
  },
  {
    id: 'folder-vigilance-replies',
    name: 'Vigilance ATRs & Case Replies',
    description: 'Compliance reports, replies submitted to Chief Vigilance Officer (CVO) and systemic improvements',
    color: '#be123c',
    entity: 'ALL',
    createdAt: '2024-01-05'
  },
  {
    id: 'folder-gem-statutory',
    name: 'GeM & Statutory Procurement Orders',
    description: 'Government e-Marketplace, PPP-MII orders, and Ministry of Power mandates',
    color: '#0369a1',
    entity: 'ALL',
    createdAt: '2024-01-18'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-bg-sfms-2024',
    subject: 'Mandatory Verification of Bank Guarantees (BG / PBG / EMD) through Structured Financial Messaging System (SFMS)',
    refNo: 'NUPPL/C&P/BG-SFMS/2024/14',
    date: '2024-08-22',
    category: 'Circulars',
    subCategory: 'Regarding Bank Guarantee',
    entity: 'ALL',
    folderId: 'folder-fy24-25',
    issuingAuthority: 'General Manager (Contracts & Purchase), NUPPL',
    fileName: 'NUPPL_Circular_SFMS_Verification_BG_2024.pdf',
    fileSize: '1.4 MB',
    fileType: 'pdf',
    aiSummary: 'Mandates that all Bank Guarantees (Earnest Money Deposit, Advance Payment, and Performance Guarantees) submitted by contractors for GTPS Ghatampur and PSOCP Dumka must be issued with mandatory SFMS messaging (IFN 760 COV / IFN 767 COV) to NUPPL advisory bank. Physical BGs without SFMS message shall not be accepted under any circumstances.',
    keyPoints: [
      'Applicable to all tenders and running contracts across GTPS and PSOCP Dumka.',
      'Contractors must advise their issuing banks to transmit SFMS confirmation strictly to NUPPL designated State Bank of India account.',
      'Dealing C&P executive must verify SFMS report from Finance before opening price bids or releasing payments.',
      'PBG validity must include contract period plus minimum 90 days claim period.'
    ],
    actionItems: [
      'Incorporate mandatory SFMS clause in all upcoming NITs and tender documents.',
      'Check SFMS receipt confirmation from Finance within 48 hours of BG receipt.',
      'Maintain digital register of BG expiry dates to initiate timely invocation/extension letters 30 days prior.'
    ],
    tags: ['Bank Guarantee', 'SFMS', 'PBG', 'EMD', 'Financial Prudence', 'All NUPPL'],
    uploadedBy: 'Admin (C&P Corporate)',
    uploadedAt: '2024-08-23T10:30:00Z',
    contentSample: 'Neyveli Uttar Pradesh Power Limited (A 51:49 JV of NLCIL & UPRVUNL). Ref: NUPPL/C&P/BG-SFMS/2024/14. Subject: Mandatory Verification of Bank Guarantees through SFMS. To enhance internal financial controls and eliminate risk of fake/fabricated Bank Guarantees, competent authority has approved that all BGs shall be accepted strictly through SFMS mode...'
  },
  {
    id: 'doc-gem-direct-limits-2024',
    subject: 'Operational Ceilings for Procurement through GeM Portal - Direct Purchase, L1 Comparison and Custom Bidding Rules',
    refNo: 'NUPPL/C&P/GeM/2024/08',
    date: '2024-06-15',
    category: 'Circulars',
    subCategory: 'GeM',
    entity: 'ALL',
    folderId: 'folder-gem-statutory',
    issuingAuthority: 'Chief Executive Officer (CEO), NUPPL',
    fileName: 'GeM_Procurement_Thresholds_NUPPL_2024.pdf',
    fileSize: '2.1 MB',
    aiSummary: 'Establishes revised financial limits and operational procedures for Government e-Marketplace (GeM) procurements in line with Ministry of Finance guidelines. Outlines criteria for direct purchase up to ₹50,000, L1 price comparison up to ₹5 Lakhs, and custom bidding for specialized requirements at GTPS & PSOCP.',
    keyPoints: [
      'Direct purchase up to ₹50,000/- allowed through any GeM seller fulfilling quality/delivery requirements.',
      'Procurement between ₹50,000/- and ₹5,00,000/- mandates comparison of at least 3 distinct manufacturers/sellers on GeM.',
      'Procurement above ₹5,00,000/- must go through mandatory GeM bidding or Reverse Auction (RA).',
      'Non-availability Certificate (GeMARPTS) mandatory if goods/services are not available on GeM before floating open tender.'
    ],
    actionItems: [
      'Attach valid GeMARPTS ID in the indent file before initiating external e-procurement.',
      'Ensure CRAC (Consignee Receipt and Acceptance Certificate) is generated within 10 days of goods delivery.',
      'Strict adherence to GeM payment terms to avoid interest penalties.'
    ],
    tags: ['GeM', 'Direct Purchase', 'L1 Comparison', 'Reverse Auction', 'GeMARPTS'],
    uploadedBy: 'Admin (C&P Corporate)',
    uploadedAt: '2024-06-16T14:15:00Z',
    contentSample: 'Government e-Marketplace (GeM) is the mandatory portal for procurement of common use goods and services as per Rule 149 of GFR 2017. For NUPPL GTPS Ghatampur and PSOCP Dumka, the following limits are notified...'
  },
  {
    id: 'doc-mii-local-content-2024',
    subject: 'Public Procurement (Preference to Make in India) Order - Verification of Local Content and Purchase Preference',
    refNo: 'NUPPL/C&P/PPP-MII/2024/29',
    date: '2024-05-10',
    category: 'Circulars',
    subCategory: 'Make in India',
    entity: 'ALL',
    folderId: 'folder-gem-statutory',
    issuingAuthority: 'Director (Technical), NUPPL',
    fileName: 'PPP_Make_In_India_Guidelines_NUPPL.pdf',
    fileSize: '1.8 MB',
    aiSummary: 'Detailed directives on enforcing DPIIT Public Procurement (Preference to Make in India) Order. Clarifies eligibility definitions for Class-I Local Suppliers (≥50% local content) and Class-II Local Suppliers (20%-50%), with strict prohibition of Global Tender Enquiries (GTE) for tenders under ₹200 Crores.',
    keyPoints: [
      'Class-I Local Suppliers get 20% margin of purchase preference in divisible and non-divisible contracts.',
      'No Global Tender Enquiry (GTE) for procurement value below ₹200 Crores without prior Cabinet Secretariat approval.',
      'Bidders must submit statutory auditor certificate verifying domestic value addition for contracts above ₹10 Crores.',
      'False declarations of local content shall lead to debarment/blacklisting for up to 2 years.'
    ],
    actionItems: [
      'Specify minimum local content requirement and supplier classification in Section-II of bidding documents.',
      'Verify Chartered Accountant / Cost Accountant certificates for bids claiming Class-I status.',
      'Submit quarterly compliance report on Make in India procurement to Ministry of Power.'
    ],
    tags: ['Make in India', 'PPP-MII', 'Local Content', 'Class-I Supplier', 'GTE Ceiling'],
    uploadedBy: 'Admin (C&P Corporate)',
    uploadedAt: '2024-05-11T09:00:00Z',
    contentSample: 'In pursuance of Department for Promotion of Industry and Internal Trade (DPIIT) Public Procurement Order, NUPPL hereby issues comprehensive guidelines for all tenders floated for Ghatampur Thermal Power Station and Dumka Coal Project...'
  },
  {
    id: 'doc-vig-reply-reverse-auction',
    subject: 'Reply & Action Taken Report submitted to CVO regarding Elimination of Ambiguity in Reverse Auction Eligibility Criteria at GTPS',
    refNo: 'NUPPL/C&P/VIG-REPLY/GTPS/2024/03',
    date: '2024-07-18',
    category: 'Vigilance Systemic Improvements',
    subCategory: 'Replies submitted to Vigilance',
    entity: 'GTPS',
    folderId: 'folder-vigilance-replies',
    issuingAuthority: 'Head of Project (HoP) / GM (C&P), GTPS Ghatampur',
    fileName: 'Reply_to_CVO_Memo_Reverse_Auction_GTPS.pdf',
    fileSize: '2.5 MB',
    aiSummary: 'Formal reply and compliance action taken report submitted to the Chief Vigilance Officer (CVO) regarding systemic observation during investigation of ash handling & balance of plant contracts at GTPS. Reports adoption of standard pre-qualification criteria, elimination of arbitrary clauses, and transparent pre-bid meeting disclosures.',
    keyPoints: [
      'Compliance report against Vigilance Inspection Memo No. CVO/NUPPL/GTPS/INSP/2024/09.',
      'Adopted standardized Qualification Requirement (QR) templates from NLCIL/NUPPL master guidelines.',
      'All pre-bid queries and written clarifications now published openly on CPP portal and NUPPL website 7 days prior to bid opening.',
      'Two-tier scrutiny committee introduced to examine single-vendor bids prior to technical acceptance.'
    ],
    actionItems: [
      'Retain signed copy of CVO acceptance in the master audit file.',
      'Ensure no amendment to NIT condition is issued without concurrence of Finance & approval of GM (C&P).',
      'Record detailed speaking order if tender evaluation requires disqualification of any bidder.'
    ],
    tags: ['Vigilance Reply', 'CVO Compliance', 'Reverse Auction', 'GTPS Ghatampur', 'Audit Ready'],
    uploadedBy: 'Admin (C&P Corporate)',
    uploadedAt: '2024-07-19T11:45:00Z',
    contentSample: 'To: The Chief Vigilance Officer, NLCIL / NUPPL Corporate Office. Subject: Action Taken Report on Systemic Improvements observed during surprise inspection at GTPS Ghatampur. Respected Sir, With reference to memo dated 02.05.2024, the following corrective and preventive measures have been implemented...'
  },
  {
    id: 'doc-vig-reply-dumka-transport',
    subject: 'Reply submitted to Vigilance on Verification of Vehicle Registration and GPS Telematics for Coal Transportation at PSOCP, Dumka',
    refNo: 'NUPPL/C&P/VIG-REPLY/PSOCP/2024/07',
    date: '2024-09-04',
    category: 'Vigilance Systemic Improvements',
    subCategory: 'Replies submitted to Vigilance',
    entity: 'PSOCP',
    folderId: 'folder-vigilance-replies',
    issuingAuthority: 'Project Head / GM (C&P), PSOCP Dumka',
    fileName: 'Reply_Vigilance_Coal_Transport_PSOCP_Dumka.pdf',
    fileSize: '1.9 MB',
    aiSummary: 'Comprehensive reply submitted to Vigilance cell addressing systemic improvements in coal evacuation and heavy earth moving machinery (HEMM) hiring contracts at Pachwara South Open Cast Project, Dumka. Institutes electronic weighbridge integration, RFID tagging, and VAHAN database API cross-checks.',
    keyPoints: [
      'Submitted in response to Vigilance Advisory No. NLCIL/VIG/DUMKA/COAL/2024/41.',
      'Mandatory real-time verification of tippers and dumper registration with MoRTH VAHAN portal prior to gate pass issuance.',
      'Integration of automated Boom Barriers and RFID readers with SAP / ERP system at Dumka weighbridges.',
      'Random physical audit team constituted under DGM (Mining) and DGM (Finance).'
    ],
    actionItems: [
      'Incorporate mandatory GPS tracker & RFID transponder requirement in upcoming coal transport tenders.',
      'Maintain daily automated discrepancy report generated by the weighbridge telemetry server.',
      'Report any tampering or unregistered vehicle intrusion immediately to PSOCP Project Head.'
    ],
    tags: ['Vigilance Reply', 'PSOCP Dumka', 'Coal Evacuation', 'VAHAN Verification', 'RFID'],
    uploadedBy: 'Admin (C&P Corporate)',
    uploadedAt: '2024-09-05T16:20:00Z',
    contentSample: 'Ref: NUPPL/C&P/VIG-REPLY/PSOCP/2024/07. To: Chief Vigilance Officer. In compliance with your observations regarding truck turnaround times and weighment integrity at PSOCP Dumka coal block, we submit our point-wise compliance...'
  },
  {
    id: 'doc-dop-schedule-2024',
    subject: 'NUPPL Delegation of Power (DoP) - Contracts & Purchase Powers, Financial Limits and Committee Approvals',
    refNo: 'NUPPL/BD/DoP-REV/2024/01',
    date: '2024-01-15',
    category: 'Delegation of Power',
    subCategory: 'Powers for Tender Approval & Award',
    entity: 'ALL',
    folderId: 'folder-manuals-dop',
    issuingAuthority: 'Board of Directors, NUPPL',
    fileName: 'NUPPL_Delegation_of_Power_CP_2024.pdf',
    fileSize: '4.8 MB',
    aiSummary: 'Official Delegation of Power approved by NUPPL Board for procurement and contracting activities. Defines exact financial and administrative ceilings for HoD (C&P), General Managers at GTPS and PSOCP Dumka, Executive Directors, CEO, and the Board of Directors, including rules for emergency procurement.',
    keyPoints: [
      'Award of Open Tender: HoD (DGM/Ch. Mgr) up to ₹25 Lakhs; GM (C&P) up to ₹1 Crore; ED/Director (Tech) up to ₹10 Crores; CEO up to ₹25 Crores; Board above ₹25 Crores.',
      'Limited Tender Enquiry (LTE): GM up to ₹25 Lakhs; ED up to ₹50 Lakhs.',
      'Single Tender / Proprietary Article: Strict justification required; GM up to ₹10 Lakhs; ED up to ₹25 Lakhs; CEO up to ₹1 Crore with Finance concurrence.',
      'Powers for Variation / Extension of Time: C&P officer can approve variation up to 10% of contract value without deviation in unit rates.'
    ],
    actionItems: [
      'All tender approvals must reference the exact clause number of DoP Schedule Section 4.',
      'Finance concurrence is mandatory prior to submitting proposals to competent sanctioning authority.',
      'Ensure proper quorum in Tender Committee meetings (C&P, Indenting Dept, and Finance).'
    ],
    tags: ['Delegation of Power', 'DoP', 'Financial Ceilings', 'Board Approved', 'Tender Committee'],
    uploadedBy: 'Admin (C&P Corporate)',
    uploadedAt: '2024-01-16T12:00:00Z',
    contentSample: 'Neyveli Uttar Pradesh Power Limited (NUPPL). Delegation of Power (DoP) for Contracts & Purchase. Section 4.1: Powers for Invitation of Bids. Section 4.2: Powers for Acceptance of Bids and Award of Contracts...'
  },
  {
    id: 'doc-purchase-manual-vol1',
    subject: 'NUPPL Purchase Manual 2023 - Standard Operating Principles for Material Procurement & Vendor Registration',
    refNo: 'NUPPL/C&P/MANUAL/PURCHASE/2023/01',
    date: '2023-10-01',
    category: 'Purchase Manual',
    subCategory: 'General Purchase Principles',
    entity: 'ALL',
    folderId: 'folder-manuals-dop',
    issuingAuthority: 'CEO / Board of Directors, NUPPL',
    fileName: 'NUPPL_Purchase_Manual_Vol_I_2023.pdf',
    fileSize: '5.6 MB',
    aiSummary: 'Comprehensive master manual governing all purchase activities at NUPPL. Details vendor empanelment, mode of tendering (Open, Limited, Single, GeM), technical evaluation norms, earnest money deposits, and warranty/guarantee management for thermal power plant spares and mining equipment.',
    keyPoints: [
      'Outlines 4 primary tendering routes: GeM, Open Tender (CPP Portal), Limited Tender, and Single/PAC.',
      'EMD shall generally be 1% to 2% of estimated value, exempted for MSEs and Startups with valid Udyam registration.',
      'Security Deposit (SD) mandatory at 3% to 5% of contract value.',
      'Inspection and testing protocols defined for critical boiler, turbine, and coal handling spares.'
    ],
    actionItems: [
      'Executives must cross-check MSE exemption validity on the Udyam portal before tender opening.',
      'Verify technical compliance matrix against indent specifications before price bid opening.',
      'Follow standard vendor performance rating framework.'
    ],
    tags: ['Purchase Manual', 'Vendor Registration', 'EMD Exemption', 'MSE', 'Inspection'],
    uploadedBy: 'Admin (C&P Corporate)',
    uploadedAt: '2023-10-05T10:00:00Z',
    contentSample: 'NUPPL Purchase Manual Volume I. Chapter 1: Introduction and Procurement Objectives. The goal of C&P at NUPPL is to procure goods of correct quality, in the right quantity, at the most economical rates, and in a timely manner...'
  },
  {
    id: 'doc-contracts-manual-sbd',
    subject: 'Works Contracts Manual - Standard Bidding Documents (SBD) and General Conditions of Contract (GCC)',
    refNo: 'NUPPL/C&P/MANUAL/CONTRACTS/2023/02',
    date: '2023-11-15',
    category: 'Contracts Manual',
    subCategory: 'Standard Bidding Documents (SBD)',
    entity: 'ALL',
    folderId: 'folder-manuals-dop',
    issuingAuthority: 'Director (Technical), NUPPL',
    fileName: 'NUPPL_Works_Contracts_Manual_GCC_SBD.pdf',
    fileSize: '6.2 MB',
    aiSummary: 'Standardized works contract guidelines and GCC templates for civil, mechanical, electrical, and erection packages at GTPS Ghatampur and PSOCP Dumka. Covers contract mobilization, milestone billing, price variation formula, liquidated damages, and dispute conciliation.',
    keyPoints: [
      'Mandatory use of Standard Bidding Documents (SBD) for all works packages exceeding ₹50 Lakhs.',
      'Liquidated Damages (LD) capped at 0.5% per week subject to a ceiling of 10% of total contract value.',
      'Price escalation / adjustment strictly as per standard RBI indices formula.',
      'Mandates pre-arbitration conciliation committee within 30 days of dispute escalation.'
    ],
    actionItems: [
      'Do not alter standard GCC clauses without explicit vetting by NUPPL Legal & C&P Cell.',
      'Calculate LD promptly at the time of final bill certification or milestone release.',
      'Ensure valid insurance policies (CAR/EAR and Workmen Compensation) are submitted before site handover.'
    ],
    tags: ['Contracts Manual', 'SBD', 'GCC', 'Liquidated Damages', 'Works Contracts'],
    uploadedBy: 'Admin (C&P Corporate)',
    uploadedAt: '2023-11-16T15:00:00Z',
    contentSample: 'NUPPL Works Contracts Manual. Standard General Conditions of Contract (GCC). Section 32: Liquidated Damages for Delay in Completion. Section 45: Conciliation and Dispute Resolution...'
  },
  {
    id: 'doc-environmental-circular-dumka',
    subject: 'Compliance Protocol for Environmental Clearances and Heavy Vehicle Emission Norms at PSOCP, Dumka Coal Mine',
    refNo: 'NUPPL/PSOCP/ENV/2024/11',
    date: '2024-04-18',
    category: 'Circulars',
    subCategory: 'Environmental & Statutory Compliance',
    entity: 'PSOCP',
    folderId: 'folder-psocp-dumka',
    issuingAuthority: 'Head of Project (HoP), PSOCP Dumka',
    fileName: 'Environmental_Compliance_PSOCP_Dumka_2024.pdf',
    fileSize: '1.6 MB',
    aiSummary: 'Enforces environmental mitigation and statutory pollution norms for all contractors operating at Pachwara South Open Cast Project, Dumka. Requires BS-VI / Stage-IV compliant HEMM, mist spray cannons on haul roads, and automated air quality monitoring data integration with JSPCB.',
    keyPoints: [
      'All commercial vehicles and earth moving machinery deployed must possess valid PUC and fitness certificates.',
      'Mandatory inclusion of dust suppression and wet drilling clauses in mining contracts.',
      'Non-compliance attracts daily penalty of ₹10,000/- plus potential suspension of site access.',
      'Monthly audit conducted jointly by Safety and C&P departments.'
    ],
    actionItems: [
      'Insert Special Conditions of Contract (SCC) clause 18.3 in all mining and transport packages.',
      'Verify environmental compliance certificates prior to clearing monthly running bills.'
    ],
    tags: ['Environmental Compliance', 'PSOCP Dumka', 'HEMM', 'Pollution Control', 'Custom Category'],
    uploadedBy: 'Admin (C&P Corporate)',
    uploadedAt: '2024-04-19T09:30:00Z',
    contentSample: 'Pachwara South Open Cast Project, Dumka. Statutory Environmental Directives. In accordance with MoEF&CC Environmental Clearance and Consent to Operate (CTO) issued by Jharkhand State Pollution Control Board...'
  }
];
