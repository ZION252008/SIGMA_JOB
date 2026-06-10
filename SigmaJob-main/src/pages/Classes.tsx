import { useState } from 'react';
import { Star, Clock, Monitor, Users, CheckCircle, ArrowLeft, Lightbulb } from 'lucide-react';
import { useReveal, revealCls } from '../hooks/useReveal';

const seedClasses = [
  { id: 'c1', title: 'Python for Data Analysis', tutor: 'Dr. Ahmad Faris', category: 'Data Science', delivery: 'Online', platform: 'Zoom', duration: 12, price: 299, rating: 4.8, reviews: 156, description: 'Learn Python, Pandas, NumPy for data analysis. Aligned with Malaysian data analyst roles paying RM 3,000-8,000/mo.', topics: ['Python', 'Pandas', 'NumPy', 'Data Viz'] },
  { id: 'c2', title: 'Cybersecurity Fundamentals', tutor: 'Sarah Chen, CISSP', category: 'Cybersecurity', delivery: 'Hybrid', platform: 'KL Campus', duration: 20, price: 599, rating: 4.9, reviews: 89, description: 'Cover NIST framework, pen testing, incident response. Malaysia has 70,000+ unfilled cybersecurity roles.', topics: ['Network Security', 'Pen Testing', 'SIEM', 'Compliance'] },
  { id: 'c3', title: 'UX Design Bootcamp', tutor: 'Mei Ling Wong', category: 'Design', delivery: 'Online', platform: 'Google Meet', duration: 16, price: 449, rating: 4.7, reviews: 112, description: 'From user research to high-fidelity prototypes. UX Designers in MY earn RM 2,500-11,000/mo.', topics: ['Figma', 'User Research', 'Prototyping', 'Design Systems'] },
  { id: 'c4', title: 'SQL & Power BI Masterclass', tutor: 'Raj Patel', category: 'Data Science', delivery: 'Online', platform: 'Zoom', duration: 8, price: 199, rating: 4.6, reviews: 234, description: 'Essential BI skills for analyst roles. Power BI is required in 65% of Malaysian data analyst job postings.', topics: ['SQL', 'Power BI', 'DAX', 'Data Modeling'] },
  { id: 'c5', title: 'AI & Machine Learning with TensorFlow', tutor: 'Dr. Lee Wei', category: 'AI/ML', delivery: 'Online', platform: 'Zoom', duration: 24, price: 799, rating: 4.9, reviews: 67, description: 'Build ML models with Python & TensorFlow. AI/ML specialists earn RM 9,000-18,000/mo in Malaysia.', topics: ['TensorFlow', 'Deep Learning', 'NLP', 'Computer Vision'] },
  { id: 'c6', title: 'Financial Modelling in Excel', tutor: 'Jason Lim, CFA', category: 'Finance', delivery: 'Hybrid', platform: 'PJ Campus', duration: 10, price: 349, rating: 4.7, reviews: 98, description: 'Build professional financial models. Financial analysts in MY earn RM 2,800-20,000/mo.', topics: ['Excel', 'DCF', 'Valuation', 'Financial Statements'] },
  { id: 'c7', title: 'Cloud Computing with AWS', tutor: 'Amir Hassan', category: 'Cloud', delivery: 'Online', platform: 'Zoom', duration: 14, price: 499, rating: 4.8, reviews: 145, description: 'AWS Solutions Architect prep. Cloud engineers face 3x more job postings than available talent in MY.', topics: ['AWS', 'EC2', 'S3', 'Lambda', 'VPC'] },
  { id: 'c8', title: 'Digital Marketing Strategy', tutor: 'Priya Devi', category: 'Marketing', delivery: 'Online', platform: 'Google Meet', duration: 6, price: 149, rating: 4.5, reviews: 189, description: 'SEO, SEM, social media, analytics. Digital marketing roles earn RM 4,000-7,000/mo in KL.', topics: ['SEO', 'Google Ads', 'Social Media', 'Analytics'] },
];

const categories = ['All', 'Data Science', 'Cybersecurity', 'Design', 'AI/ML', 'Finance', 'Cloud', 'Marketing'];

const pillSecondary = (dark: boolean) =>
  dark
    ? 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#0D0D1C] text-[#8B8BA8] border border-[#16163A]'
    : 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#E4E4F4] text-[#2A2A4A] border border-[#CCCCE4]';

const pillPrimary = 'px-2.5 py-1 rounded-md text-xs font-medium bg-[#1F4D3A] text-white';

function ClassGridCard({
  c,
  dark,
  onSelect,
}: {
  c: (typeof seedClasses)[number];
  dark: boolean;
  onSelect: () => void;
}) {
  const { ref: revealRef, revealed } = useReveal();
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const card = dark
    ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark'
    : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';

  return (
    <div ref={revealRef} className={revealCls(revealed)}>
      <button
        type="button"
        onClick={onSelect}
        className={`text-left w-full ${card} border rounded-xl p-5 hover:border-[#5B52C4]/40 transition`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={pillSecondary(dark)}>{c.category}</span>
          <span className={`flex items-center gap-1 text-xs ${sub}`}>
            <Star size={12} className="text-[#D4A017]" fill="currentColor" /> {c.rating}
          </span>
        </div>
        <h3 className={`font-semibold ${text} text-sm mb-1`}>{c.title}</h3>
        <div className={`text-xs ${sub} mb-3`}>{c.tutor}</div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#1F4D3A]">RM {c.price}</span>
          <span className={`text-xs ${sub}`}>{c.duration}h · {c.delivery}</span>
        </div>
      </button>
    </div>
  );
}

export default function Classes({ dark }: { dark: boolean }) {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', age: '', gender: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const titleRef = useReveal();
  const subtitleRef = useReveal();

  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const input = dark ? 'bg-[#07070F] border-[#13133A] text-[#E8E8F5]' : 'bg-[#F8F8FD] border-[#D0D0E8] text-[#0D0D2E]';
  const success = 'text-[#1F4D3A]';
  const inset = dark ? 'bg-[#060611] border-[#0F0F2E]' : 'bg-[#E8E8F5] border-[#CCCCE4]';

  const filtered = filter === 'All' ? seedClasses : seedClasses.filter(c => c.category === filter);
  const cls = selected ? seedClasses.find(c => c.id === selected) : null;

  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    if (!formData.fullName.trim()) errors.fullName = true;
    if (!formData.phone.trim()) errors.phone = true;
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = true;
    if (!formData.age || parseInt(formData.age) < 15 || parseInt(formData.age) > 99) errors.age = true;
    if (!formData.gender) errors.gender = true;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitBooking = () => {
    if (!validateForm()) return;
    setBooked(true);
    setBooking(false);
  };

  const resetAll = () => {
    setSelected(null);
    setBooking(false);
    setBooked(false);
    setFormData({ fullName: '', phone: '', email: '', age: '', gender: '' });
    setFormErrors({});
  };

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 ref={titleRef.ref} className={revealCls(titleRef.revealed, 'type-display', text, 'mb-2')}>Classes & Courses</h1>
        <p ref={subtitleRef.ref} className={revealCls(subtitleRef.revealed, sub, 'mb-6')}>Upskill with industry-aligned courses from expert tutors</p>

        <div className={`rounded-xl ${card} border p-5 mb-6 reveal`}>
          <p className={`text-sm ${text} flex items-start gap-2`}>
            <Lightbulb size={16} className="text-[#D4A017] shrink-0 mt-0.5" />
            <span>
              <strong>Not sure what to learn?</strong> Use our{' '}
              <a href="/resume-analyzer" className="text-[#5B52C4] underline">Resume Analyzer</a> to discover your skill gaps, then find matching classes here.
            </span>
          </p>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
          {categories.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => { setFilter(c); setSelected(null); resetAll(); }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition ${
                filter === c
                  ? 'bg-[#1F4D3A] text-white'
                  : pillSecondary(dark)
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {cls && booked ? (
          <div className={`${card} border rounded-xl p-8 text-center max-w-lg mx-auto animate-fadeIn`}>
            <div className={`w-16 h-16 rounded-xl border flex items-center justify-center mx-auto mb-4 ${dark ? 'border-[#16163A]' : 'border-[#D0D0E8]'}`}>
              <CheckCircle size={32} className={success} />
            </div>
            <h2 className={`type-heading ${success} mb-2`}>Booking Confirmed!</h2>
            <p className={`${sub} mb-4`}>
              Thank you for enrolling in <span className={text}>{cls.title}</span> with <span className={text}>{cls.tutor}</span>.
            </p>
            <p className={`text-sm ${sub} mb-6`}>
              Your instructor will contact you within 3 working business days to confirm your session details and send joining instructions.
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="bg-[#1F4D3A] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Browse More Classes
            </button>
          </div>
        ) : cls && booking ? (
          <div className="animate-fadeIn max-w-lg mx-auto">
            <button type="button" onClick={() => setBooking(false)} className={`text-sm ${sub} mb-4 hover:text-[#5B52C4] flex items-center gap-1`}>
              <ArrowLeft size={14} /> Back to class details
            </button>

            <div className={`${card} border rounded-xl p-6`}>
              <div className={`${inset} border rounded-xl p-4 mb-6`}>
                <div className={`font-semibold ${text}`}>{cls.title}</div>
                <div className={`text-sm ${sub}`}>{cls.tutor}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-[#1F4D3A] font-bold">RM {cls.price}</span>
                  <span className={`text-xs ${sub}`}>{cls.duration} hours · {cls.delivery}</span>
                </div>
              </div>

              <h3 className={`font-semibold ${text} mb-4`}>Booking Details</h3>
              <div className="space-y-3">
                <div>
                  <input
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5B52C4] ${formErrors.fullName ? 'border-red-500' : ''}`}
                  />
                  {formErrors.fullName && <p className="text-xs text-red-400 mt-1">Required</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5B52C4] ${formErrors.phone ? 'border-red-500' : ''}`}
                  />
                  {formErrors.phone && <p className="text-xs text-red-400 mt-1">Required</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5B52C4] ${formErrors.email ? 'border-red-500' : ''}`}
                  />
                  {formErrors.email && <p className="text-xs text-red-400 mt-1">Valid email required</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Age *"
                      min="15"
                      max="99"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: e.target.value })}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5B52C4] ${formErrors.age ? 'border-red-500' : ''}`}
                    />
                    {formErrors.age && <p className="text-xs text-red-400 mt-1">15-99</p>}
                  </div>
                  <div>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData({ ...formData, gender: e.target.value })}
                      className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none ${formErrors.gender ? 'border-red-500' : ''}`}
                    >
                      <option value="">Gender *</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    {formErrors.gender && <p className="text-xs text-red-400 mt-1">Required</p>}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={submitBooking}
                className="w-full bg-[#1F4D3A] text-white py-3 rounded-xl font-semibold mt-6 hover:opacity-90 transition"
              >
                Confirm Booking — RM {cls.price}
              </button>
            </div>
          </div>
        ) : cls ? (
          <div className="animate-fadeIn">
            <button type="button" onClick={() => setSelected(null)} className={`text-sm ${sub} mb-4 hover:text-[#5B52C4]`}>
              ← Back to classes
            </button>
            <div className={`${card} border rounded-xl p-6`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className={`type-heading ${text}`}>{cls.title}</h2>
                  <div className={`text-sm ${sub} mt-1`}>by {cls.tutor}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`flex items-center gap-1 text-sm ${sub}`}>
                      <Star size={14} className="text-[#D4A017]" fill="currentColor" /> {cls.rating}
                    </span>
                    <span className={`text-xs ${sub}`}>({cls.reviews} reviews)</span>
                    <span className={pillSecondary(dark)}>{cls.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`type-stat text-[#1F4D3A]`}>RM {cls.price}</div>
                  <div className={`text-xs ${sub}`}>{cls.duration} hours</div>
                </div>
              </div>

              <p className={`text-sm ${sub} mb-6`}>{cls.description}</p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className={`${inset} border rounded-xl p-4 flex items-center gap-3`}>
                  <Monitor size={18} className="text-[#5B52C4]" />
                  <div>
                    <div className={`text-xs ${sub}`}>Delivery</div>
                    <div className={`text-sm font-medium ${text}`}>{cls.delivery} · {cls.platform}</div>
                  </div>
                </div>
                <div className={`${inset} border rounded-xl p-4 flex items-center gap-3`}>
                  <Clock size={18} className="text-[#1F4D3A]" />
                  <div>
                    <div className={`text-xs ${sub}`}>Duration</div>
                    <div className={`text-sm font-medium ${text}`}>{cls.duration} hours</div>
                  </div>
                </div>
                <div className={`${inset} border rounded-xl p-4 flex items-center gap-3`}>
                  <Users size={18} className="text-[#D4A017]" />
                  <div>
                    <div className={`text-xs ${sub}`}>Reviews</div>
                    <div className={`text-sm font-medium ${text}`}>{cls.reviews} students</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className={`text-sm font-semibold ${text} mb-2`}>Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {cls.topics.map(t => (
                    <span key={t} className={pillPrimary}>{t}</span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBooking(true)}
                className="w-full bg-[#1F4D3A] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Enroll Now — RM {cls.price}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(c => (
              <ClassGridCard key={c.id} c={c} dark={dark} onSelect={() => setSelected(c.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
