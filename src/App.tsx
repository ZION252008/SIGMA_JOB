import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import StarField from './components/StarField';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Community from './pages/Community';
import Classes from './pages/Classes';
import Trends from './pages/Trends';
import Universities from './pages/Universities';
import CareerExploration from './pages/CareerExploration';
import AiTrends from './pages/AiTrends';
import CareerCoach from './pages/CareerCoach';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import SkillTree from './pages/SkillTree';
import Messages from './pages/Messages';
import Fields from './pages/Fields';
import Settings from './pages/Settings';
import Exchange from './pages/Exchange';
import TalentPool from './pages/TalentPool';
import Profile from './pages/Profile';
import StudentProfile from './pages/StudentProfile';
import CareerOS from './pages/CareerOS';

export default function App() {
  const { dark, toggle } = useTheme();

  return (
    <BrowserRouter>
      <div className={dark ? 'bg-[#07070F] text-[#E8E8F5]' : 'bg-[#ECECF8] text-[#0D0D2E]'}>
        <StarField dark={dark} />
        <div className="relative z-[1]">
          <Navbar dark={dark} toggleTheme={toggle} />
          <Routes>
            <Route path="/" element={<Home dark={dark} />} />
            <Route path="/jobs" element={<Jobs dark={dark} />} />
            <Route path="/community" element={<Community dark={dark} />} />
            <Route path="/classes" element={<Classes dark={dark} />} />
            <Route path="/trends" element={<Trends dark={dark} />} />
            <Route path="/universities" element={<Universities dark={dark} />} />
            <Route path="/career-exploration" element={<CareerExploration dark={dark} />} />
            <Route path="/careeros" element={<CareerOS dark={dark} />} />
            <Route path="/ai-trends" element={<AiTrends dark={dark} />} />
            <Route path="/career-coach" element={<CareerCoach dark={dark} />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzer dark={dark} />} />
            <Route path="/skill-tree" element={<SkillTree dark={dark} />} />
            <Route path="/messages" element={<Messages dark={dark} />} />
            <Route path="/fields" element={<Fields dark={dark} />} />
            <Route path="/settings" element={<Settings dark={dark} toggleTheme={toggle} />} />
            <Route path="/exchange" element={<Exchange dark={dark} />} />
            <Route path="/talent-pool" element={<TalentPool dark={dark} />} />
            <Route path="/profile" element={<Profile dark={dark} />} />
            <Route path="/student-profile" element={<StudentProfile dark={dark} />} />
            <Route path="*" element={
              <div className={`${dark ? 'bg-[#07070F] text-[#E8E8F5]' : 'bg-[#ECECF8] text-[#0D0D2E]'} min-h-screen flex flex-col items-center justify-center pt-16 relative z-[1]`}>
                <div className={`type-display mb-4 ${dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]'}`}>404</div>
                <p className={`${dark ? 'text-[#8B8BA8]' : 'text-[#7070A0]'} mb-6`}>This page doesn't exist.</p>
                <a href="/" className="px-6 py-3 rounded-xl bg-[#1F4D3A] text-[#E8E8F5] font-semibold hover:opacity-90 transition">Go Home</a>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
