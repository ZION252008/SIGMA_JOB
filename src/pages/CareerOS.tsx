import { useMemo, useState } from 'react';
import {
  Globe,
  Briefcase,
  GitBranch,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import {
  careerOSSectors,
  COUNTRY_LABELS,
  datasetCaveats,
  excludeFromSalaryRank,
  getEmployerSalaries,
  getProgressionForRole,
  getSector,
  isSalaryParity,
  type CountryCode,
  type EmployerType,
  type RoleMarketRow,
  type SectorSlug,
} from '../data/careeros';
import { useReveal, revealCls } from '../hooks/useReveal';

const SECTOR_ICONS: Record<SectorSlug, string> = {
  eng_tech: '⚙️',
  biz_finance: '💼',
  healthcare: '🏥',
  edu_social: '📚',
  creative_design: '🎨',
  science_tech: '🔬',
};

function MetricPill({ label, value, dark }: { label: string; value: string; dark: boolean }) {
  const inset = dark ? 'bg-[#060611] border-[#0F0F2E]' : 'bg-[#E8E8F5] border-[#CCCCE4]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  return (
    <div className={`${inset} border rounded-xl p-3`}>
      <div className={`text-xs ${sub}`}>{label}</div>
      <div className={`text-sm font-semibold ${text} mt-0.5`}>{value}</div>
    </div>
  );
}

function RoleDetailPanel({
  role,
  sectorSlug,
  country,
  employer,
  dark,
  card,
  text,
  sub,
  inset,
}: {
  role: RoleMarketRow;
  sectorSlug: SectorSlug;
  country: CountryCode;
  employer: EmployerType;
  dark: boolean;
  card: string;
  text: string;
  sub: string;
  inset: string;
}) {
  const sector = getSector(sectorSlug)!;
  const countryData = sector.countries[country]!;
  const salaries = getEmployerSalaries(role, employer, countryData);
  const progression = getProgressionForRole(sector, role.jobTitle);
  const parity = isSalaryParity(role);

  return (
    <div className={`${card} border rounded-xl p-6 mt-4 animate-fadeIn`}>
      <h3 className={`type-heading ${text} mb-1`}>{role.jobTitle}</h3>
      <p className={`text-xs ${sub} mb-4`}>
        {COUNTRY_LABELS[country]} · {employer === 'local' ? 'Local employer' : 'International employer'}
        {parity && countryData.employerScope === 'local_intl' && (
          <span className="ml-2 text-[#D4A017]">· Salary parity (not separately sourced)</span>
        )}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
        <MetricPill label="Fresh Grad" value={salaries.fresh ?? 'n/a'} dark={dark} />
        <MetricPill label="Average" value={salaries.avg ?? 'n/a'} dark={dark} />
        <MetricPill label="Senior" value={salaries.senior ?? 'n/a'} dark={dark} />
        <MetricPill label="Demand (6mo)" value={role.demand ? `~${role.demand.toLocaleString()}` : 'n/a'} dark={dark} />
        <MetricPill label="AI Risk" value={role.aiRisk != null ? `${role.aiRisk}%` : 'n/a'} dark={dark} />
        <MetricPill label="WLB" value={role.wlb != null ? `${role.wlb}%` : 'n/a'} dark={dark} />
        <MetricPill label="Stability" value={role.stability != null ? `${role.stability}%` : 'n/a'} dark={dark} />
        <MetricPill label="Hours/Week" value={role.hrsPerWeek ?? 'n/a'} dark={dark} />
        <MetricPill label="Work Mode" value={role.workMode ?? 'n/a'} dark={dark} />
        {role.travel && <MetricPill label="Travel" value={role.travel} dark={dark} />}
        {role.stress && <MetricPill label="Stress" value={role.stress} dark={dark} />}
        {role.culture && <MetricPill label="Culture" value={role.culture} dark={dark} />}
      </div>

      {role.challenges && (
        <div className={`${inset} border rounded-xl p-4 mb-5`}>
          <div className={`text-xs ${sub} mb-1`}>Common Challenges</div>
          <div className={`text-sm ${text}`}>{role.challenges}</div>
        </div>
      )}

      {progression && progression.stages.length > 0 && (
        <div>
          <div className={`flex items-center gap-2 mb-3 ${text} text-sm font-semibold`}>
            <GitBranch size={16} className="text-[#1F4D3A]" />
            Career Progression
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-2 min-w-max">
              {progression.stages.map((stage, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`${inset} border rounded-xl p-3 min-w-[130px] text-center`}>
                    <div className={`text-xs ${sub}`}>{stage.years}</div>
                    <div className={`text-sm font-medium ${text} mt-1`}>{stage.title}</div>
                  </div>
                  {i < progression.stages.length - 1 && <ChevronRight size={16} className={sub} />}
                </div>
              ))}
            </div>
          </div>
          {progression.pivots.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`text-xs ${sub}`}>Pivot paths:</span>
              {progression.pivots.map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded-md text-xs bg-[#1F4D3A]/15 text-[#1F4D3A] border border-[#1F4D3A]/25"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CareerOS({ dark }: { dark: boolean }) {
  const [sectorSlug, setSectorSlug] = useState<SectorSlug>('eng_tech');
  const [country, setCountry] = useState<CountryCode>('MY');
  const [employer, setEmployer] = useState<EmployerType>('local');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [view, setView] = useState<'roles' | 'reference'>('roles');

  const titleRef = useReveal();
  const subtitleRef = useReveal();

  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const inset = dark ? 'bg-[#060611] border-[#0F0F2E]' : 'bg-[#E8E8F5] border-[#CCCCE4]';
  const pillSecondary = dark
    ? 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#0D0D1C] text-[#8B8BA8] border border-[#16163A]'
    : 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#E4E4F4] text-[#2A2A4A] border border-[#CCCCE4]';
  const pillPrimary = 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#1F4D3A] text-white';

  const sector = useMemo(() => getSector(sectorSlug)!, [sectorSlug]);
  const countryData = sector.countries[country];
  const roles = countryData?.roles ?? [];
  const selectedRow = roles.find((r) => r.roleSlug === selectedRole) ?? null;
  const salaryRankExcluded = excludeFromSalaryRank(sectorSlug, country);

  const availableCountries = useMemo(
    () => Object.keys(sector.countries) as CountryCode[],
    [sector]
  );

  const handleSectorChange = (slug: SectorSlug) => {
    setSectorSlug(slug);
    const s = getSector(slug)!;
    const countries = Object.keys(s.countries) as CountryCode[];
    if (!countries.includes(country)) setCountry(countries[0] ?? 'MY');
    setSelectedRole(null);
  };

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 ref={titleRef.ref} className={revealCls(titleRef.revealed, 'type-display', text, 'mb-2')}>
          Career Roles
        </h1>
        <p ref={subtitleRef.ref} className={revealCls(subtitleRef.revealed, sub, 'mb-6')}>
          6 sectors · 108 roles · 6 SEA countries — salary, demand, progression & market data
        </p>

        {/* Sector selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
          {careerOSSectors.map((s) => (
            <button
              key={s.sectorSlug}
              type="button"
              onClick={() => handleSectorChange(s.sectorSlug)}
              className={`text-left p-3 rounded-xl border transition ${
                sectorSlug === s.sectorSlug
                  ? 'bg-[#1F4D3A] text-white border-[#1F4D3A]'
                  : `${card} hover:border-[#5B52C4]/40`
              }`}
            >
              <div className="text-lg mb-1">{SECTOR_ICONS[s.sectorSlug]}</div>
              <div className={`text-xs font-semibold leading-tight ${sectorSlug === s.sectorSlug ? 'text-white' : text}`}>
                {s.displayName}
              </div>
              <div className={`text-[10px] mt-0.5 ${sectorSlug === s.sectorSlug ? 'text-white/70' : sub}`}>
                {s.roleCount} roles
              </div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className={`${card} border rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center`}>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-[#1F4D3A]" />
            <select
              value={country}
              onChange={(e) => { setCountry(e.target.value as CountryCode); setSelectedRole(null); }}
              className={`text-sm rounded-lg px-3 py-1.5 border ${dark ? 'bg-[#0D0D1C] border-[#16163A] text-[#E8E8F5]' : 'bg-white border-[#CCCCE4] text-[#0D0D2E]'}`}
            >
              {availableCountries.map((c) => (
                <option key={c} value={c}>{COUNTRY_LABELS[c]}</option>
              ))}
            </select>
          </div>

          {countryData?.employerScope === 'local_intl' && (
            <div className="flex gap-1">
              {(['local', 'intl'] as EmployerType[]).map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmployer(e)}
                  className={employer === e ? pillPrimary : pillSecondary}
                >
                  {e === 'local' ? 'Local Employer' : 'International'}
                </button>
              ))}
            </div>
          )}

          {countryData?.employerScope === 'all' && (
            <span className={`text-xs ${sub} flex items-center gap-1`}>
              <AlertTriangle size={12} className="text-[#D4A017]" />
              USD 3-tier schema (employer_scope=all)
            </span>
          )}

          {salaryRankExcluded && (
            <span className="text-xs text-[#D4A017] border border-[#D4A017]/30 px-2 py-1 rounded-md">
              Excluded from cross-country salary-rank charts
            </span>
          )}

          <div className="ml-auto flex gap-1">
            <button type="button" onClick={() => setView('roles')} className={view === 'roles' ? pillPrimary : pillSecondary}>
              <Briefcase size={12} className="inline mr-1" />Roles
            </button>
            <button type="button" onClick={() => setView('reference')} className={view === 'reference' ? pillPrimary : pillSecondary}>
              <TrendingUp size={12} className="inline mr-1" />Quick Ref
            </button>
          </div>
        </div>

        {countryData?.context && (
          <div className={`${inset} border rounded-xl p-4 mb-4 text-sm ${sub}`}>
            {countryData.context}
          </div>
        )}

        {view === 'roles' && (
          <div className={`${card} border rounded-xl overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={inset}>
                    <th className={`px-4 py-3 text-left ${sub} font-medium`}>Job Title</th>
                    <th className={`px-4 py-3 text-left ${sub} font-medium hidden md:table-cell`}>Senior Salary</th>
                    <th className={`px-4 py-3 text-center ${sub} font-medium`}>Demand</th>
                    <th className={`px-4 py-3 text-center ${sub} font-medium hidden sm:table-cell`}>AI Risk</th>
                    <th className={`px-4 py-3 text-center ${sub} font-medium hidden lg:table-cell`}>WLB</th>
                    <th className={`px-4 py-3 text-center ${sub} font-medium hidden lg:table-cell`}>Stability</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => {
                    const salaries = getEmployerSalaries(role, employer, countryData!);
                    const active = selectedRole === role.roleSlug;
                    return (
                      <tr
                        key={role.roleSlug}
                        onClick={() => setSelectedRole(active ? null : role.roleSlug)}
                        className={`border-t cursor-pointer transition ${
                          dark ? 'border-[#14143A] hover:bg-white/[0.02]' : 'border-[#D0D0E8] hover:bg-black/[0.02]'
                        } ${active ? (dark ? 'bg-[#1F4D3A]/10' : 'bg-[#1F4D3A]/5') : ''}`}
                      >
                        <td className={`px-4 py-3 font-medium ${text}`}>{role.jobTitle}</td>
                        <td className={`px-4 py-3 hidden md:table-cell text-[#1F4D3A] text-xs`}>
                          {salaries.senior ?? 'n/a'}
                        </td>
                        <td className={`px-4 py-3 text-center ${text}`}>
                          {role.demand ? `~${(role.demand / 1000).toFixed(0)}k` : '—'}
                        </td>
                        <td className={`px-4 py-3 text-center hidden sm:table-cell`}>
                          <span className={role.aiRisk != null && role.aiRisk >= 45 ? 'text-red-400' : 'text-[#1F4D3A]'}>
                            {role.aiRisk != null ? `${role.aiRisk}%` : '—'}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-center hidden lg:table-cell ${text}`}>
                          {role.wlb != null ? `${role.wlb}%` : '—'}
                        </td>
                        <td className={`px-4 py-3 text-center hidden lg:table-cell ${text}`}>
                          {role.stability != null ? `${role.stability}%` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'roles' && selectedRow && (
          <RoleDetailPanel
            role={selectedRow}
            sectorSlug={sectorSlug}
            country={country}
            employer={employer}
            dark={dark}
            card={card}
            text={text}
            sub={sub}
            inset={inset}
          />
        )}

        {view === 'reference' && (
          <div className="space-y-4 animate-fadeIn">
            {Object.entries(sector.quickReference).map(([title, items]) => (
              <div key={title} className={`${card} border rounded-xl p-5`}>
                <h3 className={`text-sm font-semibold ${text} mb-3`}>{title}</h3>
                <ul className="space-y-1.5">
                  {items.map((item, i) => (
                    <li key={i} className={`text-sm ${sub} flex items-start gap-2`}>
                      <span className="text-[#1F4D3A] mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {Object.keys(sector.quickReference).length === 0 && (
              <div className={`${card} border rounded-xl p-6 text-center ${sub}`}>
                No quick reference data for this sector.
              </div>
            )}
          </div>
        )}

        {/* Data caveats */}
        <div className={`${inset} border rounded-xl p-4 mt-8`}>
          <div className={`flex items-center gap-2 text-xs font-semibold ${text} mb-2`}>
            <AlertTriangle size={14} className="text-[#D4A017]" />
            Dataset Caveats (v3)
          </div>
          <ul className={`text-xs ${sub} space-y-1`}>
            {datasetCaveats.map((c, i) => (
              <li key={i}>· {c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
