import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, Settings, ChevronDown, MessageSquare, GraduationCap, Handshake } from 'lucide-react';

interface NavGroup {
  label: string;
  items: { to: string; label: string; desc: string }[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Careers',
    items: [
      { to: '/career-exploration', label: 'Career Explorer', desc: 'Rankings, profiles & progression' },
      { to: '/careeros', label: 'CareerOS v3', desc: '108 roles across 6 SEA sectors' },
      { to: '/jobs', label: 'Job Listings', desc: 'Browse roles from top companies' },
      { to: '/career-coach', label: 'Career Coach', desc: 'AI-guided career advice' },
      { to: '/fields', label: 'Field Explorer', desc: 'Browse 6 CareerOS sectors' },
    ],
  },
  {
    label: 'Education',
    items: [
      { to: '/universities', label: 'Universities', desc: 'QS-ranked institutions' },
      { to: '/classes', label: 'Courses & Classes', desc: 'Upskill with expert tutors' },
    ],
  },
  {
    label: 'Skills',
    items: [
      { to: '/skill-tree', label: 'Skill Tree', desc: 'Track your progression path' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/trends', label: 'Market Trends', desc: 'Demand, salary & growth data' },
      { to: '/ai-trends', label: 'AI Impact Analysis', desc: 'Automation risk by occupation' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { to: '/resume-analyzer', label: 'Resume Analyzer', desc: 'AI-powered resume review' },
      { to: '/talent-pool', label: 'Talent Pool', desc: 'Stay discoverable to employers' },
    ],
  },
];

// Mobile links derived from navGroups inline

export default function Navbar({ dark, toggleTheme }: { dark: boolean; toggleTheme: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const bg = dark ? 'bg-[#04040E]/90 border-[#0F0F2E]' : 'bg-[#ECECF8]/90 border-[#D0D0E8]';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const dropBg = dark ? 'bg-[#0D0D1C] border-[#1E1E45] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close menus on navigation
  useEffect(() => { setMobileOpen(false); setOpenDropdown(null); }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] ${bg} border-b backdrop-blur-md`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-base">
            <span className="text-[#D4A017]">Σ</span>{' '}
            <span className={dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]'}>SIGMAJOB</span>
          </span>
        </Link>

        {/* Desktop nav groups */}
        <div ref={navRef} className="hidden lg:flex items-center gap-1">
          {navGroups.map(group => (
            <div key={group.label} className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === group.label ? null : group.label)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                  openDropdown === group.label || group.items.some(i => isActive(i.to))
                    ? (dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]')
                    : (dark ? 'text-[#55556A] hover:text-[#E8E8F5]' : 'text-[#7070A0] hover:text-[#0D0D2E]')
                }`}
              >
                {group.label}
                <ChevronDown size={14} className={`transition-transform ${openDropdown === group.label ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === group.label && (
                <div className={`absolute top-full left-0 mt-1 w-64 ${dropBg} border rounded-xl py-1 animate-fadeIn z-[110]`}>
                  {group.items.map(item => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`block px-4 py-2.5 transition-colors duration-150 ${
                        isActive(item.to)
                          ? (dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]')
                          : (dark ? 'text-[#55556A] hover:text-[#E8E8F5]' : 'text-[#7070A0] hover:text-[#0D0D2E]')
                      }`}
                    >
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className={`text-xs ${sub} mt-0.5`}>{item.desc}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            to="/community"
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
              isActive('/community')
                ? (dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]')
                : (dark ? 'text-[#55556A] hover:text-[#E8E8F5]' : 'text-[#7070A0] hover:text-[#0D0D2E]')
            }`}
          >
            Community
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          <button onClick={toggleTheme} className={`p-2 rounded-md ${sub} hover:${text} transition`}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button onClick={() => setShowProfile(!showProfile)} className={`p-2 rounded-md ${sub} hover:${text} transition`}>
              <User size={17} />
            </button>
            {showProfile && (
              <div className={`absolute right-0 top-full mt-1 w-48 ${dropBg} border rounded-xl py-1 animate-fadeIn z-[110]`}>
                <Link to="/settings" className={`flex items-center gap-2 px-4 py-2.5 text-sm ${text} hover:bg-[#1F4D3A]/5`}>
                  <Settings size={15} /> Settings
                </Link>
                <Link to="/messages" className={`flex items-center gap-2 px-4 py-2.5 text-sm ${text} hover:bg-[#1F4D3A]/5`}>
                  <MessageSquare size={15} /> Messages
                </Link>
                <Link to="/profile" className={`flex items-center gap-2 px-4 py-2.5 text-sm ${text} hover:bg-[#1F4D3A]/5`}>
                  <User size={15} /> My Profile
                </Link>
                <Link to="/student-profile" className={`flex items-center gap-2 px-4 py-2.5 text-sm ${text} hover:bg-[#1F4D3A]/5`}>
                  <GraduationCap size={15} /> Student Profile
                </Link>
                <Link to="/exchange" className={`flex items-center gap-2 px-4 py-2.5 text-sm ${text} hover:bg-[#1F4D3A]/5`}>
                  <Handshake size={15} /> Exchange
                </Link>
                <button onClick={toggleTheme} className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm ${text} hover:bg-[#1F4D3A]/5 text-left`}>
                  {dark ? <Sun size={15} /> : <Moon size={15} />} {dark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className={`lg:hidden p-2 rounded-md ${sub}`}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`lg:hidden ${dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]'} border-t ${dark ? 'border-[#1E1E45]' : 'border-[#D0D0E8]'} animate-fadeIn max-h-[80vh] overflow-y-auto`}>
          <div className="px-4 py-3 space-y-1">
            {navGroups.map(g => (
              <div key={g.label} className="mb-3">
                <div className={`type-label ${sub} px-3 py-1`}>{g.label}</div>
                {g.items.map(item => (
                  <Link key={item.to} to={item.to}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive(item.to)
                        ? (dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]')
                        : (dark ? 'text-[#55556A]' : 'text-[#7070A0]')
                    }`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link to="/talent-pool" className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${text}`}>Talent Pool</Link>
            <Link to="/exchange" className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${text}`}>Community Exchange</Link>
            <Link to="/community" className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${text}`}>Community</Link>
            <Link to="/settings" className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${text}`}>Settings</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
