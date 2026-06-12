import { useState } from 'react';
import { Code, Heart, Briefcase, Palette, FlaskConical, GraduationCap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { careerOSSectors, getSector, type SectorSlug } from '../data/careeros';
import { useReveal, revealCls } from '../hooks/useReveal';

const SECTOR_META: Record<SectorSlug, { icon: LucideIcon; color: string }> = {
  eng_tech: { icon: Code, color: '#5B52C4' },
  biz_finance: { icon: Briefcase, color: '#1F4D3A' },
  healthcare: { icon: Heart, color: '#C45B5B' },
  edu_social: { icon: GraduationCap, color: '#D4A017' },
  creative_design: { icon: Palette, color: '#9B59B6' },
  science_tech: { icon: FlaskConical, color: '#3498DB' },
};

const pillSecondary = (dark: boolean) =>
  dark
    ? 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#0D0D1C] text-[#8B8BA8] border border-[#16163A]'
    : 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#E4E4F4] text-[#2A2A4A] border border-[#CCCCE4]';

const pillPrimary = 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#1F4D3A] text-white';

function FieldGridCard({
  slug,
  name,
  roleCount,
  icon: Icon,
  color,
  card,
  text,
  sub,
  onSelect,
}: {
  slug: SectorSlug;
  name: string;
  roleCount: number;
  icon: LucideIcon;
  color: string;
  card: string;
  text: string;
  sub: string;
  onSelect: () => void;
}) {
  const { ref: revealRef, revealed } = useReveal();
  const sector = getSector(slug);
  const myData = sector?.countries.MY;
  const topRole = myData?.roles.reduce(
    (best, r) => ((r.demand ?? 0) > (best?.demand ?? 0) ? r : best),
    myData.roles[0]
  );

  return (
    <div ref={revealRef} className={revealCls(revealed)}>
      <button
        type="button"
        onClick={onSelect}
        className={`text-left w-full ${card} border rounded-xl p-5 hover:border-[#5B52C4]/40 transition`}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div className={`font-semibold ${text} text-sm mb-1`}>{name}</div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {topRole?.localAvg && (
            <span className="text-xs text-[#1F4D3A]">Avg: {topRole.localAvg}</span>
          )}
          {topRole?.demand && (
            <span className="text-xs text-[#D4A017]">
              Top demand: {(topRole.demand / 1000).toFixed(0)}k
            </span>
          )}
        </div>
        <div className={`text-xs ${sub}`}>{roleCount} roles · 6 countries</div>
      </button>
    </div>
  );
}

export default function Fields({ dark }: { dark: boolean }) {
  const [selected, setSelected] = useState<SectorSlug | null>(null);
  const titleRef = useReveal();
  const subtitleRef = useReveal();

  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const inset = dark ? 'bg-[#060611] border-[#0F0F2E]' : 'bg-[#E8E8F5] border-[#CCCCE4]';

  const sector = selected ? getSector(selected) : null;
  const meta = selected ? SECTOR_META[selected] : null;

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 ref={titleRef.ref} className={revealCls(titleRef.revealed, 'type-display', text, 'mb-2')}>Field Explorer</h1>
        <p ref={subtitleRef.ref} className={revealCls(subtitleRef.revealed, sub, 'mb-8')}>
          Explore 6 CareerOS sectors with 108 roles across Malaysia, Singapore, Thailand, Vietnam, Philippines & Laos
        </p>

        {sector && meta ? (
          <div className="animate-fadeIn">
            <button type="button" onClick={() => setSelected(null)} className={`text-sm ${sub} mb-4 hover:text-[#5B52C4]`}>
              ← Back to sectors
            </button>
            <div className={`${card} border rounded-xl p-6 mb-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${meta.color}20` }}
                >
                  <meta.icon size={24} style={{ color: meta.color }} />
                </div>
                <div>
                  <h2 className={`type-heading ${text}`}>{sector.displayName}</h2>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className={pillPrimary}>{sector.roleCount} roles</span>
                    <span className={pillSecondary(dark)}>{sector.schemaVariant.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              <h3 className={`text-sm font-semibold ${text} mb-3`}>Roles in this sector</h3>
              <div className="grid md:grid-cols-3 gap-3 mb-5">
                {sector.jobsList.map((job) => {
                  const myRow = sector.countries.MY?.roles.find((r) => r.jobTitle === job);
                  return (
                    <div key={job} className={`${inset} border rounded-xl p-4`}>
                      <div className={`font-medium ${text} text-sm mb-1`}>{job}</div>
                      {myRow ? (
                        <>
                          <div className="text-xs text-[#1F4D3A]">
                            MY: {myRow.localAvg ?? myRow.average ?? 'n/a'}
                          </div>
                          <div className={`text-xs ${sub} mt-1`}>
                            AI Risk: {myRow.aiRisk ?? 'n/a'}% · WLB: {myRow.wlb ?? 'n/a'}%
                          </div>
                        </>
                      ) : (
                        <div className={`text-xs ${sub}`}>View in CareerOS Explorer</div>
                      )}
                    </div>
                  );
                })}
              </div>

              <a href={`/careeros`} className={pillPrimary}>
                Open full CareerOS data →
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {careerOSSectors.map((s) => {
              const m = SECTOR_META[s.sectorSlug];
              return (
                <FieldGridCard
                  key={s.sectorSlug}
                  slug={s.sectorSlug}
                  name={s.displayName}
                  roleCount={s.roleCount}
                  icon={m.icon}
                  color={m.color}
                  card={card}
                  text={text}
                  sub={sub}
                  onSelect={() => setSelected(s.sectorSlug)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
