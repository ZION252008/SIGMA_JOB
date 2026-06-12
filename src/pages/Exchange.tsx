import { useState, useEffect } from 'react';
import { Lock, X, ArrowRight, Sparkles, MapPin, ClipboardList, CheckCircle, Search, Gift, ShoppingCart, Banknote, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const allTasks = [
  { id: 't1', title: 'Teach Primary Maths', org: 'Yayasan Chow Kit', hours: 3, desc: 'Help children aged 8-12 with basic mathematics', location: 'Kuala Lumpur' },
  { id: 't2', title: 'Community Garden Maintenance', org: 'Taman Harmoni NGO', hours: 2, desc: 'Maintain vegetable garden for community', location: 'Petaling Jaya' },
  { id: 't3', title: 'Elderly Home Assistance', org: 'Rumah Seri Kenangan', hours: 4, desc: 'Help elderly residents with daily activities', location: 'Subang Jaya' },
  { id: 't4', title: 'Food Bank Packing', org: 'Kechara Soup Kitchen', hours: 2, desc: 'Sort and pack food donations for distribution', location: 'Kuala Lumpur' },
  { id: 't5', title: 'Computer Literacy Teaching', org: 'myFutureSkills', hours: 3, desc: 'Teach adults basic computing skills', location: 'Shah Alam' },
  { id: 't6', title: 'Riverside Cleanup', org: 'WWF Malaysia', hours: 2, desc: 'Environmental cleanup drive at local river', location: 'Klang' },
  { id: 't7', title: 'Children Story Reading', org: 'PEMANDU NGO', hours: 2, desc: 'Read stories to children at shelter', location: 'Kuala Lumpur' },
  { id: 't8', title: 'Meal Preparation', org: 'Pertiwi Soup Kitchen', hours: 3, desc: 'Help prepare community meals for homeless', location: 'Kuala Lumpur' },
  { id: 't9', title: 'English Tutoring', org: 'Teach For Malaysia', hours: 3, desc: 'Tutor secondary students in English', location: 'Selangor' },
  { id: 't10', title: 'Blood Drive Volunteer', org: 'Mercy Malaysia', hours: 2, desc: 'Assist at blood donation event', location: 'Kuala Lumpur' },
  { id: 't11', title: 'Animal Shelter Help', org: 'SPCA Malaysia', hours: 2, desc: 'Care for shelter animals', location: 'Ampang' },
  { id: 't12', title: 'Community Art Project', org: 'CENDANA', hours: 3, desc: 'Help with community mural painting', location: 'George Town' },
];

const redemptionOptions: { title: string; hours: number; value: string; icon: LucideIcon }[] = [
  { title: 'Grocery Voucher', hours: 5, value: 'RM50 / USD12 grocery support', icon: ShoppingCart },
  { title: 'Cash Support', hours: 10, value: 'RM80 / USD20 via e-wallet', icon: Banknote },
  { title: 'School Supplies', hours: 8, value: 'Full supply pack for one child', icon: BookOpen },
];

export default function Exchange({ dark }: { dark: boolean }) {
  const [verified, setVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [tasks, setTasks] = useState(allTasks.slice(0, 6));
  const [claimedToast, setClaimedToast] = useState('');
  
  // Form state
  const [form, setForm] = useState({
    fullName: '', dob: '', country: '', city: '', phone: '', email: '',
    income: '', dependents: '', employment: '', reason: '', document: null as File | null,
    hasOrg: false, orgName: '', orgCountry: '', orgReg: '', orgDoc: null as File | null,
    declaration1: false, declaration2: false,
  });

  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const input = dark ? 'bg-[#07070F] border-[#13133A] text-[#E8E8F5]' : 'bg-[#F8F8FD] border-[#D0D0E8] text-[#0D0D2E]';
  const success = dark ? 'text-emerald-400' : 'text-[#1F4D3A]';
  const banner = dark ? 'bg-[#09091A] border-[#16163A]' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';

  useEffect(() => {
    setVerified(localStorage.getItem('exchange_verified') === 'true');
  }, []);

  const claimTask = (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const claimed = tasks[taskIndex];
    setClaimedToast(`Task claimed! "${claimed.title}" — complete it to earn ${claimed.hours} hours.`);
    setTimeout(() => setClaimedToast(''), 4000);

    // Remove claimed task and add a new one from pool
    const remaining = allTasks.filter(t => !tasks.some(tt => tt.id === t.id) || t.id === taskId);
    const replacement = remaining.find(t => t.id !== taskId);
    
    setTasks(prev => {
      const next = prev.filter(t => t.id !== taskId);
      if (replacement) next.push(replacement);
      return next;
    });
  };

  const submitVerification = () => {
    localStorage.setItem('exchange_verified', 'true');
    setVerified(true);
    setShowModal(false);
    setStep(1);
  };

  const hoursEarned = 12; // Demo value
  const tier = hoursEarned <= 10 ? 'Bronze' : hoursEarned <= 25 ? 'Silver' : hoursEarned <= 50 ? 'Gold' : 'Platinum';
  const nextTier = tier === 'Bronze' ? 11 : tier === 'Silver' ? 26 : tier === 'Gold' ? 51 : 100;
  const tierProgress = tier === 'Platinum' ? 100 : (hoursEarned / nextTier) * 100;

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <h1 className={`type-display ${text} mb-2`}>Global Community Exchange</h1>
        <p className={`${sub} mb-4`}>Empowering individuals with financial needs through community contribution</p>
        <div className={`rounded-xl ${banner} border p-4 mb-8`}>
          <p className={`text-sm font-medium text-center flex items-center justify-center gap-2 ${success}`}>
            <Sparkles size={16} />
            Complete tasks. Earn hours. Exchange for real support.
          </p>
        </div>

        {/* Toast */}
        {claimedToast && (
          <div className={`fixed top-20 right-4 z-50 max-w-sm animate-fadeIn flex items-center gap-2.5 px-4 py-3 rounded-xl border ${
            dark ? 'bg-[#09091A] border-emerald-500/30 text-emerald-400' : 'bg-[#F8F8FD] border-[#1F4D3A]/30 text-[#1F4D3A]'
          }`}>
            <CheckCircle size={16} />
            <span className="text-sm font-medium">{claimedToast}</span>
          </div>
        )}

        {!verified ? (
          /* Locked State */
          <div className={`${card} border rounded-2xl p-12 text-center max-w-lg mx-auto`}>
            <div className="w-16 h-16 rounded-full bg-[#5B52C4]/20 flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-[#5B52C4]" />
            </div>
            <h2 className={`type-heading ${text} mb-2`}>Participation Requires Verification</h2>
            <p className={`${sub} mb-6`}>This program is open to individuals with genuine financial needs worldwide.</p>
            <button onClick={() => setShowModal(true)}
              className="bg-[#1F4D3A] text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 hover:scale-105 transition">
              Begin Verification
            </button>
          </div>
        ) : (
          /* Verified - Task Board */
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Tasks */}
            <div className="lg:col-span-3">
              <h2 className={`type-heading ${text} mb-4`}>Available Tasks</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {tasks.map(task => (
                  <div key={task.id} className={`${card} border rounded-2xl p-5 hover:border-[#5B52C4]/40 transition animate-fadeIn`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${text}`}>{task.title}</h3>
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#D4A017]/20 text-[#D4A017] font-bold">{task.hours} Hours</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${success}`}>NGO</span>
                      <span className={`text-xs ${sub}`}>{task.org}</span>
                    </div>
                    <p className={`text-xs ${sub} mb-2`}>{task.desc}</p>
                    <div className={`text-xs ${sub} mb-3 flex items-center gap-1`}>
                      <MapPin size={16} /> {task.location}
                    </div>
                    <button onClick={() => claimTask(task.id)}
                      className="w-full bg-[#1F4D3A] text-white py-2 rounded-xl text-sm font-medium hover:opacity-90 hover:scale-105 transition">
                      Claim Task
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hour Wallet */}
            <div className="lg:col-span-2">
              <div className={`${card} border rounded-2xl p-6 mb-6`}>
                <h2 className={`type-heading ${text} mb-4`}>Hour Wallet</h2>
                <div className="text-center mb-4">
                  <div className={`type-stat ${success} mb-1`}>{hoursEarned}</div>
                  <div className={`text-sm ${sub}`}>Hours Earned</div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium text-sm font-bold ${
                    tier === 'Bronze' ? 'bg-amber-600/20 text-amber-500' :
                    tier === 'Silver' ? 'bg-gray-400/20 text-gray-300' :
                    tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>{tier} Tier</span>
                </div>
                <div className={`w-full h-2 rounded-full ${dark ? 'bg-white/5' : 'bg-[#E8E8F5]'} mb-2`}>
                  <div className="h-full rounded-full bg-[#1F4D3A]" style={{ width: `${tierProgress}%` }}></div>
                </div>
                <div className={`text-xs ${sub} text-center`}>{hoursEarned}/{nextTier} to next tier</div>
              </div>

              <h3 className={`font-semibold ${text} mb-3`}>Redemption Options</h3>
              <div className="space-y-3">
                {redemptionOptions.map(opt => (
                  <div key={opt.title} className={`${card} border rounded-xl p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <opt.icon size={16} className={success} />
                      <div>
                        <div className={`font-medium ${text} text-sm`}>{opt.title}</div>
                        <div className={`text-xs ${sub}`}>{opt.value}</div>
                      </div>
                    </div>
                    <button className={`text-xs px-3 py-1.5 rounded-lg ${hoursEarned >= opt.hours ? 'bg-[#1F4D3A] text-white' : `${dark ? 'bg-white/5 text-[#7070A0]' : 'bg-[#E4E4F4] text-[#7070A0]'}`}`} disabled={hoursEarned < opt.hours}>
                      {opt.hours}h
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className={`${card} border rounded-2xl p-6 mt-8`}>
          <h2 className={`type-heading ${text} mb-4 text-center`}>How It Works</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {([
              { icon: ClipboardList, label: 'Claim Task' },
              { icon: CheckCircle, label: 'Complete Task' },
              { icon: Search, label: 'Get Verified' },
              { icon: Gift, label: 'Redeem Hours' },
            ] as { icon: LucideIcon; label: string }[]).map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`${dark ? 'bg-[#09091A]' : 'bg-[#F8F8FD]'} border ${dark ? 'border-[#16163A]' : 'border-[#D0D0E8]'} w-14 h-14 rounded-xl flex items-center justify-center`}>
                  <step.icon size={16} className={success} />
                </div>
                <span className={`text-sm font-medium ${text}`}>{step.label}</span>
                {i < 3 && <ArrowRight size={16} className={sub} />}
              </div>
            ))}
          </div>
        </div>

        {/* Verification Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div className={`${card} border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-fadeIn`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`type-heading ${text}`}>Verification</h2>
                  <button onClick={() => setShowModal(false)} className={`p-1 ${sub} hover:text-[#5B52C4]`}><X size={20} /></button>
                </div>

                {/* Progress */}
                <div className="flex gap-2 mb-6">
                  {[1,2,3,4].map(s => (
                    <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? 'bg-[#5B52C4]' : dark ? 'bg-white/10' : 'bg-[#E8E8F5]'}`}></div>
                  ))}
                </div>

                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className={`font-semibold ${text}`}>Step 1: Personal Details</h3>
                    <input placeholder="Full Name *" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`} />
                    <input type="date" placeholder="Date of Birth *" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`} />
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="Country *" value={form.country} onChange={e => setForm({...form, country: e.target.value})} className={`${input} border rounded-xl px-4 py-2.5 text-sm`} />
                      <input placeholder="City *" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className={`${input} border rounded-xl px-4 py-2.5 text-sm`} />
                    </div>
                    <input type="tel" placeholder="Phone *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`} />
                    <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`} />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className={`font-semibold ${text}`}>Step 2: Financial Needs Declaration</h3>
                    <select value={form.income} onChange={e => setForm({...form, income: e.target.value})} className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`}>
                      <option value="">Household Monthly Income *</option>
                      <option value="below300">Below USD 300</option>
                      <option value="300-600">USD 300-600</option>
                      <option value="600-1000">USD 600-1,000</option>
                      <option value="1000-2000">USD 1,000-2,000</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                    <input type="number" placeholder="Number of Dependents" value={form.dependents} onChange={e => setForm({...form, dependents: e.target.value})} className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`} />
                    <select value={form.employment} onChange={e => setForm({...form, employment: e.target.value})} className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`}>
                      <option value="">Employment Status *</option>
                      <option value="employed">Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="student">Student</option>
                      <option value="retired">Retired</option>
                    </select>
                    <textarea placeholder="Reason for applying *" rows={3} value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm resize-none`} />
                    <div>
                      <label className={`text-sm ${sub} block mb-1`}>Supporting document (optional)</label>
                      <input type="file" onChange={e => setForm({...form, document: e.target.files?.[0] || null})} className={`w-full ${input} border rounded-xl px-4 py-2 text-sm`} />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className={`font-semibold ${text}`}>Step 3: Certifying Organization</h3>
                    <p className={`text-sm ${sub}`}>Are you associated with an NGO or government program?</p>
                    <div className="flex gap-3">
                      <button onClick={() => setForm({...form, hasOrg: true})} className={`px-4 py-2 rounded-xl text-sm ${form.hasOrg ? 'bg-[#1F4D3A] text-white' : `${card} border ${text}`}`}>Yes</button>
                      <button onClick={() => setForm({...form, hasOrg: false})} className={`px-4 py-2 rounded-xl text-sm ${!form.hasOrg ? 'bg-[#1F4D3A] text-white' : `${card} border ${text}`}`}>No</button>
                    </div>
                    {form.hasOrg && (
                      <>
                        <input placeholder="Organization Name" value={form.orgName} onChange={e => setForm({...form, orgName: e.target.value})} className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`} />
                        <input placeholder="Country" value={form.orgCountry} onChange={e => setForm({...form, orgCountry: e.target.value})} className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`} />
                        <input placeholder="Registration Number" value={form.orgReg} onChange={e => setForm({...form, orgReg: e.target.value})} className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm`} />
                      </>
                    )}
                    <div>
                      <label className={`text-sm ${sub} block mb-1`}>{form.hasOrg ? 'Upload certification letter' : 'Upload self-declaration (optional)'}</label>
                      <input type="file" onChange={e => setForm({...form, orgDoc: e.target.files?.[0] || null})} className={`w-full ${input} border rounded-xl px-4 py-2 text-sm`} />
                    </div>
                    <p className={`text-xs ${sub}`}>All submissions are reviewed within 3-5 business days.</p>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <h3 className={`font-semibold ${text}`}>Step 4: Declaration</h3>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.declaration1} onChange={e => setForm({...form, declaration1: e.target.checked})} className="mt-1" />
                      <span className={`text-sm ${sub}`}>I declare all information provided is accurate and truthful.</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.declaration2} onChange={e => setForm({...form, declaration2: e.target.checked})} className="mt-1" />
                      <span className={`text-sm ${sub}`}>I consent to SigmaJob verifying my details with relevant authorities.</span>
                    </label>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  {step > 1 && <button onClick={() => setStep(step - 1)} className={`px-4 py-2 ${sub} hover:text-[#5B52C4]`}>← Back</button>}
                  <div></div>
                  {step < 4 ? (
                    <button onClick={() => setStep(step + 1)} className="bg-[#1F4D3A] text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition">
                      Next →
                    </button>
                  ) : (
                    <button onClick={submitVerification} disabled={!form.declaration1 || !form.declaration2}
                      className="bg-[#1F4D3A] text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50 hover:opacity-90 transition">
                      Submit Verification
                    </button>
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
