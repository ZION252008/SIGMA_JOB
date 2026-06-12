import { useState } from 'react';
import { GraduationCap, MapPin, Users, Award, ChevronDown, ChevronUp, X, Loader2, Sparkles, BarChart3 } from 'lucide-react';
import { AI_UNAVAILABLE_MSG, GeminiApiError, universities, callGemini } from '../data/marketData';
import { useReveal, revealCls } from '../hooks/useReveal';
import { useTilt } from '../hooks/useTilt';

const studyFields = ['Technology', 'Healthcare', 'Business', 'Engineering', 'Law', 'Sciences', 'Design', 'Architecture'];

const pillSecondary = (dark: boolean) =>
  dark
    ? 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#0D0D1C] text-[#8B8BA8] border border-[#16163A]'
    : 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#E4E4F4] text-[#2A2A4A] border border-[#CCCCE4]';

function UniversityCard({
  u,
  dark,
  expanded,
  onToggle,
  compared,
  onCompareChange,
}: {
  u: (typeof universities)[number];
  dark: boolean;
  expanded: boolean;
  onToggle: () => void;
  compared: boolean;
  onCompareChange: () => void;
}) {
  const { ref: revealRef, revealed } = useReveal();
  const { ref: tiltRef, ...tiltHandlers } = useTilt(4);
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const card = dark
    ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark'
    : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const inset = dark ? 'bg-[#060611] border-[#0F0F2E]' : 'bg-[#E8E8F5] border-[#CCCCE4]';

  return (
    <div ref={revealRef} className={revealCls(revealed)}>
      <div
        ref={tiltRef}
        {...tiltHandlers}
        className={`tilt-card ${card} border rounded-xl overflow-hidden transition hover:border-[#5B52C4]/40`}
      >
        <button type="button" onClick={onToggle} className="w-full text-left p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1F4D3A] flex items-center justify-center text-white text-lg font-bold shrink-0">
                {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className={`font-bold ${text} text-lg`}>{u.name}</div>
                <div className={`text-sm ${sub} flex items-center gap-2 mt-0.5`}>
                  <MapPin size={14} /> {u.city}, {u.country}
                  <span className="text-[#5B52C4] font-medium">· {u.rankInCountry}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {u.knownFor.map(k => (
                    <span key={k} className={pillSecondary(dark)}>{k}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-[#5B52C4]">{u.qsRankLabel}</div>
                <div className={`text-xs ${sub}`}>QS Rank</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-[#1F4D3A]">{u.employability}%</div>
                <div className={`text-xs ${sub}`}>Employability</div>
              </div>
              <label className="flex items-center gap-1 cursor-pointer" onClick={e => e.stopPropagation()}>
                <input type="checkbox" checked={compared} onChange={onCompareChange} className="w-4 h-4 rounded" />
                <span className={`text-xs ${sub}`}>Compare</span>
              </label>
              {expanded ? <ChevronUp size={20} className={sub} /> : <ChevronDown size={20} className={sub} />}
            </div>
          </div>
        </button>

        {expanded && (
          <div className={`border-t ${dark ? 'border-[#14143A]' : 'border-[#D0D0E8]'} p-6 animate-fadeIn`}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className={`text-sm font-semibold ${text} mb-2 flex items-center gap-2`}>
                  <GraduationCap size={16} className="text-[#5B52C4]" /> Tuition Fees
                </h3>
                <div className={`text-sm ${sub}`}>
                  <p>Local: <span className={text}>{u.tuitionLocal}</span></p>
                  <p>International: <span className={text}>{u.tuitionIntl}</span></p>
                </div>
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${text} mb-2 flex items-center gap-2`}>
                  <Award size={16} className="text-[#1F4D3A]" /> Scholarships
                </h3>
                <ul className={`text-sm ${sub} space-y-1`}>
                  {u.scholarships.map(s => (
                    <li key={s} className="flex items-start gap-1">
                      <span className="text-[#1F4D3A]">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${text} mb-2 flex items-center gap-2`}>
                  <Users size={16} className="text-[#D4A017]" /> Key Stats
                </h3>
                <div className={`text-sm ${sub}`}>
                  <p>Students: <span className={text}>{u.students?.toLocaleString()}</span></p>
                  <p>Employability: <span className="text-[#1F4D3A] font-medium">{u.employability}%</span></p>
                </div>
              </div>
            </div>
            <p className={`text-xs ${sub} mt-4`}>Source: QS World University Rankings 2025, official university websites</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Universities({ dark }: { dark: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterCountry, setFilterCountry] = useState('All');
  const [sort, setSort] = useState<'rank' | 'employability'>('rank');
  const [compared, setCompared] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);
  const [selectedField, setSelectedField] = useState('Technology');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<false | string>(false);

  const titleRef = useReveal();
  const subtitleRef = useReveal();

  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const input = dark ? 'bg-[#09091A] border-[#13133A] text-[#E8E8F5]' : 'bg-[#F8F8FD] border-[#D0D0E8] text-[#0D0D2E]';
  const inset = dark ? 'bg-[#060611] border-[#0F0F2E]' : 'bg-[#E8E8F5] border-[#CCCCE4]';

  const countries = ['All', ...new Set(universities.map(u => u.country))];

  let filtered = universities.filter(u => filterCountry === 'All' || u.country === filterCountry);
  filtered = [...filtered].sort((a, b) => sort === 'rank' ? a.qsRank - b.qsRank : b.employability - a.employability);

  const getAiAnalysis = async () => {
    const ids = [...compared];
    const u1 = universities.find(u => u.id === ids[0])!;
    const u2 = universities.find(u => u.id === ids[1])!;

    setAiLoading(true);
    setAiError(false);
    setAiAnalysis('');

    try {
      const prompt = `Compare ${u1.name} (QS rank #${u1.qsRank}, located in ${u1.city}, graduate employability ${u1.employability}%, local tuition ${u1.tuitionLocal}) with ${u2.name} (QS rank #${u2.qsRank}, located in ${u2.city}, graduate employability ${u2.employability}%, local tuition ${u2.tuitionLocal}). A student wants to study ${selectedField}. Which university is the better choice and why? Cover: value for money, career outcomes, scholarship availability, and location advantage. Be specific. Keep under 200 words.`;
      const response = await callGemini(prompt);
      setAiAnalysis(response);
    } catch (err: unknown) {
      setAiError(
        err instanceof GeminiApiError && err.status === 500
          ? AI_UNAVAILABLE_MSG
          : 'Analysis failed. Please try again.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 ref={titleRef.ref} className={revealCls(titleRef.revealed, 'type-display', text, 'mb-2')}>Universities</h1>
        <p ref={subtitleRef.ref} className={revealCls(subtitleRef.revealed, sub, 'mb-6')}>QS World Rankings 2025 — Real data from official sources</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={filterCountry}
            onChange={e => setFilterCountry(e.target.value)}
            className={`${input} border rounded-xl px-4 py-2.5 text-sm outline-none`}
          >
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as 'rank' | 'employability')}
            className={`${input} border rounded-xl px-4 py-2.5 text-sm outline-none`}
          >
            <option value="rank">Sort by QS Rank</option>
            <option value="employability">Sort by Employability</option>
          </select>
        </div>

        <div className="space-y-4">
          {filtered.map(u => (
            <UniversityCard
              key={u.id}
              u={u}
              dark={dark}
              expanded={expanded === u.id}
              onToggle={() => setExpanded(expanded === u.id ? null : u.id)}
              compared={compared.has(u.id)}
              onCompareChange={() => {
                const next = new Set(compared);
                if (next.has(u.id)) next.delete(u.id);
                else if (next.size < 2) next.add(u.id);
                setCompared(next);
              }}
            />
          ))}
        </div>

        {compared.size === 2 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slideUp">
            <button
              type="button"
              onClick={() => setShowCompare(true)}
              className="bg-[#1F4D3A] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2 mx-auto"
            >
              <BarChart3 size={16} /> Compare {compared.size} Universities
            </button>
          </div>
        )}

        {showCompare && compared.size === 2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className={`${card} border rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-fadeIn`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`type-heading ${text}`}>University Comparison</h2>
                  <button type="button" onClick={() => setShowCompare(false)} className={sub}><X size={20} /></button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className={`px-3 py-2 text-left ${sub} font-medium border-b ${dark ? 'border-[#14143A]' : 'border-[#D0D0E8]'}`}>Metric</th>
                        {[...compared].map(id => {
                          const uni = universities.find(uu => uu.id === id)!;
                          return (
                            <th key={id} className={`px-3 py-2 text-left ${text} font-medium border-b ${dark ? 'border-[#14143A]' : 'border-[#D0D0E8]'}`}>
                              {uni.name}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'QS Rank', getValue: (u: (typeof universities)[0]) => u.qsRankLabel },
                        { label: 'Location', getValue: (u: (typeof universities)[0]) => `${u.city}, ${u.country}` },
                        { label: 'Tuition (Local)', getValue: (u: (typeof universities)[0]) => u.tuitionLocal },
                        { label: 'Tuition (Intl)', getValue: (u: (typeof universities)[0]) => u.tuitionIntl },
                        { label: 'Employability', getValue: (u: (typeof universities)[0]) => `${u.employability}%` },
                        { label: 'Students', getValue: (u: (typeof universities)[0]) => u.students?.toLocaleString() || 'N/A' },
                        { label: 'Known For', getValue: (u: (typeof universities)[0]) => u.knownFor.join(', ') },
                        { label: 'Scholarships', getValue: (u: (typeof universities)[0]) => u.scholarships.join(', ') },
                      ].map(row => (
                        <tr key={row.label}>
                          <td className={`px-3 py-2 ${sub} font-medium border-b ${dark ? 'border-[#14143A]/50' : 'border-[#D0D0E8]/50'}`}>{row.label}</td>
                          {[...compared].map(id => {
                            const uni = universities.find(uu => uu.id === id)!;
                            return (
                              <td key={id} className={`px-3 py-2 ${text} border-b ${dark ? 'border-[#14143A]/50' : 'border-[#D0D0E8]/50'}`}>
                                {row.getValue(uni)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1">
                      <label className={`text-xs ${sub} block mb-1`}>Field of Study</label>
                      <select
                        value={selectedField}
                        onChange={e => setSelectedField(e.target.value)}
                        className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none`}
                      >
                        {studyFields.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={getAiAnalysis}
                      disabled={aiLoading}
                      className="bg-[#1F4D3A] text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 mt-5 disabled:opacity-50"
                    >
                      {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      {aiLoading ? 'Analyzing...' : 'Get AI Analysis'}
                    </button>
                  </div>
                  {aiError && (
                    <div className={`rounded-xl p-3 text-sm mb-3 ${dark ? 'bg-[#1A0505] text-red-400 border border-red-900/30' : 'bg-[#FFF2F2] text-red-600 border border-red-200'}`}>
                      {aiError}
                      {aiError !== AI_UNAVAILABLE_MSG && (
                        <> <button type="button" onClick={getAiAnalysis} className="underline">Try again</button></>
                      )}
                    </div>
                  )}
                  {aiAnalysis && (
                    <div className={`${inset} border rounded-xl p-4 text-sm ${text} whitespace-pre-wrap animate-fadeIn`}>
                      {aiAnalysis}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
