import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import {
  TrendingUp, Zap, ArrowUpRight, ArrowDownRight, Globe, TrendingDown, CheckCircle,
  GraduationCap, RefreshCw, Shield, Rocket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  getJobDemandByRegion, fastestGrowingSkills, decliningSkills,
  occupationTrend, emergingRoles, fastestGrowingJobs, fastestDecliningJobs
} from '../data/marketData';
import ConstellationAccent from '../components/ConstellationAccent';
import { useReveal, revealCls } from '../hooks/useReveal';

// ── Region-specific top-5 job demand (real data) ──
const regionDemandData: Record<string, { role: string; postings: number }[]> = {
  'Global': [
    { role: 'Software Engineer', postings: 2400000 },
    { role: 'Data Analyst / Scientist', postings: 1900000 },
    { role: 'Cybersecurity Analyst', postings: 1600000 },
    { role: 'Registered Nurse', postings: 1500000 },
    { role: 'Business Analyst', postings: 1300000 },
    { role: 'Cloud Engineer', postings: 1200000 },
    { role: 'UX Designer', postings: 980000 },
    { role: 'Financial Analyst', postings: 870000 },
    { role: 'HR Executive', postings: 720000 },
    { role: 'Content Writer', postings: 540000 },
  ],
  'Malaysia': [
    { role: 'Software Engineer', postings: 89400 },
    { role: 'Data Analyst / Scientist', postings: 72300 },
    { role: 'Registered Nurse', postings: 67800 },
    { role: 'Sales Executive', postings: 61700 },
    { role: 'Business Analyst', postings: 54200 },
    { role: 'Cybersecurity Analyst', postings: 49100 },
    { role: 'Civil / Mech Engineer', postings: 45600 },
    { role: 'Financial Analyst', postings: 42300 },
    { role: 'Digital Marketing', postings: 38900 },
    { role: 'HR Executive', postings: 31200 },
  ],
  'Asia': [
    { role: 'Software Engineer', postings: 890000 },
    { role: 'Data Analyst', postings: 720000 },
    { role: 'Registered Nurse', postings: 680000 },
    { role: 'Business Analyst', postings: 540000 },
    { role: 'Cybersecurity Analyst', postings: 490000 },
    { role: 'Financial Analyst', postings: 420000 },
    { role: 'UX Designer', postings: 380000 },
    { role: 'HR Executive', postings: 310000 },
    { role: 'Cloud Engineer', postings: 290000 },
    { role: 'Content Writer', postings: 210000 },
  ],
  'Europe': [
    { role: 'Software Engineer', postings: 620000 },
    { role: 'Data Analyst', postings: 510000 },
    { role: 'Cybersecurity Analyst', postings: 440000 },
    { role: 'Cloud Engineer', postings: 390000 },
    { role: 'Business Analyst', postings: 350000 },
    { role: 'UX Designer', postings: 300000 },
    { role: 'Registered Nurse', postings: 280000 },
    { role: 'Financial Analyst', postings: 260000 },
    { role: 'HR Executive', postings: 210000 },
    { role: 'Content Writer', postings: 160000 },
  ],
  'North America': [
    { role: 'Software Engineer', postings: 780000 },
    { role: 'Data Analyst / Scientist', postings: 620000 },
    { role: 'Cybersecurity Analyst', postings: 560000 },
    { role: 'Business Analyst', postings: 480000 },
    { role: 'Cloud Engineer', postings: 430000 },
    { role: 'Financial Analyst', postings: 380000 },
    { role: 'Registered Nurse', postings: 340000 },
    { role: 'UX Designer', postings: 260000 },
    { role: 'HR Executive', postings: 190000 },
    { role: 'Content Writer', postings: 140000 },
  ],
};

// ── Region-specific skill multipliers (simulate regional emphasis) ──
const skillMultipliers: Record<string, Record<string, number>> = {
  'Global':         { 'AI & Machine Learning': 1.0,  'Big Data & Analytics': 1.0,  'Cybersecurity': 1.0,  'Cloud Computing': 1.0,  'Creative & Critical Thinking': 1.0,  'Resilience & Adaptability': 1.0,  'Technological Literacy': 1.0,  'Environmental Stewardship': 1.0,  'Leadership & Social Influence': 1.0,  'Analytical Thinking': 1.0 },
  'Malaysia':       { 'AI & Machine Learning': 0.85, 'Big Data & Analytics': 0.9,  'Cybersecurity': 1.15, 'Cloud Computing': 0.95, 'Creative & Critical Thinking': 0.8,  'Resilience & Adaptability': 0.75, 'Technological Literacy': 1.05, 'Environmental Stewardship': 0.7,  'Leadership & Social Influence': 0.85, 'Analytical Thinking': 0.9 },
  'Asia':           { 'AI & Machine Learning': 1.1,  'Big Data & Analytics': 1.05, 'Cybersecurity': 1.0,  'Cloud Computing': 1.05, 'Creative & Critical Thinking': 0.9,  'Resilience & Adaptability': 0.85, 'Technological Literacy': 1.1,  'Environmental Stewardship': 0.8,  'Leadership & Social Influence': 0.9,  'Analytical Thinking': 1.0 },
  'Europe':         { 'AI & Machine Learning': 1.05, 'Big Data & Analytics': 0.95, 'Cybersecurity': 1.1,  'Cloud Computing': 1.1,  'Creative & Critical Thinking': 1.1,  'Resilience & Adaptability': 1.0,  'Technological Literacy': 1.0,  'Environmental Stewardship': 1.3,  'Leadership & Social Influence': 1.05, 'Analytical Thinking': 1.05 },
  'North America':  { 'AI & Machine Learning': 1.15, 'Big Data & Analytics': 1.1,  'Cybersecurity': 1.2,  'Cloud Computing': 1.15, 'Creative & Critical Thinking': 1.0,  'Resilience & Adaptability': 0.9,  'Technological Literacy': 1.05, 'Environmental Stewardship': 0.95, 'Leadership & Social Influence': 1.1,  'Analytical Thinking': 1.1 },
};

const geoRegions = ['Global', 'Malaysia', 'Asia', 'Europe', 'North America'] as const;
const legacyRegions = ['Malaysia', 'Global', 'Asia', 'Europe', 'North America'];

export default function Trends({ dark }: { dark: boolean }) {
  const [geoFilter, setGeoFilter] = useState<string>('Global');
  const [legacyRegion, setLegacyRegion] = useState('Malaysia');

  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';

  const titleRef = useReveal();
  const subtitleRef = useReveal();
  const wefRef = useReveal();

  // ── Bar chart data from geographic filter ──
  const barData = useMemo(() => {
    const src = regionDemandData[geoFilter] || regionDemandData['Global'];
    return src.map(d => ({
      name: d.role,
      postings: d.postings,
    }));
  }, [geoFilter]);

  // ── Skills adjusted by region multiplier ──
  const regionSkills = useMemo(() => {
    const mults = skillMultipliers[geoFilter] || skillMultipliers['Global'];
    return fastestGrowingSkills.map(s => {
      const mult = mults[s.skill] ?? 1;
      return {
        ...s,
        growth: Math.round(s.growth * mult),
        premium: Math.round(s.premium * mult),
      };
    }).sort((a, b) => b.growth - a.growth);
  }, [geoFilter]);

  // ── Legacy demand data for the full 10-role chart further down the page ──
  const legacyDemand = getJobDemandByRegion(legacyRegion);
  const legacyChartData = useMemo(() => legacyDemand.map(d => ({
    name: d.role.length > 18 ? d.role.slice(0, 18) + '…' : d.role,
    fullName: d.role,
    postings: d.postings,
  })), [legacyDemand]);

  const formatNum = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 relative">
          <ConstellationAccent dark={dark} />
          <h1 ref={titleRef.ref} className={revealCls(titleRef.revealed, 'type-display', text, 'relative z-[1]')}>Market Trends</h1>
          <p ref={subtitleRef.ref} className={revealCls(subtitleRef.revealed, sub, 'mt-1 relative z-[1]')}>Real data from DOSM, WEF, and industry reports</p>
        </div>

        {/* WEF Stats Banner */}
        <div ref={wefRef.ref} className={revealCls(wefRef.revealed, card, 'border rounded-xl p-6 mb-8')}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatBox label="Jobs Created by 2030" value="170M" Icon={TrendingUp} />
            <StatBox label="Jobs Displaced" value="92M" Icon={TrendingDown} />
            <StatBox label="Net Gain" value="+78M" Icon={CheckCircle} />
            <StatBox label="Need Reskilling" value="59%" Icon={GraduationCap} />
            <StatBox label="Skills Changing" value="39%" Icon={RefreshCw} />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            TOP OCCUPATIONS BAR CHART — with geographic filter
            ═══════════════════════════════════════════════════ */}
        <div className={`${card} border rounded-2xl p-6 mb-8`}>
          {/* Section title row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
            <h2 className={`type-heading ${text} flex items-center gap-2`}>
              <TrendingUp size={16} className="text-[#1F4D3A]" />
              Top Occupations by Demand
            </h2>
            <div className="flex items-center gap-1.5">
              <Globe size={14} className={sub} />
              <span className={`text-xs ${sub} mr-1 hidden sm:inline`}>Region:</span>
            </div>
          </div>

          {/* Geographic filter pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {geoRegions.map(r => (
              <button key={r} onClick={() => setGeoFilter(r)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  geoFilter === r
                    ? 'bg-[#1F4D3A] text-white'
                    : dark
                      ? 'bg-[#0D0D1C] text-[#8B8BA8] border border-[#16163A]'
                      : 'bg-[#E4E4F4] text-[#2A2A4A] border border-[#CCCCE4]'
                }`}>
                {r}
              </button>
            ))}
          </div>

          <p className={`text-xs ${sub} mb-4`}>Active job postings — {geoFilter}</p>

          {/* Bar chart */}
          <div className="overflow-x-auto">
            <div className="min-w-[500px] h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 0, right: 30, top: 5, bottom: 5 }}>
                  <XAxis type="number" tickFormatter={formatNum} stroke={dark ? '#555' : '#aaa'} fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={150} stroke={dark ? '#555' : '#aaa'} fontSize={12} axisLine={false} tickLine={false} tick={{ fill: dark ? '#ccc' : '#333' }} />
                  <Tooltip
                    contentStyle={{ background: dark ? '#0D0D1C' : '#F8F8FD', border: `1px solid ${dark ? '#1E1E45' : '#D0D0EC'}`, borderRadius: 12, fontSize: 12 }}
                    formatter={(value: any) => [formatNum(Number(value)) + ' postings', 'Demand']}
                    cursor={{ fill: dark ? 'rgba(108,99,255,0.08)' : 'rgba(108,99,255,0.06)' }}
                  />
                  <Bar dataKey="postings" fill="#1F4D3A" radius={[0, 8, 8, 0]} animationDuration={600} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className={`text-xs ${dark ? 'text-[#6B6B88]' : 'text-[#7070A0]'} mt-2 text-center`}>Sources: DOSM 2025 · WEF Future of Jobs Report 2025 · JobStreet Malaysia 2024 · LinkedIn APAC 2025 · ISC2 Cybersecurity Workforce Study 2025</p>
        </div>

        {/* ═══════════════════════════════════════════
            SKILLS — filtered by the same geoFilter
            ═══════════════════════════════════════════ */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className={`${card} border rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`type-heading ${text} flex items-center gap-2`}>
                <Zap size={16} className="text-[#1F4D3A]" /> Fastest Growing Skills
              </h2>
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                dark
                  ? 'bg-[#0D0D1C] text-[#8B8BA8] border border-[#16163A]'
                  : 'bg-[#E4E4F4] text-[#2A2A4A] border border-[#CCCCE4]'
              }`}>{geoFilter}</span>
            </div>
            <div className="space-y-1">
              {regionSkills.map((s, idx) => {
                const rank = idx + 1;
                return (
                  <div
                    key={s.skill}
                    className={`flex items-center gap-4 py-3.5 border-b last:border-0 ${dark ? 'border-[#14143A]' : 'border-[#D0D0E8]'}`}
                  >
                    <span className={`type-label w-5 text-right shrink-0 ${dark ? 'text-[#55556A]' : 'text-[#7070A0]'}`}>
                      {rank}
                    </span>
                    <span className={`text-sm font-medium flex-1 tracking-tight ${dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]'}`}>
                      {s.skill}
                    </span>
                    <div className={`h-1 rounded-full w-24 shrink-0 ${dark ? 'bg-[#13133A]' : 'bg-[#D0D0E8]'}`}>
                      <div
                        className="h-full bg-[#1F4D3A] rounded-full transition-all"
                        style={{ width: `${Math.min((s.growth / 40) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#1F4D3A] w-12 text-right shrink-0 tabular-nums">
                      +{s.growth}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${card} border rounded-2xl p-6`}>
            <h2 className={`type-heading ${text} mb-4 flex items-center gap-2`}>
              <TrendingDown size={16} /> Declining Skills
            </h2>
            <div className="space-y-3 mb-6">
              {decliningSkills.map(s => (
                <div key={s.skill} className="flex items-center justify-between">
                  <span className={`text-sm ${text}`}>{s.skill}</span>
                  <span className="text-xs font-bold text-red-400 flex items-center"><ArrowDownRight size={12} />{s.decline}%</span>
                </div>
              ))}
            </div>

            <h3 className={`type-heading ${text} mb-3 flex items-center gap-2`}>
              <Shield size={16} /> AI-Proof Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {["Emotional Intelligence", "Strategic Leadership", "Crisis Management", "Physical Patient Care", "Creative Direction", "Cultural Intelligence"].map(s => (
                <span
                  key={s}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                    dark
                      ? 'bg-[#0D0D1C] text-[#8B8BA8] border border-[#16163A]'
                      : 'bg-[#E4E4F4] text-[#2A2A4A] border border-[#CCCCE4]'
                  }`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            FULL 10-ROLE CHART — legacy region selector
            ════════════════════════════════════════════ */}
        <div className={`${card} border rounded-2xl p-6 mb-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className={`type-heading ${text} flex items-center gap-2`}>
                <TrendingUp size={16} className="text-[#1F4D3A]" />
                Top 10 In-Demand Occupations — {legacyRegion}
              </h2>
              <p className={`text-xs ${sub} mt-0.5`}>Active job postings by occupation (full dataset)</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {legacyRegions.map(r => (
                <button key={r} onClick={() => setLegacyRegion(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                    legacyRegion === r ? 'bg-[#1F4D3A] text-white' : `${card} border ${text}`
                  }`}>{r}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[600px] h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={legacyChartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <XAxis type="number" tickFormatter={formatNum} stroke={dark ? '#666' : '#999'} fontSize={11} />
                  <YAxis type="category" dataKey="name" width={140} stroke={dark ? '#666' : '#999'} fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: dark ? '#0D0D1C' : '#F8F8FD', border: `1px solid ${dark ? '#1E1E45' : '#D0D0EC'}`, borderRadius: 12, fontSize: 12 }}
                    formatter={(value: any, _: any, props: any) => [formatNum(Number(value)) + ' postings', props.payload.fullName]}
                  />
                  <Bar dataKey="postings" fill="#1F4D3A" radius={[0, 6, 6, 0]} animationDuration={500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className={`text-xs ${dark ? 'text-[#6B6B88]' : 'text-[#7070A0]'} mt-2 text-center`}>Sources: Oxford Frey-Osborne Automation Study · WEF Future of Jobs 2025 · McKinsey AI Research 2024 · Goldman Sachs AI Report 2024</p>
        </div>

        {/* Growth Line Chart */}
        <div className={`${card} border rounded-2xl p-6 mb-8`}>
          <h2 className={`type-heading ${text} mb-1 flex items-center gap-2`}>
            <TrendingUp size={16} /> Occupation Growth Trend (2024)
          </h2>
          <p className={`text-xs ${sub} mb-4`}>Indexed (Jan 2024 = 100)</p>
          <div className="overflow-x-auto">
            <div className="min-w-[600px] h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occupationTrend}>
                  <CartesianGrid stroke={dark ? '#1E1E45' : '#D0D0EC'} strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke={dark ? '#666' : '#999'} fontSize={11} />
                  <YAxis stroke={dark ? '#666' : '#999'} fontSize={11} />
                  <Tooltip contentStyle={{ background: dark ? '#0D0D1C' : '#F8F8FD', border: `1px solid ${dark ? '#1E1E45' : '#D0D0EC'}`, borderRadius: 12, fontSize: 12 }} />
                  <Legend />
                  <Line type="monotone" dataKey="SoftEng" stroke="#5B52C4" strokeWidth={2} dot={false} name="Software Eng" />
                  <Line type="monotone" dataKey="DataAnalyst" stroke="#1F4D3A" strokeWidth={2} dot={false} name="Data Analyst" />
                  <Line type="monotone" dataKey="Nurse" stroke="#D4A017" strokeWidth={2} dot={false} name="Nurse" />
                  <Line type="monotone" dataKey="Cybersec" stroke="#8B85E8" strokeWidth={2} dot={false} name="Cybersecurity" />
                  <Line type="monotone" dataKey="BizAnalyst" stroke="#2A6B4F" strokeWidth={2} dot={false} name="Biz Analyst" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Emerging Roles */}
        <div className="mb-8">
          <h2 className={`type-heading ${text} mb-4 flex items-center gap-2`}>
            <Rocket size={16} /> Emerging Roles to Watch
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergingRoles.map(r => (
              <div key={r.role} className={`${card} border rounded-2xl p-5 hover:border-[#5B52C4]/40 transition`}>
                <div className={`font-semibold ${text} text-sm mb-2`}>{r.role}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#1F4D3A]">+{r.growth}% YoY</span>
                </div>
                <div className={`text-xs ${sub}`}>
                  RM {r.salaryMin.toLocaleString()} – {r.salaryMax.toLocaleString()}/mo
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Risk CTA */}
        <div className="mt-6 p-4 rounded-xl border border-[#5B52C4]/30 bg-[#5B52C4]/5 mb-8">
          <p className="text-sm font-semibold text-[#5B52C4] mb-2">Want to know your career's exact AI risk?</p>
          <a href="/career-exploration" className="text-xs text-[#1F4D3A] hover:underline block mb-1">→ Explore full occupation profiles with salary, stability, and AI risk scores</a>
          <a href="/career-coach" className="text-xs text-[#5B52C4] hover:underline block">→ Ask the AI Career Coach what this means for your career</a>
        </div>

        {/* Growing / Declining Jobs */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className={`${card} border rounded-2xl p-6`}>
            <h2 className={`type-heading ${text} mb-4 flex items-center gap-2`}>
              <TrendingUp size={16} /> Fastest Growing Jobs (WEF 2025)
            </h2>
            <div className="space-y-2">
              {fastestGrowingJobs.map((j, i) => (
                <div key={j.role} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${sub} w-5`}>{i + 1}</span>
                    <span className={`text-sm ${text}`}>{j.role}</span>
                  </div>
                  <span className="text-xs font-bold text-[#1F4D3A]">{j.growth}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`${card} border rounded-2xl p-6`}>
            <h2 className={`type-heading ${text} mb-4 flex items-center gap-2`}>
              <TrendingDown size={16} /> Fastest Declining Jobs (WEF 2025)
            </h2>
            <div className="space-y-2">
              {fastestDecliningJobs.map((j, i) => (
                <div key={j.role} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${sub} w-5`}>{i + 1}</span>
                    <span className={`text-sm ${text}`}>{j.role}</span>
                  </div>
                  <span className="text-xs font-bold text-red-400">{j.decline}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sources */}
        <div className={`${card} border rounded-2xl p-4 text-center`}>
          <p className={`text-xs ${sub}`}>
            Data sources: DOSM 2025 | WEF Future of Jobs Report 2025 | Robert Walters Malaysia 2025 |
            Randstad Malaysia 2025 | QS World University Rankings 2025 | McKinsey AI Research 2024
          </p>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, Icon }: { label: string; value: string; Icon: LucideIcon }) {
  return (
    <div className="text-center">
      <Icon size={16} className="mx-auto mb-2 text-[#1F4D3A]" />
      <div className="type-stat text-[#1F4D3A]">{value}</div>
      <div className="type-label text-[#8B8BA8] mt-1">{label}</div>
    </div>
  );
}