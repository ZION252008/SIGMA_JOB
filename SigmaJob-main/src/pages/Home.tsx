import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  BarChart3,
  GitBranch,
  Briefcase,
  TrendingUp,
  GraduationCap,
  FileText,
  Compass,
  Bot,
  ArrowUpRight,
} from 'lucide-react';
import ConstellationAccent from '../components/ConstellationAccent';
import { pageTheme } from '../theme/galaxy';
import { seedJobs, jobDemandMalaysia, emergingRoles } from '../data/marketData';
import { useReveal, revealCls } from '../hooks/useReveal';
import { useTilt } from '../hooks/useTilt';
import { useCounter } from '../hooks/useCounter';

const tools = [
  { label: 'Career Explorer', desc: 'Browse careers with real salary, demand and AI risk data.', to: '/career-exploration', Icon: BarChart3 },
  { label: 'Skill Tree', desc: 'Track your progression from beginner to expert.', to: '/skill-tree', Icon: GitBranch },
  { label: 'Job Listings', desc: 'Real positions from Grab, Petronas, Maybank and more.', to: '/jobs', Icon: Briefcase },
  { label: 'Market Trends', desc: 'What employers want, which fields are growing.', to: '/trends', Icon: TrendingUp },
  { label: 'University Pathways', desc: 'QS-ranked institutions with tuition and scholarship data.', to: '/universities', Icon: GraduationCap },
  { label: 'Resume Analyzer', desc: 'Get your resume reviewed against real job requirements.', to: '/resume-analyzer', Icon: FileText },
  { label: 'Career Coach', desc: 'Ask questions about careers, salaries and strategy.', to: '/career-coach', Icon: Compass },
  { label: 'AI Impact Analysis', desc: 'Which jobs are safe from automation, and which are not.', to: '/ai-trends', Icon: Bot },
];

const topDemand = jobDemandMalaysia.slice(0, 5).map(d => ({
  name: d.role.length > 16 ? d.role.slice(0, 16) + '…' : d.role,
  postings: d.postings,
}));

function FeatureTile({ tile, i, dark }: { tile: typeof tools[number]; i: number; dark: boolean }) {
  const { ref: revealRef, revealed } = useReveal();
  const { ref: tiltRef, ...tiltHandlers } = useTilt(4);

  return (
    <div ref={revealRef} className={revealCls(revealed, `delay-${(i % 4) + 1}`)}>
      <Link to={tile.to}>
        <div
          ref={tiltRef}
          {...tiltHandlers}
          className={`tilt-card p-5 rounded-xl border cursor-pointer
            group transition-colors duration-200
            ${dark
              ? 'bg-[#09091A] border-[#13133A] hover:border-[#5B52C4]/40 galaxy-card-dark'
              : 'bg-[#F8F8FD] border-[#D0D0E8] hover:border-[#5B52C4]/30 galaxy-card-light'
            }`}
        >
          <div className="flex justify-between items-start mb-8">
            <tile.Icon size={16} className="text-[#1F4D3A]" />
            <ArrowUpRight
              size={12}
              className="text-[#55556A] opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <p
            className={`font-semibold text-sm mb-1 tracking-tight
              group-hover:text-[#1F4D3A] transition-colors
              ${dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]'}`}
          >
            {tile.label}
          </p>
          <p className={`text-xs leading-relaxed ${dark ? 'text-[#6B6B88]' : 'text-[#4A4A6A]'}`}>
            {tile.desc}
          </p>
        </div>
      </Link>
    </div>
  );
}

function StatCard({
  dark,
  delay,
  label,
  title,
  counter,
  className,
}: {
  dark: boolean;
  delay: 1 | 2 | 3 | 4;
  label: string;
  title: string;
  counter: ReturnType<typeof useCounter>;
  className?: string;
}) {
  const { ref: revealRef, revealed } = useReveal();

  return (
    <div
      ref={revealRef}
      className={revealCls(
        revealed,
        `delay-${delay}`,
        className ?? '',
        dark
          ? 'bg-[#09091A] border border-[#13133A] rounded-xl p-4 galaxy-card-dark'
          : 'bg-[#F8F8FD] border border-[#D0D0E8] rounded-xl p-4 galaxy-card-light'
      )}
    >
      <div className={`type-label ${dark ? 'text-[#7070A0]' : 'text-[#7070A0]'} mb-1`}>{label}</div>
      <div className={`type-stat ${dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]'}`}>
        <span ref={counter.ref as React.RefObject<HTMLSpanElement>}>{counter.n.toLocaleString()}</span>
      </div>
      <div className={`text-xs mt-2 ${dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]'}`}>{title}</div>
    </div>
  );
}

export default function Home({ dark }: { dark: boolean }) {
  const t = pageTheme(dark);
  const { bg, card, text, sub, sectionBg } = t;

  const heroLabelRef = useReveal();
  const heroTitleRef = useReveal();
  const heroCopyRef = useReveal();
  const heroCtasRef = useReveal();

  const toolsTitleRef = useReveal();
  const toolsSubRef = useReveal();

  const snapshotTitleRef = useReveal();
  const snapshotSubRef = useReveal();

  const openingsTitleRef = useReveal();
  const openingsSubRef = useReveal();

  const startTitleRef = useReveal();

  const c1 = useCounter(89_400);
  const c2 = useCounter(72_300);
  const c3 = useCounter(67_800);
  const c4 = useCounter(61_700);
  const c5 = useCounter(54_200);

  return (
    <div className={`${bg} min-h-screen pt-14 relative z-[1]`}>

      <section className="relative min-h-screen overflow-hidden">
        <ConstellationAccent dark={dark} />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: dark
              ? 'radial-gradient(ellipse at center, rgba(42,31,110,0.18) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(91,82,196,0.07) 0%, transparent 70%)',
            filter: dark ? 'blur(60px)' : 'blur(80px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute pointer-events-none select-none"
          style={{
            fontSize: 'min(280px, 40vw)',
            lineHeight: 1,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -55%)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(91, 82, 196, 0.20)',
            zIndex: 0,
          }}
        >
          Σ
        </div>
        <div className="relative z-[1] max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 min-h-[calc(100vh-56px)] flex items-center">
          <div className="grid md:grid-cols-2 gap-10 items-center w-full">
            <div>
              <div
                ref={heroLabelRef.ref}
                className={revealCls(heroLabelRef.revealed, 'type-label', dark ? 'text-[#7070A0]' : 'text-[#7070A0]', 'mb-4')}
              >
                MALAYSIA · CAREER INTELLIGENCE
              </div>
              <h1 ref={heroTitleRef.ref} className={revealCls(heroTitleRef.revealed, 'type-display', text, 'mb-4')}>
                Plan your education and career<br />using real job market data.
              </h1>
              <p ref={heroCopyRef.ref} className={revealCls(heroCopyRef.revealed, 'text-base', sub, 'max-w-xl mb-8 leading-relaxed')}>
                Explore careers. Compare university pathways. Build skills. Track demand. Get guidance.
              </p>
              <div ref={heroCtasRef.ref} className={revealCls(heroCtasRef.revealed, 'flex flex-wrap gap-3')}>
                <Link
                  to="/career-exploration"
                  className="btn-primary px-6 py-2.5 rounded-lg font-medium text-sm hover:opacity-90 transition"
                >
                  Explore Careers
                </Link>
                <Link
                  to="/skill-tree"
                  className={`${card} border px-6 py-2.5 rounded-lg font-medium text-sm ${text} hover:border-[#5B52C4] transition`}
                >
                  Open Skill Tree
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard dark={dark} delay={1} label="Postings" title="Software Engineer" counter={c1} />
              <StatCard dark={dark} delay={2} label="Postings" title="Data Analyst / Scientist" counter={c2} />
              <StatCard dark={dark} delay={3} label="Postings" title="Registered Nurse" counter={c3} />
              <StatCard dark={dark} delay={4} label="Postings" title="Sales Executive" counter={c4} />
              <StatCard
                dark={dark}
                delay={1}
                label="Postings"
                title="Business Analyst"
                counter={c5}
                className="col-span-2"
              />
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2]">
          <div
            className={`w-5 h-10 rounded-full border flex items-start justify-center p-1 ${dark ? 'border-[#16163A]' : 'border-[#D0D0E8]'}`}
          >
            <div className="w-1 h-4 rounded-full bg-[#5B52C4] animate-[scrollPulse_1.4s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      <section className={`${sectionBg} border-y relative z-[1]`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <h2 ref={toolsTitleRef.ref} className={revealCls(toolsTitleRef.revealed, 'type-heading', text, 'mb-1')}>Career Tools</h2>
          <p ref={toolsSubRef.ref} className={revealCls(toolsSubRef.revealed, 'text-sm', sub, 'mb-6')}>Everything you need to make informed decisions.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {tools.map((tool, i) => (
              <FeatureTile key={tool.to} tile={tool} i={i} dark={dark} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-[1]">
        <h2 ref={snapshotTitleRef.ref} className={revealCls(snapshotTitleRef.revealed, 'type-heading', text, 'mb-1')}>Labour Market Snapshot</h2>
        <p ref={snapshotSubRef.ref} className={revealCls(snapshotSubRef.revealed, 'text-sm', sub, 'mb-6')}>Malaysia, 2025. Source: DOSM, WEF Future of Jobs Report.</p>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className={`${dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light'} border rounded-xl p-5`}>
            <div className={`type-label ${sub} mb-3`}>Key Figures</div>
            <div className="space-y-3">
              {[
                { label: 'National median salary', value: 'RM 3,167/mo (DOSM Q4 2025)' },
                { label: 'National mean salary', value: 'RM 3,652/mo' },
                { label: 'Minimum wage (2025)', value: 'RM 1,700/mo' },
                { label: 'Total labour demand', value: '9.21 million' },
                { label: 'New jobs created (Q4)', value: '32,100' },
                { label: 'Salary increment forecast', value: '5.0%' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className={`text-sm ${sub}`}>{s.label}</span>
                  <span className={`text-sm font-semibold ${text}`}>{s.value}</span>
                </div>
              ))}
            </div>
            <div className={`text-xs ${sub} mt-3`}>Source: DOSM Salaries & Wages Survey 2024</div>
          </div>

          <div className={`${dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light'} border rounded-xl p-5`}>
            <div className={`type-label ${sub} mb-3`}>Highest Demand Roles — Malaysia</div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topDemand} layout="vertical" margin={{ left: 0, right: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={120} fontSize={11} stroke={dark ? '#55556A' : '#999'} axisLine={false} tickLine={false} tick={{ fill: dark ? '#8B8BA8' : '#333' }} />
                  <Tooltip contentStyle={{ background: dark ? '#0D0D1C' : '#F8F8FD', border: `1px solid ${dark ? '#1E1E45' : '#D0D0E8'}`, borderRadius: 8, fontSize: 12 }} formatter={(v: number | string) => [`${Number(v).toLocaleString()} postings`, 'Demand']} />
                  <Bar dataKey="postings" fill="#1F4D3A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <Link to="/trends" className="text-xs text-[#1F4D3A] hover:underline mt-2 inline-block">View full trends →</Link>
          </div>

          <div className={`${dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light'} border rounded-xl p-5`}>
            <div className={`type-label ${sub} mb-3`}>Emerging Roles</div>
            <div className="space-y-2.5">
              {emergingRoles.slice(0, 6).map(r => (
                <div key={r.role} className="flex items-center justify-between">
                  <span className={`text-sm ${text}`}>{r.role}</span>
                  <span className={`text-xs font-semibold ${dark ? 'text-emerald-400' : 'text-[#1F4D3A]'}`}>+{r.growth}%</span>
                </div>
              ))}
            </div>
            <div className={`text-xs ${sub} mt-3`}>YoY growth. Source: WEF 2025, LinkedIn.</div>
          </div>
        </div>
        <p className={`text-xs ${dark ? 'text-[#6B6B88]' : 'text-[#7070A0]'} mt-3 text-center`}>Sources: DOSM Employee Wages Statistics Q4 2025 · WEF Future of Jobs 2025 · Robert Walters Malaysia Salary Survey 2025</p>
      </section>

      <section className={`${sectionBg} border-y relative z-[1]`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 ref={openingsTitleRef.ref} className={revealCls(openingsTitleRef.revealed, 'type-heading', text)}>Latest Openings</h2>
              <p ref={openingsSubRef.ref} className={revealCls(openingsSubRef.revealed, 'text-sm', sub)}>From top Malaysian employers</p>
            </div>
            <Link to="/jobs" className="text-sm text-[#1F4D3A] font-medium hover:underline">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {seedJobs.slice(0, 4).map(j => (
              <Link key={j.id} to="/jobs" className={`${card} border rounded-xl p-4 hover:border-[#5B52C4] transition`}>
                <div className={`text-sm font-semibold ${text} mb-1`}>{j.title}</div>
                <div className={`text-xs ${sub}`}>{j.company} · {j.location}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-[#1F4D3A]">RM {j.salaryMin.toLocaleString()}–{j.salaryMax.toLocaleString()}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${dark ? 'bg-[#2A1F6E]/40' : 'bg-[#E8E8F5]'} ${sub}`}>{j.workMode}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-[1]">
        <h2 ref={startTitleRef.ref} className={revealCls(startTitleRef.revealed, 'type-heading', text, 'mb-6')}>Where do you want to start?</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/career-exploration" className={`${card} border rounded-xl p-6 hover:border-[#5B52C4] transition`}>
            <div className={`text-sm font-semibold ${text} mb-1`}>I want to explore careers</div>
            <div className={`text-xs ${sub}`}>Compare occupations by salary, demand, AI risk, and work-life balance.</div>
          </Link>
          <Link to="/universities" className={`${card} border rounded-xl p-6 hover:border-[#5B52C4] transition`}>
            <div className={`text-sm font-semibold ${text} mb-1`}>I want to choose a university</div>
            <div className={`text-xs ${sub}`}>Browse QS-ranked institutions with tuition, scholarships, and outcomes.</div>
          </Link>
          <Link to="/skill-tree" className={`${card} border rounded-xl p-6 hover:border-[#5B52C4] transition`}>
            <div className={`text-sm font-semibold ${text} mb-1`}>I want to build skills</div>
            <div className={`text-xs ${sub}`}>Track your progression from foundation to senior level.</div>
          </Link>
        </div>
      </section>

      <footer className={`${card} border-t py-8 relative z-[1]`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className={`text-sm font-semibold ${text}`}>Σ SigmaJob</div>
          <div className={`text-xs ${sub} text-center sm:text-right`}>
            Data: DOSM 2025 · WEF Future of Jobs 2025 · Robert Walters 2025 · QS Rankings 2025
          </div>
        </div>
      </footer>
    </div>
  );
}
