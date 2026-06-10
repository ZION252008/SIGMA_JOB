import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Shield, AlertTriangle, Loader2, Bot } from 'lucide-react';
import { AI_UNAVAILABLE_MSG, GeminiApiError, allAiDisruption, aiProofSkills, aiAmplifyingSkills, callGemini } from '../data/marketData';

export default function AiTrends({ dark }: { dark: boolean }) {
  const [selectedOcc, setSelectedOcc] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | string>(false);

  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';

  const chartData = allAiDisruption.sort((a, b) => b.risk - a.risk).map(d => ({
    name: d.occupation.length > 20 ? d.occupation.slice(0, 20) + '…' : d.occupation,
    fullName: d.occupation,
    risk: d.risk,
    category: d.category,
  }));

  const getColor = (risk: number) => {
    if (risk >= 60) return '#EF4444';
    if (risk >= 30) return '#F59E0B';
    return '#10B981';
  };

  const analyzeOccupation = async () => {
    if (!selectedOcc) return;
    setLoading(true);
    setError(false);
    try {
      const prompt = `Analyze the AI disruption risk for "${selectedOcc}" in the Malaysian job market. 
      Use real data: the occupation has approximately ${allAiDisruption.find(d => d.occupation.includes(selectedOcc))?.risk || 'unknown'}% automation risk.
      Cover: 1) Which tasks AI will automate 2) Which tasks remain human 3) How to future-proof 
      4) Timeline (2025-2030). Keep under 200 words. Reference WEF Future of Jobs 2025 data.`;
      const result = await callGemini(prompt);
      setAnalysis(result);
    } catch (err: unknown) {
      setError(
        err instanceof GeminiApiError && err.status === 500
          ? AI_UNAVAILABLE_MSG
          : 'Failed to analyze. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className={`type-display ${text} mb-2`}>AI Trend Analyzer</h1>
        <p className={`${sub} mb-6`}>Understand how AI will impact every occupation</p>

        <div className={`rounded-xl p-6 mb-8 border ${dark ? 'bg-[#09091A] border-[#16163A]' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light'}`}>
          <p className={`text-lg font-semibold ${text} text-center`}>
            WEF Future of Jobs 2025: <span className="text-red-400">92 million</span> roles will be displaced by 2030.
            <span className={dark ? 'text-emerald-400' : 'text-[#1F4D3A]'}> 170 million</span> new roles will be created.
            Net gain: <span className={`font-bold ${dark ? 'text-emerald-400' : 'text-[#1F4D3A]'}`}>+78 million jobs</span>.
          </p>
        </div>

        <div className={`${card} border rounded-2xl p-6 mb-8`}>
          <h2 className={`type-heading ${text} mb-1`}>AI Disruption Risk by Occupation</h2>
          <p className={`text-xs ${sub} mb-4`}>Source: Oxford Frey-Osborne / WEF 2025 / McKinsey 2024 / Goldman Sachs 2024</p>
          
          <div className="flex gap-4 mb-4">
            <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-sm bg-red-500"></span> High (&gt;60%)</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-sm bg-yellow-500"></span> Medium (30-60%)</span>
            <span className="flex items-center gap-1 text-xs"><span className="w-3 h-3 rounded-sm bg-green-500"></span> Low (&lt;30%)</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[700px] h-[700px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <XAxis type="number" domain={[0, 100]} stroke={dark ? '#666' : '#999'} fontSize={11} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={160} stroke={dark ? '#666' : '#999'} fontSize={10} />
                  <Tooltip
                    contentStyle={{ background: dark ? '#0D0D1C' : '#F8F8FD', border: `1px solid ${dark ? '#1E1E45' : '#D0D0E8'}`, borderRadius: 12, fontSize: 12 }}
                    formatter={(value: any) => [`${value}% risk`, 'AI Disruption']}
                  />
                  <Bar dataKey="risk" radius={[0, 6, 6, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={getColor(entry.risk)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Analysis Tool */}
        <div className={`${card} border rounded-2xl p-6 mb-8`}>
          <h2 className={`type-heading ${text} mb-4 flex items-center gap-2`}>
            <Bot size={16} /> AI Deep Analysis
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <select value={selectedOcc} onChange={e => setSelectedOcc(e.target.value)}
              className={`${dark ? 'bg-[#060611] border-[#13133A] text-[#E8E8F5]' : 'bg-[#F8F8FD] border-[#D0D0E8] text-[#0D0D2E]'} border rounded-xl px-4 py-2.5 text-sm flex-1 outline-none`}>
              <option value="">Select an occupation...</option>
              {allAiDisruption.map(d => (
                <option key={d.occupation} value={d.occupation}>{d.occupation} ({d.risk}%)</option>
              ))}
            </select>
            <button onClick={analyzeOccupation} disabled={!selectedOcc || loading}
              className="bg-[#1F4D3A] text-white px-6 py-2.5 rounded-xl font-medium text-sm disabled:opacity-50 flex items-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : 'Analyze with AI'}
            </button>
          </div>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
              {error}
              {error !== AI_UNAVAILABLE_MSG && (
                <> <button onClick={analyzeOccupation} className="underline">Retry</button></>
              )}
            </div>
          )}
          {analysis && (
            <div className={`${dark ? 'bg-[#060611]' : 'bg-[#E8E8F5]'} rounded-xl p-4 text-sm ${text} whitespace-pre-wrap animate-fadeIn`}>
              {analysis}
            </div>
          )}
        </div>

        {/* AI-Proof & Amplifying Skills */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className={`${card} border rounded-2xl p-6`}>
            <h2 className={`type-heading ${text} mb-4 flex items-center gap-2`}>
              <Shield size={16} className={dark ? 'text-emerald-400' : 'text-[#1F4D3A]'} /> AI-Proof Skills
            </h2>
            <p className={`text-xs ${sub} mb-3`}>Skills AI cannot replicate</p>
            <div className="flex flex-wrap gap-2">
              {aiProofSkills.map(s => (
                <span key={s} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${dark ? 'border-emerald-500/30 text-emerald-400' : 'border-[#1F4D3A]/30 text-[#1F4D3A]'}`}>{s}</span>
              ))}
            </div>
          </div>
          <div className={`${card} border rounded-2xl p-6`}>
            <h2 className={`type-heading ${text} mb-4 flex items-center gap-2`}>
              <AlertTriangle size={16} className="text-[#1F4D3A]" /> AI-Amplifying Skills
            </h2>
            <p className={`text-xs ${sub} mb-3`}>MORE valuable when combined with AI</p>
            <div className="flex flex-wrap gap-2">
              {aiAmplifyingSkills.map(s => (
                <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-[#5B52C4]/10 text-[#5B52C4] border border-[#5B52C4]/20">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className={`${card} border rounded-2xl p-4 text-center`}>
          <p className={`text-xs ${sub}`}>
            Sources: Oxford Frey-Osborne Automation Study | WEF Future of Jobs 2025 | McKinsey AI Task Research 2024 | Goldman Sachs AI Report 2024
          </p>
        </div>
      </div>
    </div>
  );
}