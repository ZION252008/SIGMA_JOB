import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowRight, BookOpen } from 'lucide-react';

export default function StudentProfile({ dark }: { dark: boolean }) {
  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const input = dark ? 'bg-[#07070F] border-[#13133A] text-[#E8E8F5]' : 'bg-[#F8F8FD] border-[#D0D0E8] text-[#0D0D2E]';
  const success = dark ? 'text-emerald-400' : 'text-[#1F4D3A]';

  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('SPM');
  const [gpa, setGpa] = useState('');
  const [competitions, setCompetitions] = useState('');
  const [communityHours, setCommunityHours] = useState('');
  const [targetStudy, setTargetStudy] = useState('Bachelor');
  const [needScholarship, setNeedScholarship] = useState(true);
  const [score, setScore] = useState<number | null>(null);

  const qualifications = ['SPM', 'STPM', 'Diploma', 'Foundation', 'A-Levels', 'IB'];
  const targetLevels = ['Bachelor', 'Master', 'PhD', 'Professional Certificate'];

  const calculateScore = () => {
    const gpaNum = parseFloat(gpa) || 0;
    const compNum = parseInt(competitions) || 0;
    const hoursNum = parseInt(communityHours) || 0;

    // Academic GPA (40%)
    const academicScore = Math.min((gpaNum / 4.0) * 40, 40);

    // Competitions (25%)
    const compScore = Math.min(compNum * 5, 25);

    // Community hours (20%)
    const commScore = Math.min(hoursNum * 0.1, 20);

    // Financial need (15%)
    const needScore = needScholarship ? 15 : 0;

    const total = Math.round(academicScore + compScore + commScore + needScore);
    setScore(Math.min(total, 100));
  };

  const getScoreColor = () => {
    if (score === null) return '';
    if (score >= 75) return success;
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBarColor = () => {
    if (score === null) return '';
    if (score >= 75) return 'bg-[#1F4D3A]';
    if (score >= 50) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const getAdvice = () => {
    if (score === null) return '';
    if (score >= 75) return 'Strong profile. Apply to JPA, MARA, university merit awards.';
    if (score >= 50) return 'Good foundation. Boost community service and competitions.';
    return 'Build your profile. Focus on grades and extracurriculars.';
  };

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className={`type-display ${text} mb-2`}>Student Profile</h1>
        <p className={`${sub} mb-6`}>Assess your scholarship readiness</p>

        <div className={`${card} border rounded-2xl p-6 mb-6`}>
          <div className="space-y-4">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name"
              className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5B52C4]`} />

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className={`type-label ${sub} block mb-1`}>Highest Qualification</label>
                <select value={qualification} onChange={e => setQualification(e.target.value)}
                  className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
                  {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className={`type-label ${sub} block mb-1`}>GPA (out of 4.0)</label>
                <input type="number" step="0.01" min="0" max="4.0" value={gpa} onChange={e => setGpa(e.target.value)}
                  placeholder="e.g. 3.50"
                  className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5B52C4]`} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className={`type-label ${sub} block mb-1`}>Competition Awards (number)</label>
                <input type="number" min="0" value={competitions} onChange={e => setCompetitions(e.target.value)}
                  placeholder="e.g. 3"
                  className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5B52C4]`} />
              </div>
              <div>
                <label className={`type-label ${sub} block mb-1`}>Community Service Hours</label>
                <input type="number" min="0" value={communityHours} onChange={e => setCommunityHours(e.target.value)}
                  placeholder="e.g. 100"
                  className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#5B52C4]`} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className={`type-label ${sub} block mb-1`}>Target Study Level</label>
                <select value={targetStudy} onChange={e => setTargetStudy(e.target.value)}
                  className={`w-full ${input} border rounded-xl px-4 py-2.5 text-sm outline-none`}>
                  {targetLevels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="flex items-end pb-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={needScholarship} onChange={e => setNeedScholarship(e.target.checked)}
                    className="w-4 h-4 rounded" />
                  <span className={`text-sm ${text}`}>Need scholarship</span>
                </label>
              </div>
            </div>

            <button onClick={calculateScore} className="w-full bg-[#1F4D3A] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
              <Calculator size={18} /> Calculate Scholarship Readiness
            </button>
          </div>
        </div>

        {score !== null && (
          <div className={`${card} border rounded-2xl p-6 animate-fadeIn mb-6`}>
            <div className="text-center">
              <div className={`type-stat ${getScoreColor()} mb-2`}>{score}/100</div>
              <p className={`text-sm ${sub} mb-4`}>Scholarship Readiness Score</p>
              <div className="w-full h-3 rounded-full bg-gray-700 mb-3">
                <div className={`h-full rounded-full transition-all duration-1000 ${getScoreBarColor()}`}
                  style={{ width: `${score}%` }}></div>
              </div>
              <p className={`text-sm font-medium ${getScoreColor()}`}>{getAdvice()}</p>
            </div>
          </div>
        )}

        <Link to="/universities" className={`flex items-center justify-center gap-2 ${card} border rounded-2xl p-4 hover:border-[#5B52C4]/40 transition ${text}`}>
          <BookOpen size={18} className="text-[#5B52C4]" />
          <span className="text-sm font-medium">Explore Universities</span>
          <ArrowRight size={16} className={sub} />
        </Link>
      </div>
    </div>
  );
}