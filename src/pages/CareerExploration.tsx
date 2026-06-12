import { useState } from 'react';
import { ChevronRight, Trophy, ClipboardList, GitBranch, Medal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { careerRanking, occupationProfiles } from '../data/marketData';
import { useReveal, revealCls } from '../hooks/useReveal';
import { useTilt } from '../hooks/useTilt';

const pillSecondary = (dark: boolean) =>
  dark
    ? 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#0D0D1C] text-[#8B8BA8] border border-[#16163A]'
    : 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#E4E4F4] text-[#2A2A4A] border border-[#CCCCE4]';

const pillPrimary = 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#1F4D3A] text-white';

const pillDanger = (dark: boolean) =>
  dark
    ? 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#1A0505] text-red-400 border border-red-900/30'
    : 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#FFF2F2] text-red-600 border border-red-200';

function OccupationProfileCard({
  profile,
  dark,
}: {
  profile: (typeof occupationProfiles)[number];
  dark: boolean;
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
        className={`tilt-card ${card} border rounded-xl p-6`}
      >
        <h2 className={`type-heading ${text} mb-2`}>{profile.title}</h2>
        <p className={`text-sm ${sub} mb-6`}>{profile.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard label="Fresh Grad Min" value={`RM ${profile.freshGradMin.toLocaleString()}`} dark={dark} />
          <MetricCard label="Average Salary" value={`RM ${profile.average.toLocaleString()}`} dark={dark} />
          <MetricCard label="Median Salary" value={`RM ${profile.median.toLocaleString()}`} dark={dark} />
          <MetricCard label="Senior Salary" value={`RM ${profile.senior.toLocaleString()}`} dark={dark} />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className={`${inset} border rounded-xl p-4`}>
            <div className={`text-xs ${sub} mb-1`}>Demand Level</div>
            <div className={`text-sm font-bold ${text}`}>{profile.demandLevel}</div>
            <div className={`text-xs ${sub}`}>{profile.demandPostings.toLocaleString()} postings</div>
          </div>
          <div className={`${inset} border rounded-xl p-4`}>
            <div className={`text-xs ${sub} mb-1`}>AI Disruption Risk</div>
            <div className={`text-sm font-bold ${text}`}>{profile.aiRisk}%</div>
            <div className={`h-1 rounded-full w-full mt-2 ${dark ? 'bg-[#13133A]' : 'bg-[#D0D0E8]'}`}>
              <div
                className="h-full bg-[#1F4D3A] rounded-full transition-all"
                style={{ width: `${profile.aiRisk}%` }}
              />
            </div>
          </div>
          <div className={`${inset} border rounded-xl p-4`}>
            <div className={`text-xs ${sub} mb-1`}>Work-Life Balance</div>
            <div className={`text-sm font-bold text-[#5B52C4]`}>{profile.wlb}/10</div>
            <div className={`text-xs ${sub}`}>{profile.workHours}h/week avg</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className={`${inset} border rounded-xl p-4`}>
            <div className={`text-xs ${sub} mb-1`}>Career Stability</div>
            <div className="text-sm font-bold text-[#1F4D3A]">{profile.stabilityScore}/10</div>
          </div>
          <div className={`${inset} border rounded-xl p-4`}>
            <div className={`text-xs ${sub} mb-1`}>Remote Work</div>
            <div className={`text-sm font-bold ${text}`}>{profile.remotePossibility}</div>
          </div>
        </div>

        <p className={`text-xs text-[#7070A0] mt-2`}>Source: Robert Walters Malaysia 2025 · DOSM Q4 2025 · PayScale MY</p>
        <div className="flex gap-2 mt-5 flex-wrap">
          <a href="/jobs" className={pillPrimary}>Find Jobs in This Role →</a>
          <a href="/career-coach" className={pillSecondary(dark)}>Ask AI Coach →</a>
          <a href="/skill-tree" className={pillSecondary(dark)}>View Skill Tree →</a>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, dark }: { label: string; value: string; dark: boolean }) {
  const inset = dark ? 'bg-[#060611] border-[#0F0F2E]' : 'bg-[#E8E8F5] border-[#CCCCE4]';
  return (
    <div className={`${inset} border rounded-xl p-4`}>
      <div className="text-xs text-[#7070A0]">{label}</div>
      <div className={`type-stat mt-0.5 ${dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]'}`}>{value}</div>
    </div>
  );
}

export default function CareerExploration({ dark }: { dark: boolean }) {
  const [tab, setTab] = useState<'ranking' | 'profiles' | 'progression'>('ranking');
  const [selectedProfile, setSelectedProfile] = useState(occupationProfiles[0].id);

  const titleRef = useReveal();
  const subtitleRef = useReveal();
  const rankingTitleRef = useReveal();

  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const inset = dark ? 'bg-[#060611] border-[#0F0F2E]' : 'bg-[#E8E8F5] border-[#CCCCE4]';

  const profile = occupationProfiles.find(p => p.id === selectedProfile)!;

  const tabs: { id: 'ranking' | 'profiles' | 'progression'; label: string; icon: LucideIcon }[] = [
    { id: 'ranking', label: 'Career Rankings', icon: Trophy },
    { id: 'profiles', label: 'Occupation Profiles', icon: ClipboardList },
    { id: 'progression', label: 'Career Progression', icon: GitBranch },
  ];

  const aiRiskPill = (risk: number) =>
    risk < 30 ? pillPrimary : risk < 50 ? 'px-2.5 py-1 rounded-md text-xs font-medium text-[#D4A017] border border-[#D4A017]/25' : pillDanger(dark);

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 ref={titleRef.ref} className={revealCls(titleRef.revealed, 'type-display', text, 'mb-2')}>Career Exploration</h1>
        <p ref={subtitleRef.ref} className={revealCls(subtitleRef.revealed, sub, 'mb-6')}>Data-driven career insights from WEF, DOSM, and industry reports</p>

        <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition flex items-center gap-2 ${
                tab === t.id ? 'bg-[#1F4D3A] text-white' : pillSecondary(dark)
              }`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'ranking' && (
          <div className="animate-fadeIn">
            <div ref={rankingTitleRef.ref} className={revealCls(rankingTitleRef.revealed, card, 'border rounded-xl overflow-hidden')}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={inset}>
                      <th className={`px-4 py-3 text-left ${sub} font-medium`}>Rank</th>
                      <th className={`px-4 py-3 text-left ${sub} font-medium`}>Career</th>
                      <th className={`px-4 py-3 text-center ${sub} font-medium`}>Overall</th>
                      <th className={`px-4 py-3 text-center ${sub} font-medium hidden md:table-cell`}>Demand</th>
                      <th className={`px-4 py-3 text-center ${sub} font-medium hidden md:table-cell`}>Growth</th>
                      <th className={`px-4 py-3 text-center ${sub} font-medium hidden lg:table-cell`}>Stability</th>
                      <th className={`px-4 py-3 text-center ${sub} font-medium`}>AI Risk</th>
                      <th className={`px-4 py-3 text-center ${sub} font-medium hidden lg:table-cell`}>WLB</th>
                    </tr>
                  </thead>
                  <tbody>
                    {careerRanking.map(c => (
                      <tr key={c.rank} className={`border-t ${dark ? 'border-[#14143A]' : 'border-[#D0D0E8]'} transition`}>
                        <td className={`px-4 py-3 ${text}`}>
                          {c.rank <= 3 ? (
                            <span className="inline-flex items-center gap-1">
                              <Medal size={16} className="text-[#1F4D3A]" />
                              {c.rank}
                            </span>
                          ) : `#${c.rank}`}
                        </td>
                        <td className={`px-4 py-3 font-medium ${text}`}>{c.career}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={pillPrimary}>{c.overall}</span>
                        </td>
                        <td className={`px-4 py-3 text-center hidden md:table-cell ${text}`}>{c.demand}</td>
                        <td className={`px-4 py-3 text-center hidden md:table-cell ${text}`}>{c.growth}</td>
                        <td className={`px-4 py-3 text-center hidden lg:table-cell ${text}`}>{c.stability}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={aiRiskPill(c.aiRisk)}>{c.aiRisk}%</span>
                        </td>
                        <td className={`px-4 py-3 text-center hidden lg:table-cell ${text}`}>{c.wlb}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`p-4 border-t ${dark ? 'border-[#14143A]' : 'border-[#D0D0E8]'}`}>
                <p className={`text-xs ${sub}`}>Source: Composite score from WEF 2025, DOSM, LinkedIn, Glassdoor, PayScale</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'profiles' && (
          <div className="animate-fadeIn">
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
              {occupationProfiles.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProfile(p.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition ${
                    selectedProfile === p.id ? 'bg-[#1F4D3A] text-white' : pillSecondary(dark)
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>

            <OccupationProfileCard profile={profile} dark={dark} />
          </div>
        )}

        {tab === 'progression' && (
          <div className="animate-fadeIn">
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
              {occupationProfiles.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProfile(p.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition ${
                    selectedProfile === p.id ? 'bg-[#1F4D3A] text-white' : pillSecondary(dark)
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>

            <div className={`${card} border rounded-xl p-6`}>
              <h2 className={`type-heading ${text} mb-6`}>{profile.title} — Career Progression</h2>

              <div className="overflow-x-auto pb-4">
                <div className="min-w-[700px]">
                  <div className="flex items-center gap-2">
                    {profile.progression.map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`${inset} border rounded-xl p-4 min-w-[140px] text-center`}>
                          <div className={`text-xs ${sub} mb-1`}>{step.level}</div>
                          <div className={`text-sm font-bold ${text}`}>{step.title}</div>
                          <div className="text-xs text-[#1F4D3A] mt-1">{step.salaryRange}</div>
                          <div className={`text-xs ${sub} mt-0.5`}>{step.years}</div>
                        </div>
                        {i < profile.progression.length - 1 && <ChevronRight size={20} className={sub} />}
                      </div>
                    ))}
                  </div>

                  {profile.branches && profile.branches.length > 0 && (
                    <div className="mt-6 ml-auto max-w-md">
                      <div className={`text-xs ${sub} mb-2`}>Senior Branches:</div>
                      <div className="space-y-2">
                        {profile.branches.map((b, i) => (
                          <div key={i} className={`flex items-center gap-3 ${inset} border rounded-xl p-3`}>
                            <div className="w-2 h-2 rounded-md bg-[#D4A017]" />
                            <div>
                              <span className={`text-sm font-medium ${text}`}>{b.path}</span>
                              <span className="text-xs text-[#1F4D3A] ml-2">{b.salary}/mo</span>
                            </div>
                          </div>
                        ))}
                      </div>
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
