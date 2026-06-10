import { useState, useRef } from 'react';
import { FileText, Loader2, RotateCcw, CheckCircle, AlertTriangle, GraduationCap, Upload, X, Lightbulb, Key, Star } from 'lucide-react';
import { AI_UNAVAILABLE_MSG, GeminiApiError, callGemini, callGeminiWithFile } from '../data/marketData';

const careers = [
  "Software Engineer", "Data Analyst", "Cybersecurity Analyst", "Registered Nurse",
  "Business Analyst", "UX Designer", "Financial Analyst", "Graphic Designer",
  "AI/ML Engineer", "Mechanical Engineer"
];

interface AnalysisResult {
  score: number;
  skillsFound: string[];
  missingSkills: string[];
  suggestions: string[];
  perfectResumeModel: string;
  keywordsToAdd: string[];
  freshGradUniversities: { name: string; country: string; reason: string }[];
}

const loadingSteps = [
  'Reading your resume...',
  'Extracting skills...',
  'Comparing with job requirements...',
  'Finding skill gaps...',
  'Generating suggestions...',
  'Finalizing your analysis...',
];

export default function ResumeAnalyzer({ dark }: { dark: boolean }) {
  const [career, setCareer] = useState('Software Engineer');
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<false | string>(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';

  const buildPrompt = () => {
    return `You are a professional resume analyst for the Malaysian job market. The user is targeting ${career}. Resume text: ${resumeText}. Respond in valid JSON only (no markdown, no backticks, no explanation): { "score": number 0-100, "skillsFound": ["string array of skills found"], "missingSkills": ["string array of missing critical skills"], "suggestions": ["8 specific actionable suggestions"], "perfectResumeModel": "brief description of ideal resume for this role", "keywordsToAdd": ["8 important keywords to add"], "freshGradUniversities": [{"name": "uni name", "country": "country", "reason": "why this uni is good for this career"}] }`;
  };

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      alert('File too large. Max 10MB.');
      return;
    }
    setFile(f);
  };

  const analyze = async () => {
    if (!resumeText.trim() && !file) return;
    setLoading(true);
    setError(false);
    setResult(null);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => prev < loadingSteps.length - 1 ? prev + 1 : prev);
    }, 800);

    try {
      let result: string;
      if (file) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        result = await callGeminiWithFile(buildPrompt(), base64, file.type);
      } else {
        result = await callGemini(buildPrompt());
      }
      const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
    } catch (err: unknown) {
      setError(
        err instanceof GeminiApiError && err.status === 500
          ? AI_UNAVAILABLE_MSG
          : 'Analysis failed. Please try again.'
      );
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className={`type-display ${text} mb-2`}>Resume Analyzer</h1>
        <p className={`${sub} mb-8`}>AI-powered resume review for the Malaysian job market</p>

        {!result && !loading && (
          <div className={`${card} border rounded-2xl p-6 animate-fadeIn`}>
            <div className="mb-4">
              <label className={`text-sm font-medium ${text} block mb-2`}>Target Career</label>
              <select value={career} onChange={e => setCareer(e.target.value)}
                className={`w-full ${dark ? 'bg-[#060611] border-[#13133A] text-[#E8E8F5]' : 'bg-[#F8F8FD] border-[#D0D0E8] text-[#0D0D2E]'} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
                {careers.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition mb-4 ${
                dragOver ? 'border-[#5B52C4] bg-[#2A1F6E]/20' : dark ? 'border-[#13133A] hover:border-[#5B52C4]' : 'border-[#D0D0E8] hover:border-[#5B52C4]'
              }`}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" className="hidden"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText size={24} className="text-[#5B52C4]" />
                  <div className="text-left">
                    <div className={`text-sm font-medium ${text}`}>{file.name}</div>
                    <div className={`text-xs ${sub}`}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="p-1 rounded-full hover:bg-white/10">
                    <X size={16} className={sub} />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload size={32} className={`mx-auto mb-2 ${sub}`} />
                  <p className={`text-sm font-medium ${text}`}>Drop your resume here</p>
                  <p className={`text-xs ${sub} mt-1`}>PDF · PNG · JPG · WEBP</p>
                </div>
              )}
            </div>

            {/* Toggle text input */}
            <div className="text-center mb-3">
              <button onClick={() => setShowTextInput(!showTextInput)}
                className={`text-xs ${sub} hover:text-[#5B52C4] underline`}>
                {showTextInput ? '← Hide text input' : 'Or paste resume text instead ↓'}
              </button>
            </div>

            {showTextInput && (
              <div className="mb-4">
                <textarea value={resumeText} onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here... (or summarize your experience, skills, education)"
                  rows={8}
                  className={`w-full ${dark ? 'bg-[#060611] border-[#13133A] text-[#E8E8F5]' : 'bg-[#F8F8FD] border-[#D0D0E8] text-[#0D0D2E]'} border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#5B52C4] resize-none`} />
              </div>
            )}

            <button onClick={analyze} disabled={(!resumeText.trim() && !file)}
              className="w-full bg-[#1F4D3A] text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              <FileText size={18} /> Analyze Resume
            </button>
          </div>
        )}

        {loading && (
          <div className={`${card} border rounded-2xl p-8 text-center animate-fadeIn`}>
            <Loader2 size={40} className="text-[#5B52C4] animate-spin mx-auto mb-4" />
            <div className="space-y-2">
              {loadingSteps.map((step, i) => (
                <div key={i} className={`text-sm transition-all duration-500 ${
                  i <= loadingStep ? `${text} opacity-100` : `${sub} opacity-30`
                }`}>{step}</div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center animate-fadeIn">
            <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
            <p className="text-red-400 mb-3">{error}</p>
            {error !== AI_UNAVAILABLE_MSG && (
              <button onClick={analyze} className="bg-[#1F4D3A] text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 mx-auto">
                <RotateCcw size={16} /> Retry Analysis
              </button>
            )}
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-fadeIn">
            <button onClick={() => { setResult(null); setResumeText(''); setFile(null); }}
              className={`text-sm ${sub} hover:text-[#5B52C4]`}>← Analyze another resume</button>

            {/* Score */}
            <div className={`${card} border rounded-2xl p-6 text-center`}>
              <div className={`type-stat mb-2 ${dark ? 'text-[#E8E8F5]' : 'text-[#1F4D3A]'}`}>{result.score}/100</div>
              <div className={`text-sm ${sub}`}>Resume Score for {career}</div>
              <div className={`w-full h-2 rounded-full mt-3 ${dark ? 'bg-white/10' : 'bg-[#E8E8F5]'}`}>
                <div className="h-full rounded-full bg-[#1F4D3A] transition-all duration-1000"
                  style={{ width: `${result.score}%` }}></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Skills Found */}
              <div className={`${card} border rounded-2xl p-5`}>
                <h3 className={`font-semibold ${text} mb-3 flex items-center gap-2`}>
                  <CheckCircle size={16} className="text-[#1F4D3A]" /> Skills Found
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.skillsFound.map(s => (
                    <span key={s} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${dark ? 'border-emerald-500/30 text-emerald-400' : 'border-[#1F4D3A]/30 text-[#1F4D3A]'}`}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className={`${card} border rounded-2xl p-5`}>
                <h3 className={`font-semibold ${text} mb-3 flex items-center gap-2`}>
                  <AlertTriangle size={16} className="text-[#D4A017]" /> Missing Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingSkills.map(s => (
                    <a href="/skill-tree" key={s} className="inline-block">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 cursor-pointer">{s}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className={`${card} border rounded-2xl p-5`}>
              <h3 className={`type-heading ${text} mb-3 flex items-center gap-2`}>
                <Lightbulb size={16} /> Suggestions
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className={`text-sm ${sub} flex items-start gap-2`}>
                    <span className="text-[#5B52C4] font-bold shrink-0">{i + 1}.</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div className={`${card} border rounded-2xl p-5`}>
              <h3 className={`type-heading ${text} mb-3 flex items-center gap-2`}>
                <Key size={16} /> Keywords to Add
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {result.keywordsToAdd.map(k => (
                  <span key={k} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#5B52C4]/10 text-[#5B52C4]">{k}</span>
                ))}
              </div>
            </div>

            {/* Universities */}
            {result.freshGradUniversities && result.freshGradUniversities.length > 0 && (
              <div className={`${card} border rounded-2xl p-5`}>
                <h3 className={`font-semibold ${text} mb-3 flex items-center gap-2`}>
                  <GraduationCap size={16} className="text-[#5B52C4]" /> Recommended Universities
                </h3>
                <div className="space-y-2">
                  {result.freshGradUniversities.map((u, i) => (
                    <div key={i} className={`${dark ? 'bg-[#060611]' : 'bg-[#E8E8F5]'} rounded-xl p-3`}>
                      <div className={`font-medium ${text} text-sm`}>{u.name}</div>
                      <div className={`text-xs ${sub}`}>{u.country} — {u.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Perfect Resume */}
            <div className={`${card} border rounded-2xl p-5`}>
              <h3 className={`type-heading ${text} mb-3 flex items-center gap-2`}>
                <Star size={16} /> Ideal Resume Model
              </h3>
              <p className={`text-sm ${sub}`}>{result.perfectResumeModel}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}