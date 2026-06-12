import { useState, useEffect } from 'react';
import { Users, X, CheckCircle, Send, Eye, Bot } from 'lucide-react';

const careers = ["Software Engineer", "Data Analyst", "Cybersecurity Analyst", "Business Analyst", "UX Designer", "Financial Analyst", "AI/ML Engineer", "Registered Nurse", "Mechanical Engineer", "Digital Marketing"];

const sampleCandidates = [
  { id: 'c1', initials: 'AK', role: 'Software Engineer', skills: ['React', 'TypeScript', 'Node.js', 'AWS'], availability: 'Immediately', match: 92, lifestyle: 'I thrive in collaborative environments with clear ownership. I value work-life balance and prefer async communication.', bio: '5 years building scalable web applications at startups and MNCs. Passionate about clean code and mentoring junior developers.' },
  { id: 'c2', initials: 'SR', role: 'Data Analyst', skills: ['Python', 'SQL', 'Power BI', 'Statistics'], availability: '1-3 months', match: 87, lifestyle: 'I enjoy data-driven decision making and storytelling with data. Looking for a team that values analytical thinking.', bio: '3 years in banking analytics. Strong in visualization and stakeholder communication.' },
  { id: 'c3', initials: 'LM', role: 'UX Designer', skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'], availability: 'Immediately', match: 85, lifestyle: 'User-centric mindset. I love cross-functional collaboration and design thinking workshops.', bio: 'Product designer with experience at tech startups. Focus on accessibility and inclusive design.' },
  { id: 'c4', initials: 'JW', role: 'Cybersecurity Analyst', skills: ['Network Security', 'SIEM', 'Pen Testing', 'Python'], availability: '3-6 months', match: 79, lifestyle: 'Detail-oriented problem solver. I thrive under pressure and enjoy continuous learning in the evolving security landscape.', bio: 'CISSP certified with 4 years in enterprise security. Experience with incident response and threat hunting.' },
  { id: 'c5', initials: 'PD', role: 'Business Analyst', skills: ['Requirements', 'SQL', 'Jira', 'Process Mapping'], availability: 'Immediately', match: 83, lifestyle: 'I bridge business and tech teams effectively. Strong communicator who values clarity and structure.', bio: 'BA with consulting background. Expert in digital transformation projects for banking and telco.' },
  { id: 'c6', initials: 'NK', role: 'AI/ML Engineer', skills: ['Python', 'TensorFlow', 'MLOps', 'NLP'], availability: '1-3 months', match: 91, lifestyle: 'Research-minded but practical. I enjoy building production ML systems and staying current with AI developments.', bio: 'ML engineer specializing in NLP. Published research in top conferences. Strong MLOps skills.' },
];

export default function TalentPool({ dark }: { dark: boolean }) {
  const [view, setView] = useState<'seeker' | 'employer'>('seeker');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joined, setJoined] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState<Set<string>>(new Set());
  
  // Form state
  const [form, setForm] = useState({
    lifestyle: '',
    bio: '',
    targetRole: 'Software Engineer',
    skills: [] as string[],
    skillInput: '',
    availability: 'Immediately',
  });
  
  // Filters
  const [filterRole, setFilterRole] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');

  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const input = dark ? 'bg-[#07070F] border-[#13133A] text-[#E8E8F5]' : 'bg-[#F8F8FD] border-[#D0D0E8] text-[#0D0D2E]';
  const success = dark ? 'text-emerald-400' : 'text-[#1F4D3A]';
  const banner = dark ? 'bg-[#09091A] border-[#16163A]' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';

  useEffect(() => {
    const saved = localStorage.getItem('talent_pool_profile');
    if (saved) {
      setJoined(true);
      setForm(JSON.parse(saved));
    }
  }, []);

  const addSkill = () => {
    if (form.skillInput.trim() && !form.skills.includes(form.skillInput.trim())) {
      setForm({ ...form, skills: [...form.skills, form.skillInput.trim()], skillInput: '' });
    }
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
  };

  const submitProfile = () => {
    localStorage.setItem('talent_pool_profile', JSON.stringify(form));
    setJoined(true);
    setShowJoinModal(false);
  };

  const optOut = () => {
    if (confirm('Are you sure you want to opt out? Your profile will be removed from the talent pool.')) {
      localStorage.removeItem('talent_pool_profile');
      setJoined(false);
      setForm({ lifestyle: '', bio: '', targetRole: 'Software Engineer', skills: [], skillInput: '', availability: 'Immediately' });
    }
  };

  const sendRequest = (candidateId: string) => {
    setRequestSent(prev => new Set([...prev, candidateId]));
  };

  const filteredCandidates = sampleCandidates.filter(c => {
    if (filterRole !== 'All' && c.role !== filterRole) return false;
    if (filterAvailability !== 'All' && c.availability !== filterAvailability) return false;
    return true;
  });

  const candidate = selectedCandidate ? sampleCandidates.find(c => c.id === selectedCandidate) : null;

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <h1 className={`type-display ${text} mb-2`}>SigmaJob Talent Pool</h1>
        <p className={`${sub} mb-6`}>Stay discoverable. Get matched to future opportunities automatically.</p>

        {/* View Toggle */}
        <div className="flex gap-3 mb-8">
          <button onClick={() => setView('seeker')}
            className={`flex-1 py-4 rounded-2xl text-center font-semibold transition ${view === 'seeker' ? 'bg-[#1F4D3A] text-white' : `${card} border ${text}`}`}>
            <Users size={20} className="inline mr-2" /> I'm a Job Seeker
          </button>
          <button onClick={() => setView('employer')}
            className={`flex-1 py-4 rounded-2xl text-center font-semibold transition ${view === 'employer' ? 'bg-[#1F4D3A] text-white' : `${card} border ${text}`}`}>
            <Eye size={20} className="inline mr-2" /> I'm an Employer
          </button>
        </div>

        {view === 'seeker' ? (
          /* Job Seeker View */
          <div>
            {/* How it works */}
            <div className={`${card} border rounded-2xl p-6 mb-8`}>
              <h2 className={`type-heading ${text} mb-4`}>How It Works</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {['Opt In', 'Stay Discoverable', 'AI Matches You', 'Get Contacted'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-[#1F4D3A] text-white flex items-center justify-center text-sm font-bold`}>{i + 1}</div>
                    <span className={`text-sm ${text}`}>{step}</span>
                    {i < 3 && <span className={sub}>→</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className={`${card} border rounded-2xl p-6 mb-8`}>
              <h2 className={`type-heading ${text} mb-4`}>Benefits</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'No need to reapply for every job',
                  'Passive job hunting while you focus on your current role',
                  'AI matches you to roles that fit your skills and personality',
                  'Get notified when a matching job appears',
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-[#1F4D3A] mt-0.5 shrink-0" />
                    <span className={`text-sm ${sub}`}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {joined ? (
              <div className={`${card} border rounded-2xl p-6 text-center`}>
                <CheckCircle size={40} className={`${success} mx-auto mb-3`} />
                <h2 className={`type-heading ${text} mb-2`}>You're in the Talent Pool!</h2>
                <p className={`${sub} text-sm mb-4`}>Your profile is visible to verified employers.</p>
                <div className={`${card} border rounded-xl p-4 text-left mb-4`}>
                  <div className={`text-sm font-medium ${text}`}>Target Role: {form.targetRole}</div>
                  <div className={`text-xs ${sub} mt-1`}>Availability: {form.availability}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.skills.map(s => <span key={s} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#5B52C4]/20 text-[#5B52C4]">{s}</span>)}
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setShowJoinModal(true)} className={`px-4 py-2 rounded-xl ${card} border ${text} text-sm`}>Edit Profile</button>
                  <button onClick={optOut} className="px-4 py-2 rounded-xl text-red-400 text-sm hover:bg-red-500/10">Opt Out</button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button onClick={() => setShowJoinModal(true)}
                  className="bg-[#1F4D3A] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:opacity-90 hover:scale-105 transition">
                  Join the Talent Pool
                </button>
                <p className={`text-xs ${sub} mt-3`}>Your profile is only visible to verified employers. You can opt out at any time.</p>
              </div>
            )}
          </div>
        ) : (
          /* Employer View */
          <div>
            {/* AI Match Banner */}
            <div className={`rounded-xl ${banner} border p-4 mb-6`}>
              <p className={`text-sm ${text} flex items-start gap-2`}>
                <Bot size={16} className="text-[#5B52C4] shrink-0 mt-0.5" />
                <span>Based on your recent job postings, we found <span className="font-bold text-[#5B52C4]">14 matching candidates</span> in the talent pool.</span>
              </p>
            </div>

            <h2 className={`type-heading ${text} mb-4`}>Search Talent Pool</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
                className={`${input} border rounded-xl px-4 py-2.5 text-sm`}>
                <option value="All">All Roles</option>
                {careers.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterAvailability} onChange={e => setFilterAvailability(e.target.value)}
                className={`${input} border rounded-xl px-4 py-2.5 text-sm`}>
                <option value="All">All Availability</option>
                <option value="Immediately">Immediately</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCandidates.map(c => (
                <div key={c.id} className={`${card} border rounded-2xl p-5 hover:border-[#5B52C4]/40 transition`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-[#1F4D3A] flex items-center justify-center text-white font-bold">
                      {c.initials}
                    </div>
                    <div>
                      <div className={`font-medium ${text}`}>{c.role}</div>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        c.availability === 'Immediately' ? success : 'bg-yellow-500/20 text-yellow-400'
                      }`}>{c.availability}</span>
                    </div>
                    <div className="ml-auto text-right">
                      <div className={`type-stat ${success}`}>{c.match}%</div>
                      <div className={`text-xs ${sub}`}>Match</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {c.skills.map(s => <span key={s} className={`px-2.5 py-1 rounded-md text-xs font-medium ${dark ? 'bg-white/5 text-gray-300' : 'bg-[#E8E8F5] text-[#4A4A6A]'}`}>{s}</span>)}
                  </div>
                  <button onClick={() => setSelectedCandidate(c.id)}
                    className="w-full bg-[#1F4D3A] text-white py-2 rounded-xl text-sm font-medium hover:opacity-90 transition">
                    View Profile
                  </button>
                </div>
              ))}
            </div>

            {/* Candidate Detail Panel */}
            {candidate && (
              <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSelectedCandidate(null)}>
                <div className={`${card} w-full max-w-md h-full overflow-y-auto animate-fadeIn`} onClick={e => e.stopPropagation()}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`type-heading ${text}`}>Candidate Profile</h2>
                      <button onClick={() => setSelectedCandidate(null)} className={sub}><X size={20} /></button>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-[#1F4D3A] flex items-center justify-center text-white text-xl font-bold">
                        {candidate.initials}
                      </div>
                      <div>
                        <div className={`font-semibold ${text}`}>{candidate.role}</div>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                          candidate.availability === 'Immediately' ? success : 'bg-yellow-500/20 text-yellow-400'
                        }`}>{candidate.availability}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className={`text-sm font-semibold ${text} mb-2`}>Working Lifestyle</h3>
                      <p className={`text-sm ${sub}`}>{candidate.lifestyle}</p>
                    </div>

                    <div className="mb-4">
                      <h3 className={`text-sm font-semibold ${text} mb-2`}>Professional Background</h3>
                      <p className={`text-sm ${sub}`}>{candidate.bio}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className={`text-sm font-semibold ${text} mb-2`}>Skills</h3>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map(s => <span key={s} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#5B52C4]/20 text-[#5B52C4]">{s}</span>)}
                      </div>
                    </div>

                    {requestSent.has(candidate.id) ? (
                      <div className={`${card} border rounded-xl p-4 text-center`}>
                        <CheckCircle size={24} className={`${success} mx-auto mb-2`} />
                        <p className={`text-sm ${sub}`}>Request sent! The candidate will be notified and may choose to share their contact details with you.</p>
                      </div>
                    ) : (
                      <button onClick={() => sendRequest(candidate.id)}
                        className="w-full bg-[#1F4D3A] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 hover:scale-105 transition">
                        <Send size={18} /> Send Contact Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Join Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className={`${card} border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`type-heading ${text}`}>Join Talent Pool</h2>
                  <button onClick={() => setShowJoinModal(false)} className={sub}><X size={20} /></button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`text-sm font-medium ${text} block mb-1`}>Working Lifestyle</label>
                    <textarea rows={3} placeholder="Describe your ideal work environment, values, and what kind of team you thrive in..."
                      value={form.lifestyle} onChange={e => setForm({...form, lifestyle: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm resize-none`} />
                  </div>
                  
                  <div>
                    <label className={`text-sm font-medium ${text} block mb-1`}>Professional Description</label>
                    <textarea rows={3} placeholder="Write a brief bio about your professional background and what you bring to a team..."
                      value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm resize-none`} />
                  </div>

                  <div>
                    <label className={`text-sm font-medium ${text} block mb-1`}>Target Role</label>
                    <select value={form.targetRole} onChange={e => setForm({...form, targetRole: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`}>
                      {careers.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={`text-sm font-medium ${text} block mb-1`}>Key Skills</label>
                    <div className="flex gap-2 mb-2">
                      <input placeholder="Type a skill and press Enter"
                        value={form.skillInput} onChange={e => setForm({...form, skillInput: e.target.value})}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className={`flex-1 ${input} border rounded-xl px-4 py-2.5 text-sm`} />
                      <button onClick={addSkill} className={`${card} border px-3 rounded-xl ${text}`}>Add</button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {form.skills.map(s => (
                        <span key={s} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#5B52C4]/20 text-[#5B52C4] flex items-center gap-1">
                          {s} <button onClick={() => removeSkill(s)}><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`text-sm font-medium ${text} block mb-1`}>Availability</label>
                    <select value={form.availability} onChange={e => setForm({...form, availability: e.target.value})}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`}>
                      <option value="Immediately">Immediately</option>
                      <option value="1-3 months">1-3 months</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="Not actively looking">Not actively looking</option>
                    </select>
                  </div>
                </div>

                <button onClick={submitProfile}
                  className="w-full bg-[#1F4D3A] text-white py-3 rounded-xl font-semibold mt-6 hover:opacity-90 hover:scale-105 transition">
                  Submit to Talent Pool
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
