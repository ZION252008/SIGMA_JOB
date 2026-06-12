import type { Skill, Job } from '../data/mockData';

interface ProfilePageProps {
  skills: Skill[];
  jobs: Job[];
  dark?: boolean;
}

export default function ProfilePage({ skills, jobs, dark = true }: ProfilePageProps) {
  const card = dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const text = dark ? 'text-white' : 'text-gray-900';
  const sub = dark ? 'text-gray-500' : 'text-gray-600';
  const sectionTitle = dark ? 'text-gray-400' : 'text-gray-500';
  const progressBg = dark ? 'bg-gray-800' : 'bg-gray-200';
  const missingPill = dark ? 'bg-gray-800 text-gray-500 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-200';

  const verified = skills.filter(s => s.status === 'verified');
  const evidenced = skills.filter(s => s.status === 'evidenced');
  const declared = skills.filter(s => s.status === 'self-declared');

  const jobProgress = jobs.map(job => {
    const required = job.requiredSkillIds.map(id => skills.find(s => s.id === id)).filter(Boolean) as Skill[];
    const verifiedCount = required.filter(s => s.status === 'verified').length;
    const total = required.length;
    const percent = Math.round((verifiedCount / total) * 100);
    const missing = required.filter(s => s.status !== 'verified');
    return { job, verifiedCount, total, percent, missing };
  }).sort((a, b) => b.percent - a.percent);

  const categoryColors: Record<string, string> = {
    Tech: '#3b82f6',
    Business: '#f59e0b',
    Communication: '#10b981',
    Creative: '#a855f7',
    Operations: '#f97316',
    'Finance and Accounting': '#06b6d4',
    'Product Management': '#ec4899',
    'Data and Analytics': '#8b5cf6',
    'People and Culture': '#14b8a6',
    'Legal and Compliance': '#f43f5e',
    'Healthcare and Life Sciences': '#22c55e',
    'Education and Training': '#fb923c',
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-2 py-6">
        <div className="mb-10">
          <h2 className={`text-3xl font-bold mb-1 ${text}`}>My Profile</h2>
          <p className={`text-sm ${sub}`}>Your verified skills and career readiness</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Verified Skills', value: verified.length, color: 'text-yellow-400', bg: 'border-yellow-400/30' },
            { label: 'Evidenced Skills', value: evidenced.length, color: 'text-green-400', bg: 'border-green-400/30' },
            { label: 'Self-Declared', value: declared.length, color: 'text-gray-400', bg: 'border-gray-600' },
          ].map(stat => (
            <div key={stat.label} className={`border ${card} ${stat.bg} rounded-2xl p-6 text-center`}>
              <p className={`text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
              <p className={`text-xs uppercase tracking-wider ${sub}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {verified.length > 0 && (
          <div className="mb-10">
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${sectionTitle}`}>Verified Skills</h3>
            <div className="flex flex-wrap gap-2">
              {verified.map(skill => {
                const color = categoryColors[skill.category] ?? '#6b7280';
                return (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 rounded-full text-xs font-bold border"
                    style={{ color, borderColor: `${color}55`, background: `${color}15` }}
                  >
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${sectionTitle}`}>Career Readiness</h3>
          <div className="flex flex-col gap-3">
            {jobProgress.map(({ job, verifiedCount, total, percent, missing }) => (
              <div key={job.id} className={`border rounded-2xl p-5 ${card}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className={`font-bold text-sm ${text}`}>{job.title}</p>
                    <p className={`text-xs mt-0.5 ${sub}`}>{job.description}</p>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <span className={`block text-lg font-bold ${percent === 100 ? 'text-cyan-400' : dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {percent}%
                    </span>
                    <span className={`block text-[10px] font-semibold uppercase tracking-wider ${sub}`}>
                      {verifiedCount}/{total}
                    </span>
                  </div>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden mb-3 ${progressBg}`}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percent}%`,
                      background: percent === 100 ? '#22d3ee' : dark ? '#374151' : '#9ca3af',
                    }}
                  />
                </div>
                {missing.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className={`text-[10px] mr-1 mt-0.5 ${sub}`}>Missing:</span>
                    {missing.map(s => (
                      <span key={s.id} className={`text-[10px] px-1.5 py-0.5 rounded border ${missingPill}`}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
