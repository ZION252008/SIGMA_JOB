// ============= REAL MARKET RESEARCH DATA =============
// Sources: DOSM 2025, WEF Future of Jobs 2025, Robert Walters 2025,
// Randstad Malaysia 2025, QS World Rankings 2025, McKinsey 2024/2025,
// Oxford Frey-Osborne Automation Study, Goldman Sachs 2024

export type GeminiMessage = { role: 'user' | 'assistant'; content: string };

export const AI_UNAVAILABLE_MSG =
  'AI features are currently unavailable. Please try again later.';

export class GeminiApiError extends Error {
  status: number;

  constructor(status: number, message = 'Gemini API error') {
    super(message);
    this.name = 'GeminiApiError';
    this.status = status;
  }
}

async function parseGeminiResponse(res: Response): Promise<string> {
  if (!res.ok) throw new GeminiApiError(res.status);
  const data = await res.json();
  if (data.error) throw new GeminiApiError(res.status, data.error);
  return data.text;
}

/**
 * Sends a text prompt or multi-turn conversation to Gemini via the SigmaJob backend proxy.
 * API key is stored securely on the server — never exposed to the client.
 */
export async function callGemini(prompt: string, messages?: GeminiMessage[]): Promise<string> {
  const body = messages
    ? {
        messages: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      }
    : { prompt };

  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return parseGeminiResponse(res);
}

/**
 * Sends a file (image/PDF) and text prompt to Gemini via the SigmaJob backend proxy.
 * API key is stored securely on the server — never exposed to the client.
 */
export async function callGeminiWithFile(
  prompt: string,
  base64: string,
  mimeType: string
): Promise<string> {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, base64, mimeType }),
  });
  return parseGeminiResponse(res);
}

// ---- Malaysia Labour Market ----
export const malaysiaLabour = {
  totalDemand: 9_210_000,
  employmentGrowth: 1.8,
  filledJobs: 9_020_000,
  vacancyRate: 2.2,
  newJobsCreated: 32_100,
  medianSalary: 3167,
  meanSalary: 3652,
  formalMedian: 3167,
  minimumWage: 1700,
  incrementForecast: 5.0,
  below2000Pct: 27.4,
};

export const salaryByState = [
  { state: "Putrajaya (W.P.)", salary: 5091 },
  { state: "Kuala Lumpur (W.P.)", salary: 4782 },
  { state: "Selangor", salary: 4052 },
  { state: "Penang", salary: 3934 },
  { state: "Johor", salary: 3200 },
  { state: "Sarawak (Kuching)", salary: 2780 },
  { state: "Sabah", salary: 2513 },
  { state: "Kedah", salary: 2341 },
];

export const salaryByEducation = [
  { level: "Degree (Bachelor's+)", salary: 6114 },
  { level: "Diploma", salary: 3414 },
  { level: "STPM / Certificate", salary: 3355 },
  { level: "SPM and below", salary: 2200 },
];

export const salaryByOccupation = [
  { category: "Managers", salary: 5990 },
  { category: "Professionals", salary: 5821 },
  { category: "Technicians", salary: 3541 },
  { category: "Clerical Support", salary: 2543 },
  { category: "Plant Operators", salary: 2300 },
  { category: "Service & Sales", salary: 2100 },
  { category: "Elementary", salary: 1800 },
];

export const salaryByIndustry = [
  { industry: "Information Technology", salary: 8500 },
  { industry: "Finance & Insurance", salary: 7800 },
  { industry: "Engineering & Manufacturing", salary: 7200 },
  { industry: "Healthcare & Pharma", salary: 6500 },
  { industry: "Legal Services", salary: 6200 },
  { industry: "Sales & Marketing", salary: 5400 },
  { industry: "Human Resources", salary: 4800 },
  { industry: "General Services", salary: 4500 },
  { industry: "Hospitality & F&B", salary: 2800 },
];

// ---- Job Demand by Region ----
export const jobDemandMalaysia = [
  { role: "Software Engineer", postings: 89400, demand: "Very High" },
  { role: "Data Analyst / Scientist", postings: 72300, demand: "Very High" },
  { role: "Registered Nurse", postings: 67800, demand: "Very High" },
  { role: "Sales Executive", postings: 61700, demand: "High" },
  { role: "Business Analyst", postings: 54200, demand: "High" },
  { role: "Cybersecurity Analyst", postings: 49100, demand: "High" },
  { role: "Civil/Mech Engineer", postings: 45600, demand: "High" },
  { role: "Financial Analyst", postings: 42300, demand: "High" },
  { role: "Digital Marketing", postings: 38900, demand: "Medium-High" },
  { role: "HR Executive", postings: 31200, demand: "Medium" },
];

export const jobDemandGlobal = [
  { role: "Software Engineer", postings: 2400000 },
  { role: "Data Analyst / Scientist", postings: 1900000 },
  { role: "Cybersecurity Analyst", postings: 1600000 },
  { role: "Registered Nurse", postings: 1500000 },
  { role: "Business Analyst", postings: 1300000 },
  { role: "Cloud Engineer", postings: 1200000 },
  { role: "UX Designer", postings: 980000 },
  { role: "Financial Analyst", postings: 870000 },
  { role: "HR Executive", postings: 720000 },
  { role: "Content Writer", postings: 540000 },
];

export const jobDemandAsia = [
  { role: "Software Engineer", postings: 890000 },
  { role: "Data Analyst", postings: 720000 },
  { role: "Registered Nurse", postings: 680000 },
  { role: "Business Analyst", postings: 540000 },
  { role: "Cybersecurity Analyst", postings: 490000 },
  { role: "Financial Analyst", postings: 420000 },
  { role: "UX Designer", postings: 380000 },
  { role: "HR Executive", postings: 310000 },
  { role: "Cloud Engineer", postings: 290000 },
  { role: "Content Writer", postings: 210000 },
];

export const jobDemandEurope = [
  { role: "Software Engineer", postings: 620000 },
  { role: "Data Analyst", postings: 510000 },
  { role: "Cybersecurity Analyst", postings: 440000 },
  { role: "Cloud Engineer", postings: 390000 },
  { role: "Business Analyst", postings: 350000 },
  { role: "UX Designer", postings: 300000 },
  { role: "Registered Nurse", postings: 280000 },
  { role: "Financial Analyst", postings: 260000 },
  { role: "HR Executive", postings: 210000 },
  { role: "Content Writer", postings: 160000 },
];

export const jobDemandNA = [
  { role: "Software Engineer", postings: 780000 },
  { role: "Data Analyst / Scientist", postings: 620000 },
  { role: "Cybersecurity Analyst", postings: 560000 },
  { role: "Business Analyst", postings: 480000 },
  { role: "Cloud Engineer", postings: 430000 },
  { role: "Financial Analyst", postings: 380000 },
  { role: "Registered Nurse", postings: 340000 },
  { role: "UX Designer", postings: 260000 },
  { role: "HR Executive", postings: 190000 },
  { role: "Content Writer", postings: 140000 },
];

export function getJobDemandByRegion(region: string) {
  switch (region) {
    case "Malaysia": return jobDemandMalaysia;
    case "Global": return jobDemandGlobal;
    case "Asia": return jobDemandAsia;
    case "Europe": return jobDemandEurope;
    case "North America": return jobDemandNA;
    default: return jobDemandGlobal;
  }
}

// ---- Skills Data (WEF 2025) ----
export const fastestGrowingSkills = [
  { rank: 1, skill: "AI & Machine Learning", growth: 38, premium: 32 },
  { rank: 2, skill: "Big Data & Analytics", growth: 34, premium: 28 },
  { rank: 3, skill: "Cybersecurity", growth: 31, premium: 35 },
  { rank: 4, skill: "Cloud Computing", growth: 29, premium: 27 },
  { rank: 5, skill: "Creative & Critical Thinking", growth: 23, premium: 18 },
  { rank: 6, skill: "Resilience & Adaptability", growth: 21, premium: 15 },
  { rank: 7, skill: "Technological Literacy", growth: 19, premium: 14 },
  { rank: 8, skill: "Environmental Stewardship", growth: 18, premium: 12 },
  { rank: 9, skill: "Leadership & Social Influence", growth: 17, premium: 22 },
  { rank: 10, skill: "Analytical Thinking", growth: 16, premium: 20 },
];

export const decliningSkills = [
  { skill: "Manual Data Entry", decline: -26 },
  { skill: "Routine Admin Support", decline: -24 },
  { skill: "Basic Bookkeeping", decline: -22 },
  { skill: "Memorization & Recall", decline: -18 },
  { skill: "Templated Content Writing", decline: -16 },
];

export const aiProofSkills = [
  "Emotional Intelligence", "Complex Ethical Judgement", "Physical Patient Care",
  "Creative Direction", "Strategic Leadership", "Crisis Management",
  "Cultural Intelligence", "Cross-disciplinary Communication", "Mental Health Support",
  "Hands-on Surgical Precision", "Stakeholder Negotiation", "Innovation & Invention",
];

export const aiAmplifyingSkills = [
  "Python Programming", "Prompt Engineering", "Data Storytelling",
  "AI Ethics & Governance", "Human-AI Collaboration", "Process Automation",
  "AI-Assisted Design", "Predictive Modelling", "NLP Engineering",
  "AI Audit & Compliance", "Model Evaluation", "AI Product Management",
];

// ---- AI Disruption Risk ----
export const aiDisruptionHigh = [
  { occupation: "Data Entry Clerk", risk: 91, source: "McKinsey: 86% tasks automatable" },
  { occupation: "Telemarketer", risk: 88, source: "Oxford: highest automation probability" },
  { occupation: "Bank Teller", risk: 84, source: "Goldman Sachs: 80%+ routine tasks" },
  { occupation: "Cashier", risk: 83, source: "WEF: 26M clerical roles displaced by 2027" },
  { occupation: "Admin Secretary", risk: 79, source: "WEF: 19M secretarial roles declining" },
  { occupation: "Bookkeeper (Basic)", risk: 76, source: "Rule-based financial recording" },
  { occupation: "Print/Layout Designer", risk: 72, source: "GenAI replacing templated work" },
  { occupation: "Content Writer (Generic)", risk: 71, source: "LLMs handle templated content" },
  { occupation: "Graphic Designer (Jr)", risk: 63, source: "WEF 2025: newly declining" },
];

export const aiDisruptionMedium = [
  { occupation: "Graphic Designer (Sr)", risk: 55 },
  { occupation: "Financial Analyst", risk: 52 },
  { occupation: "Legal Researcher", risk: 49 },
  { occupation: "HR Executive", risk: 48 },
  { occupation: "Journalist / Editor", risk: 46 },
  { occupation: "Marketing Specialist", risk: 44 },
  { occupation: "Business Analyst", risk: 41 },
  { occupation: "Software Engineer", risk: 35 },
  { occupation: "Data Scientist", risk: 33 },
  { occupation: "UX Researcher", risk: 31 },
];

export const aiDisruptionLow = [
  { occupation: "Cybersecurity Analyst", risk: 22 },
  { occupation: "Teacher / Educator", risk: 16 },
  { occupation: "Registered Nurse", risk: 14 },
  { occupation: "AI/ML Engineer", risk: 12 },
  { occupation: "Physiotherapist", risk: 10 },
  { occupation: "Social Worker", risk: 9 },
  { occupation: "Electrician", risk: 8 },
  { occupation: "Psychiatrist", risk: 7 },
  { occupation: "Plumber", risk: 6 },
  { occupation: "Surgeon", risk: 5 },
];

export const allAiDisruption = [
  ...aiDisruptionHigh.map(d => ({ ...d, category: "High Risk" })),
  ...aiDisruptionMedium.map(d => ({ ...d, category: "Medium Risk", source: "" })),
  ...aiDisruptionLow.map(d => ({ ...d, category: "Low Risk", source: "" })),
];

// ---- Occupation Growth Trend (Jan-Dec 2024, indexed) ----
export const occupationTrend = [
  { month: "Jan", SoftEng: 100, DataAnalyst: 100, Nurse: 100, BizAnalyst: 100, Cybersec: 100 },
  { month: "Feb", SoftEng: 102, DataAnalyst: 103, Nurse: 102, BizAnalyst: 101, Cybersec: 105 },
  { month: "Mar", SoftEng: 105, DataAnalyst: 107, Nurse: 104, BizAnalyst: 103, Cybersec: 108 },
  { month: "Apr", SoftEng: 104, DataAnalyst: 109, Nurse: 107, BizAnalyst: 104, Cybersec: 112 },
  { month: "May", SoftEng: 108, DataAnalyst: 112, Nurse: 110, BizAnalyst: 106, Cybersec: 118 },
  { month: "Jun", SoftEng: 110, DataAnalyst: 115, Nurse: 112, BizAnalyst: 107, Cybersec: 121 },
  { month: "Jul", SoftEng: 112, DataAnalyst: 117, Nurse: 115, BizAnalyst: 109, Cybersec: 125 },
  { month: "Aug", SoftEng: 115, DataAnalyst: 121, Nurse: 117, BizAnalyst: 111, Cybersec: 130 },
  { month: "Sep", SoftEng: 114, DataAnalyst: 124, Nurse: 120, BizAnalyst: 112, Cybersec: 133 },
  { month: "Oct", SoftEng: 118, DataAnalyst: 128, Nurse: 123, BizAnalyst: 113, Cybersec: 138 },
  { month: "Nov", SoftEng: 121, DataAnalyst: 131, Nurse: 125, BizAnalyst: 115, Cybersec: 142 },
  { month: "Dec", SoftEng: 124, DataAnalyst: 135, Nurse: 128, BizAnalyst: 117, Cybersec: 147 },
];

// ---- Emerging Roles ----
export const emergingRoles = [
  { role: "AI/ML Specialist", growth: 41, salaryMin: 9000, salaryMax: 18000 },
  { role: "Prompt Engineer", growth: 38, salaryMin: 7000, salaryMax: 14000 },
  { role: "Cybersecurity Architect", growth: 35, salaryMin: 12000, salaryMax: 22000 },
  { role: "Sustainability/ESG Analyst", growth: 33, salaryMin: 6000, salaryMax: 11000 },
  { role: "Fintech Engineer", growth: 31, salaryMin: 8500, salaryMax: 16000 },
  { role: "Healthcare AI Specialist", growth: 29, salaryMin: 8000, salaryMax: 15000 },
  { role: "Renewable Energy Engineer", growth: 27, salaryMin: 6000, salaryMax: 12000 },
  { role: "Data Ethics Officer", growth: 24, salaryMin: 8000, salaryMax: 14000 },
];

// ---- WEF Key Stats ----
export const wefStats = {
  netJobGrowth2030: 78_000_000,
  jobsCreated: 170_000_000,
  jobsDisplaced: 92_000_000,
  growthRate: 14,
  declineRate: 8,
  workersNeedReskilling: 59,
  skillsChangeBy2030: 39,
  employersSkillsGap: 63,
  employersHiringAI: 67,
  employersReducingHeadcount: 40,
  employersReorientingAI: 50,
};

export const fastestGrowingJobs = [
  { role: "Farmworkers & Agricultural Labourers", growth: "+34M" },
  { role: "Delivery Drivers & Couriers", growth: "+18M" },
  { role: "Construction Workers", growth: "+15M" },
  { role: "Salespersons", growth: "+12M" },
  { role: "Food Processing Workers", growth: "+9M" },
  { role: "Care Workers", growth: "+8M" },
  { role: "Nursing Professionals", growth: "+7.5M" },
  { role: "Software Developers", growth: "+6.8M" },
  { role: "Big Data Specialists", growth: "+6.2M" },
  { role: "AI/ML Specialists", growth: "+5.9M" },
];

export const fastestDecliningJobs = [
  { role: "Data Entry Clerks", decline: "-26M" },
  { role: "Administrative Secretaries", decline: "-19M" },
  { role: "Cashiers & Ticket Clerks", decline: "-14M" },
  { role: "Bank Tellers", decline: "-11M" },
  { role: "Postal Service Workers", decline: "-8M" },
  { role: "Payroll Clerks", decline: "-7M" },
  { role: "Administrative Assistants", decline: "-6.5M" },
  { role: "Printing & Binding Workers", decline: "-5.8M" },
  { role: "Accounting Clerks", decline: "-5.2M" },
  { role: "Travel Agents", decline: "-3.9M" },
];

// ---- Career Ranking ----
export const careerRanking = [
  { rank: 1, career: "Cybersecurity Analyst", overall: 89, demand: 95, growth: 91, stability: 88, aiRisk: 22, wlb: 72, society: 82 },
  { rank: 2, career: "AI/ML Engineer", overall: 87, demand: 93, growth: 95, stability: 85, aiRisk: 12, wlb: 70, society: 78 },
  { rank: 3, career: "Data Scientist", overall: 85, demand: 90, growth: 88, stability: 84, aiRisk: 33, wlb: 74, society: 75 },
  { rank: 4, career: "Registered Nurse", overall: 83, demand: 88, growth: 82, stability: 92, aiRisk: 14, wlb: 61, society: 96 },
  { rank: 5, career: "Software Engineer", overall: 82, demand: 91, growth: 85, stability: 83, aiRisk: 35, wlb: 76, society: 73 },
  { rank: 6, career: "Financial Analyst", overall: 78, demand: 80, growth: 74, stability: 86, aiRisk: 52, wlb: 68, society: 70 },
  { rank: 7, career: "Business Analyst", overall: 76, demand: 82, growth: 76, stability: 80, aiRisk: 41, wlb: 74, society: 68 },
  { rank: 8, career: "UX Designer", overall: 74, demand: 78, growth: 72, stability: 75, aiRisk: 31, wlb: 80, society: 72 },
  { rank: 9, career: "Mechanical Engineer", overall: 71, demand: 72, growth: 68, stability: 82, aiRisk: 28, wlb: 71, society: 76 },
  { rank: 10, career: "Lawyer / Solicitor", overall: 68, demand: 70, growth: 65, stability: 80, aiRisk: 49, wlb: 55, society: 82 },
];

// ---- Occupation Profiles ----
export const occupationProfiles = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    description: "Design, develop, test, and maintain software applications and systems. Core responsibilities include writing clean code, collaborating with cross-functional teams, debugging systems, and improving software performance. Demand driven by Malaysia's digital transformation push under MyDigital Blueprint 2030.",
    freshGradMin: 3000, average: 6800, median: 5500, senior: 15000,
    demandLevel: "Very High", demandPostings: 89400,
    stabilityScore: 8.3, wlb: 7.1, remotePossibility: "High (72%)",
    aiRisk: 35, environment: "Startup / Tech Company / MNC",
    workHours: 45,
    progression: [
      { level: "Fresh Grad", title: "Junior Developer", years: "0-1yr", salaryRange: "RM 3,000-4,500" },
      { level: "Junior", title: "Software Engineer", years: "1-3yr", salaryRange: "RM 4,500-6,000" },
      { level: "Mid", title: "Senior Engineer", years: "3-5yr", salaryRange: "RM 6,000-8,500" },
      { level: "Senior", title: "Lead/Principal", years: "5-8yr", salaryRange: "RM 8,500-12,000" },
      { level: "Expert", title: "Staff/Architect", years: "8yr+", salaryRange: "RM 12,000-18,000" },
    ],
    branches: [
      { path: "Tech Lead", salary: "RM 12,000-18,000" },
      { path: "Engineering Manager", salary: "RM 15,000-25,000" },
      { path: "Solutions Architect", salary: "RM 14,000-22,000" },
    ]
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    description: "Collect, process, and analyze data to uncover insights that guide business decisions. Proficiency in Python, SQL, and BI tools (Power BI, Tableau) is essential. High demand across banking, e-commerce, telco, and healthcare.",
    freshGradMin: 3000, average: 6200, median: 5200, senior: 12000,
    demandLevel: "Very High", demandPostings: 72300,
    stabilityScore: 8.5, wlb: 7.4, remotePossibility: "High (65%)",
    aiRisk: 45, environment: "Banking / Consulting / E-commerce",
    workHours: 43,
    progression: [
      { level: "Fresh Grad", title: "Junior Data Analyst", years: "0-1yr", salaryRange: "RM 3,000-4,000" },
      { level: "Junior", title: "Data Analyst", years: "1-3yr", salaryRange: "RM 4,000-6,000" },
      { level: "Mid", title: "Senior Analyst", years: "3-5yr", salaryRange: "RM 6,000-8,000" },
      { level: "Senior", title: "Lead Analyst", years: "5-8yr", salaryRange: "RM 8,000-11,000" },
      { level: "Expert", title: "Head of Data", years: "8yr+", salaryRange: "RM 11,000-18,000" },
    ],
    branches: [
      { path: "Data Scientist", salary: "RM 12,000-20,000" },
      { path: "Analytics Manager", salary: "RM 12,000-18,000" },
      { path: "BI Director", salary: "RM 15,000-22,000" },
    ]
  },
  {
    id: "registered-nurse",
    title: "Registered Nurse",
    description: "Provide patient care including assessment, treatment planning, medication administration, and health education. Demand driven by Malaysia's aging population and expanding healthcare infrastructure.",
    freshGradMin: 2500, average: 3800, median: 3200, senior: 7000,
    demandLevel: "Very High", demandPostings: 67800,
    stabilityScore: 9.2, wlb: 5.8, remotePossibility: "Very Low (<5%)",
    aiRisk: 14, environment: "Hospital / Clinic / Community Health",
    workHours: 48,
    progression: [
      { level: "Fresh Grad", title: "Staff Nurse", years: "0-2yr", salaryRange: "RM 2,500-3,800" },
      { level: "Mid", title: "Senior Nurse", years: "3-5yr", salaryRange: "RM 3,800-5,500" },
      { level: "Senior", title: "Specialist Nurse", years: "5-8yr", salaryRange: "RM 5,500-7,000" },
      { level: "Expert", title: "Head of Nursing", years: "8yr+", salaryRange: "RM 7,000-9,000" },
    ],
    branches: [
      { path: "Nurse Practitioner", salary: "RM 6,000-9,000" },
      { path: "Nursing Manager", salary: "RM 7,000-12,000" },
      { path: "Clinical Specialist", salary: "RM 6,500-10,000" },
    ]
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    description: "Protect organizational networks, systems, and data from cyber threats. Includes penetration testing, incident response, vulnerability assessment. Malaysia faces a 70,000+ cybersecurity talent gap (NACSA 2024).",
    freshGradMin: 4500, average: 8500, median: 7000, senior: 18000,
    demandLevel: "High", demandPostings: 49100,
    stabilityScore: 8.8, wlb: 7.0, remotePossibility: "Medium-High (55%)",
    aiRisk: 22, environment: "Banking / Government / MNC",
    workHours: 46,
    progression: [
      { level: "Fresh Grad", title: "Junior Analyst", years: "0-1yr", salaryRange: "RM 4,500-6,500" },
      { level: "Mid", title: "Security Analyst", years: "2-4yr", salaryRange: "RM 6,500-9,000" },
      { level: "Senior", title: "Senior Analyst", years: "4-7yr", salaryRange: "RM 9,000-15,000" },
      { level: "Expert", title: "Security Architect", years: "7yr+", salaryRange: "RM 15,000-22,000" },
    ],
    branches: [
      { path: "CISO", salary: "RM 20,000-35,000" },
      { path: "Pen Testing Lead", salary: "RM 15,000-22,000" },
      { path: "Security Consultant", salary: "RM 18,000-28,000" },
    ]
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    description: "Bridge business needs and technical solutions by gathering requirements, modelling processes, and analyzing data to improve operations. High demand in banking, consulting, logistics.",
    freshGradMin: 3500, average: 6500, median: 5500, senior: 14000,
    demandLevel: "High", demandPostings: 54200,
    stabilityScore: 8.0, wlb: 7.5, remotePossibility: "Medium (45%)",
    aiRisk: 41, environment: "Consulting / Banking / Corporate",
    workHours: 44,
    progression: [
      { level: "Fresh Grad", title: "Junior BA", years: "0-1yr", salaryRange: "RM 3,500-5,000" },
      { level: "Mid", title: "Business Analyst", years: "2-4yr", salaryRange: "RM 5,000-8,000" },
      { level: "Senior", title: "Senior BA", years: "4-7yr", salaryRange: "RM 8,000-12,000" },
      { level: "Expert", title: "Lead/Principal BA", years: "7yr+", salaryRange: "RM 12,000-18,000" },
    ],
    branches: [
      { path: "Product Manager", salary: "RM 12,000-20,000" },
      { path: "Strategy Director", salary: "RM 15,000-25,000" },
    ]
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    description: "Research, design, and test user interfaces to create intuitive digital experiences. Growing demand as Malaysian companies accelerate digital product development.",
    freshGradMin: 2500, average: 5800, median: 4800, senior: 11000,
    demandLevel: "Medium-High", demandPostings: 38900,
    stabilityScore: 7.5, wlb: 8.0, remotePossibility: "High (68%)",
    aiRisk: 31, environment: "Tech Company / Agency / Startup",
    workHours: 42,
    progression: [
      { level: "Fresh Grad", title: "Junior UX Designer", years: "0-1yr", salaryRange: "RM 2,500-3,500" },
      { level: "Mid", title: "UX Designer", years: "2-4yr", salaryRange: "RM 4,500-7,000" },
      { level: "Senior", title: "Senior UX Designer", years: "4-7yr", salaryRange: "RM 7,000-11,000" },
    ],
    branches: [
      { path: "UX Director", salary: "RM 12,000-18,000" },
      { path: "Product Designer", salary: "RM 10,000-16,000" },
    ]
  },
  {
    id: "financial-analyst",
    title: "Financial Analyst",
    description: "Evaluate financial data, forecast trends, and provide investment or business decision recommendations. Demand driven by Malaysia's growing capital markets and Islamic finance leadership.",
    freshGradMin: 2800, average: 7500, median: 6000, senior: 20000,
    demandLevel: "High", demandPostings: 42300,
    stabilityScore: 8.6, wlb: 6.8, remotePossibility: "Low-Medium (30%)",
    aiRisk: 52, environment: "Investment Bank / GLC / Insurance",
    workHours: 50,
    progression: [
      { level: "Fresh Grad", title: "Junior Analyst", years: "0-1yr", salaryRange: "RM 2,800-4,000" },
      { level: "Mid", title: "Financial Analyst", years: "2-4yr", salaryRange: "RM 5,000-8,000" },
      { level: "Senior", title: "Senior Analyst", years: "5-8yr", salaryRange: "RM 10,000-20,000" },
    ],
    branches: [
      { path: "Fund Manager", salary: "RM 15,000-30,000" },
      { path: "CFO", salary: "RM 25,000-50,000" },
    ]
  },
  {
    id: "graphic-designer",
    title: "Graphic Designer",
    description: "Create visual content for brand communication, marketing, and digital media. Note: GenAI tools are rapidly automating templated design work. Roles shifting toward creative direction.",
    freshGradMin: 2200, average: 4200, median: 3500, senior: 10000,
    demandLevel: "Medium (declining for junior)", demandPostings: 25000,
    stabilityScore: 5.5, wlb: 7.8, remotePossibility: "High (70%)",
    aiRisk: 63, environment: "Agency / In-house / Freelance",
    workHours: 40,
    progression: [
      { level: "Fresh Grad", title: "Junior Designer", years: "0-1yr", salaryRange: "RM 2,200-3,500" },
      { level: "Mid", title: "Graphic Designer", years: "2-4yr", salaryRange: "RM 3,500-5,500" },
      { level: "Senior", title: "Senior Designer", years: "5yr+", salaryRange: "RM 6,000-12,000" },
    ],
    branches: [
      { path: "Creative Director", salary: "RM 10,000-18,000" },
      { path: "Art Director", salary: "RM 8,000-15,000" },
    ]
  },
];

// ---- Universities ----
export const universities = [
  {
    id: "um", name: "Universiti Malaya (UM)", country: "Malaysia", city: "Kuala Lumpur",
    qsRank: 60, qsRankLabel: "#60", rankInCountry: "#1 in Malaysia",
    knownFor: ["Medicine", "Engineering", "Law", "Business", "Sciences"],
    tuitionLocal: "RM 5,000–16,000/yr", tuitionIntl: "RM 18,000–35,000/yr",
    scholarships: ["UMAC Merit Scholarship", "Yayasan Canselor Scholarship", "JPA Sponsored"],
    employability: 92, students: 30000,
  },
  {
    id: "utm", name: "Universiti Teknologi Malaysia (UTM)", country: "Malaysia", city: "Johor Bahru",
    qsRank: 118, qsRankLabel: "#118", rankInCountry: "#4 in Malaysia",
    knownFor: ["Engineering", "Technology", "Architecture"],
    tuitionLocal: "RM 4,000–10,000/yr", tuitionIntl: "RM 12,000–22,000/yr",
    scholarships: ["UTM International Doctoral Fellowship", "UTM Merit Scholarship"],
    employability: 89, students: 23000,
  },
  {
    id: "usm", name: "Universiti Sains Malaysia (USM)", country: "Malaysia", city: "Penang",
    qsRank: 146, qsRankLabel: "#146", rankInCountry: "#3 in Malaysia",
    knownFor: ["Sciences", "Engineering", "Healthcare"],
    tuitionLocal: "RM 4,000–12,000/yr", tuitionIntl: "RM 15,000–28,000/yr",
    scholarships: ["USM Fellowship", "USM Global Scholarship"],
    employability: 87, students: 25000,
  },
  {
    id: "upm", name: "Universiti Putra Malaysia (UPM)", country: "Malaysia", city: "Serdang, Selangor",
    qsRank: 145, qsRankLabel: "#130–160", rankInCountry: "Top 5 in Malaysia",
    knownFor: ["Agriculture", "Engineering", "Veterinary", "Food Science"],
    tuitionLocal: "RM 4,000–10,000/yr", tuitionIntl: "RM 12,000–22,000/yr",
    scholarships: ["UPM Scholarship Programme"],
    employability: 88, students: 27000,
  },
  {
    id: "monash-my", name: "Monash University Malaysia", country: "Malaysia", city: "Subang Jaya",
    qsRank: 42, qsRankLabel: "#42 (via Monash Australia)", rankInCountry: "Top intl campus in MY",
    knownFor: ["Business", "Engineering", "IT", "Medicine", "Law"],
    tuitionLocal: "RM 44,000–60,000/yr", tuitionIntl: "RM 44,000–60,000/yr",
    scholarships: ["Monash International Merit (up to 30%)", "MITS (full tuition)"],
    employability: 94, students: 8000,
  },
  {
    id: "taylors", name: "Taylor's University", country: "Malaysia", city: "Subang Jaya",
    qsRank: 253, qsRankLabel: "#253", rankInCountry: "#1 private in MY (QS)",
    knownFor: ["Hospitality", "Business", "Law", "Architecture"],
    tuitionLocal: "RM 30,000–55,000/yr", tuitionIntl: "RM 30,000–55,000/yr",
    scholarships: ["Taylor's Excellence Award (up to 100%)", "Academic Distinction Award"],
    employability: 91, students: 14000,
  },
  {
    id: "sunway", name: "Sunway University", country: "Malaysia", city: "Subang Jaya",
    qsRank: 320, qsRankLabel: "THE 301–350", rankInCountry: "#1 private (THE) in MY",
    knownFor: ["Business", "Computing", "Social Sciences"],
    tuitionLocal: "RM 25,000–50,000/yr", tuitionIntl: "RM 25,000–50,000/yr",
    scholarships: ["Sunway University Scholarship (up to 50%)"],
    employability: 90, students: 10000,
  },
  {
    id: "swinburne", name: "Swinburne Sarawak", country: "Malaysia", city: "Kuching, Sarawak",
    qsRank: 256, qsRankLabel: "#256 (via Swinburne Australia)", rankInCountry: "East MY leader",
    knownFor: ["Engineering", "IT", "Business", "Architecture"],
    tuitionLocal: "RM 20,000–38,000/yr", tuitionIntl: "RM 20,000–38,000/yr",
    scholarships: ["Swinburne Sarawak Scholarship", "State Bumiputera Scholarship"],
    employability: 88, students: 5000,
  },
  {
    id: "nus", name: "National University of Singapore (NUS)", country: "Singapore", city: "Singapore",
    qsRank: 8, qsRankLabel: "#8", rankInCountry: "#1 in Asia",
    knownFor: ["Business", "Law", "Medicine", "Computing", "Engineering"],
    tuitionLocal: "SGD 37,650–54,000/yr", tuitionIntl: "SGD 37,650–54,000/yr (≈RM 130,000–190,000)",
    scholarships: ["ASEAN Undergraduate Scholarship (full tuition + living allowance)"],
    employability: 97, students: 40000,
  },
  {
    id: "unimelb", name: "University of Melbourne", country: "Australia", city: "Melbourne",
    qsRank: 13, qsRankLabel: "#13", rankInCountry: "#1 in Australia",
    knownFor: ["Law", "Medicine", "Business", "Arts", "Engineering"],
    tuitionLocal: "AUD 38,000–50,000/yr", tuitionIntl: "AUD 38,000–50,000/yr (≈RM 115,000–150,000)",
    scholarships: ["Melbourne International Undergraduate (25–100% tuition)"],
    employability: 95, students: 52000,
  },
];

// ---- Seed Jobs ----
export const seedJobs = [
  {
    id: "j1", title: "Frontend Developer", company: "Grab Malaysia", location: "Kuala Lumpur",
    industry: "Technology", salaryMin: 5000, salaryMax: 9000, currency: "RM",
    jobType: "Full-time", workMode: "Hybrid", experienceLevel: "Junior (1-3yr)",
    skills: ["React", "TypeScript", "CSS", "Git"], description: "Build and maintain user-facing features for Grab's super app platform.",
    demandLevel: "Very High", aiRisk: 35, stabilityScore: 8.3, wlb: 7.1,
  },
  {
    id: "j2", title: "Data Analyst", company: "Maybank", location: "Kuala Lumpur",
    industry: "Finance & Insurance", salaryMin: 4500, salaryMax: 7500, currency: "RM",
    jobType: "Full-time", workMode: "On-site", experienceLevel: "Junior (1-3yr)",
    skills: ["SQL", "Python", "Power BI", "Excel"], description: "Analyze banking data to uncover customer insights and support business decisions.",
    demandLevel: "Very High", aiRisk: 45, stabilityScore: 8.5, wlb: 7.4,
  },
  {
    id: "j3", title: "Cybersecurity Analyst", company: "CIMB Group", location: "Kuala Lumpur",
    industry: "Finance & Insurance", salaryMin: 6500, salaryMax: 11000, currency: "RM",
    jobType: "Full-time", workMode: "Hybrid", experienceLevel: "Mid (3-5yr)",
    skills: ["Network Security", "SIEM", "Incident Response", "Python"], description: "Protect CIMB's digital banking infrastructure from cyber threats.",
    demandLevel: "High", aiRisk: 22, stabilityScore: 8.8, wlb: 7.0,
  },
  {
    id: "j4", title: "Registered Nurse", company: "Sunway Medical Centre", location: "Subang Jaya",
    industry: "Healthcare", salaryMin: 2800, salaryMax: 4500, currency: "RM",
    jobType: "Full-time", workMode: "On-site", experienceLevel: "Fresh Graduate",
    skills: ["Patient Care", "Clinical Assessment", "BLS/ACLS"], description: "Provide direct patient care in a premier private hospital.",
    demandLevel: "Very High", aiRisk: 14, stabilityScore: 9.2, wlb: 5.8,
  },
  {
    id: "j5", title: "UX Designer", company: "AirAsia Digital", location: "Kuala Lumpur",
    industry: "Technology", salaryMin: 5500, salaryMax: 8500, currency: "RM",
    jobType: "Full-time", workMode: "Remote", experienceLevel: "Mid (3-5yr)",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"], description: "Design intuitive digital experiences for AirAsia's travel super app.",
    demandLevel: "Medium-High", aiRisk: 31, stabilityScore: 7.5, wlb: 8.0,
  },
  {
    id: "j6", title: "Business Analyst", company: "Petronas", location: "Kuala Lumpur",
    industry: "Engineering & Manufacturing", salaryMin: 5000, salaryMax: 8500, currency: "RM",
    jobType: "Full-time", workMode: "On-site", experienceLevel: "Mid (3-5yr)",
    skills: ["Requirements Gathering", "Process Mapping", "SQL", "Jira"], description: "Bridge business and technical teams for Petronas digital transformation projects.",
    demandLevel: "High", aiRisk: 41, stabilityScore: 8.0, wlb: 7.5,
  },
  {
    id: "j7", title: "AI/ML Engineer", company: "Axiata Digital Labs", location: "Kuala Lumpur",
    industry: "Technology", salaryMin: 9000, salaryMax: 16000, currency: "RM",
    jobType: "Full-time", workMode: "Hybrid", experienceLevel: "Senior (5-8yr)",
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "AWS"], description: "Build and deploy ML models to enhance telecom customer experience.",
    demandLevel: "Very High", aiRisk: 12, stabilityScore: 8.5, wlb: 7.0,
  },
  {
    id: "j8", title: "Financial Analyst", company: "CIMB Investment Bank", location: "Kuala Lumpur",
    industry: "Finance & Insurance", salaryMin: 5500, salaryMax: 9000, currency: "RM",
    jobType: "Full-time", workMode: "On-site", experienceLevel: "Mid (3-5yr)",
    skills: ["Financial Modelling", "Excel", "Bloomberg", "Valuation"], description: "Provide equity research and investment recommendations.",
    demandLevel: "High", aiRisk: 52, stabilityScore: 8.6, wlb: 6.8,
  },
  {
    id: "j9", title: "DevOps Engineer", company: "Maxis", location: "Kuala Lumpur",
    industry: "Technology", salaryMin: 7000, salaryMax: 12000, currency: "RM",
    jobType: "Full-time", workMode: "Hybrid", experienceLevel: "Mid (3-5yr)",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"], description: "Manage cloud infrastructure and CI/CD pipelines for Maxis digital services.",
    demandLevel: "High", aiRisk: 30, stabilityScore: 8.2, wlb: 7.3,
  },
  {
    id: "j10", title: "Digital Marketing Specialist", company: "Lazada Malaysia", location: "Kuala Lumpur",
    industry: "Sales & Marketing", salaryMin: 4000, salaryMax: 7000, currency: "RM",
    jobType: "Full-time", workMode: "Hybrid", experienceLevel: "Junior (1-3yr)",
    skills: ["Google Ads", "SEO", "Social Media", "Analytics"], description: "Drive user acquisition and engagement across digital channels.",
    demandLevel: "Medium-High", aiRisk: 44, stabilityScore: 7.0, wlb: 7.5,
  },
  {
    id: "j11", title: "Mechanical Engineer", company: "Intel Penang", location: "Penang",
    industry: "Engineering & Manufacturing", salaryMin: 4500, salaryMax: 8000, currency: "RM",
    jobType: "Full-time", workMode: "On-site", experienceLevel: "Junior (1-3yr)",
    skills: ["CAD", "SolidWorks", "Thermodynamics", "Manufacturing Processes"], description: "Design and optimize semiconductor manufacturing equipment.",
    demandLevel: "High", aiRisk: 28, stabilityScore: 8.2, wlb: 7.1,
  },
  {
    id: "j12", title: "HR Executive", company: "TechCorp Malaysia", location: "Cyberjaya",
    industry: "Human Resources", salaryMin: 3500, salaryMax: 5500, currency: "RM",
    jobType: "Full-time", workMode: "Hybrid", experienceLevel: "Junior (1-3yr)",
    skills: ["Recruitment", "HRIS", "Employee Relations", "Labour Law"], description: "Manage recruitment and employee experience for a growing tech company.",
    demandLevel: "Medium", aiRisk: 48, stabilityScore: 7.5, wlb: 7.8,
  },
];

// ---- Seed Community Posts ----
export const seedPosts = [
  {
    id: "p1", author: "Ahmad Razif", avatar: "AR", title: "Software Engineers in KL — what's your actual salary?",
    content: "According to DOSM data, the national mean salary for IT professionals is RM 8,500/month. Robert Walters reports Junior Devs earn RM 60K-120K/year. I'm a mid-level dev at a local startup earning RM 6,500. Is this fair for 3 years experience?",
    category: "Salary Talk", upvotes: 234, comments: 67, time: "2h ago",
  },
  {
    id: "p2", author: "Sarah Lim", avatar: "SL", title: "Is cybersecurity really the best career for 2025?",
    content: "NACSA reports 70,000+ unfilled cybersecurity roles in Malaysia. WEF ranks it as the #1 career with an overall score of 89/100. Only 22% AI disruption risk. Should I switch from software engineering?",
    category: "Career Switch", upvotes: 189, comments: 42, time: "4h ago",
  },
  {
    id: "p3", author: "Priya Devi", avatar: "PD", title: "Fresh grad nurse salary — is RM 2,500 really the starting?",
    content: "Just graduated from USM nursing program. MOH data shows staff nurses start at RM 2,500-3,800/month. Meanwhile there's a shortage of 20,000 nurses nationally. Shouldn't the pay be higher for such critical work?",
    category: "Healthcare", upvotes: 312, comments: 89, time: "6h ago",
  },
  {
    id: "p4", author: "Daniel Tan", avatar: "DT", title: "WEF says 92M jobs will be displaced by 2030. Are you ready?",
    content: "The WEF Future of Jobs 2025 report says 170M new jobs will be created but 92M displaced. Net gain of +78M. 59 out of 100 workers need reskilling. Data Entry Clerks face 91% AI risk. What are you doing to future-proof?",
    category: "Industry Trends", upvotes: 456, comments: 123, time: "8h ago",
  },
  {
    id: "p5", author: "Mei Ling", avatar: "ML", title: "UM vs Monash Malaysia — which is better for CS?",
    content: "UM is ranked #60 globally (QS 2025) with RM 5K-16K/yr tuition. Monash MY is via #42 parent but costs RM 44K-60K/yr. UM employability is 92%, Monash is 94%. Is the 3x price difference worth it?",
    category: "Universities", upvotes: 278, comments: 56, time: "12h ago",
  },
  {
    id: "p6", author: "Raj Kumar", avatar: "RK", title: "Prompt Engineering — is it a real career or just hype?",
    content: "LinkedIn reports +38% YoY growth for prompt engineers. Salary range RM 7,000-14,000/month in MY. But is this sustainable or will models become so good that prompt engineering becomes obsolete?",
    category: "AI & Tech", upvotes: 198, comments: 78, time: "1d ago",
  },
  {
    id: "p7", author: "Aisha Rahman", avatar: "AR2", title: "Penang semiconductor jobs — Intel, AMD, Micron all hiring",
    content: "Penang's average salary is RM 3,934/month (DOSM). But semiconductor engineers at Intel/AMD can earn RM 5,000-10,000+. With global chip demand rising, this might be the best engineering hub in Malaysia.",
    category: "Job Hunting", upvotes: 167, comments: 34, time: "1d ago",
  },
  {
    id: "p8", author: "Jason Wong", avatar: "JW", title: "5% salary increment in 2025 — above ASEAN average!",
    content: "Randstad Malaysia reports the median salary increment forecast for 2025 is 5.0%, above the ASEAN average. Workers earning below RM 2,000/month dropped from 31.2% to 27.4%. Things are improving but slowly.",
    category: "Salary Talk", upvotes: 145, comments: 29, time: "2d ago",
  },
];