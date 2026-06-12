import { useState, useEffect } from 'react';
import { CheckCircle, Sun, Moon, Trash2 } from 'lucide-react';

export default function Settings({ dark, toggleTheme }: { dark: boolean; toggleTheme: () => void }) {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const clearData = () => {
    if (!confirm('Are you sure? This will clear all your saved data and cannot be undone.')) return;
    const keys = ['saved_jobs', 'exchange_verified', 'talent_pool_profile'];
    keys.forEach(k => localStorage.removeItem(k));
    Object.keys(localStorage)
      .filter(k => k.startsWith('skill_progress_'))
      .forEach(k => localStorage.removeItem(k));
    setToast({ type: 'success', message: 'All saved data cleared.' });
  };

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      {toast && (
        <div className={`fixed top-20 right-4 z-50 max-w-sm animate-fadeIn flex items-center gap-2.5 px-4 py-3 rounded-xl border ${
          toast.type === 'success'
            ? `${dark ? 'bg-[#09091A] border-emerald-500/30 text-emerald-400' : 'bg-[#F8F8FD] border-[#1F4D3A]/30 text-[#1F4D3A]'}`
            : 'bg-red-500/15 border-red-500/30 text-red-400'
        }`}>
          <CheckCircle size={16} />
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100 transition">✕</button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className={`type-display ${text} mb-8`}>Settings</h1>

        <div className={`${card} border rounded-2xl p-6 mb-6`}>
          <h2 className={`type-heading ${text} mb-4`}>Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${text}`}>Theme</div>
              <div className={`text-sm ${sub}`}>Toggle between dark and light mode</div>
            </div>
            <button onClick={toggleTheme}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${card} border hover:opacity-80 transition`}>
              {dark ? <Moon size={16} className="text-[#5B52C4]" /> : <Sun size={16} className="text-[#D4A017]" />}
              <span className={`text-sm ${text}`}>{dark ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>

        <div className={`${card} border rounded-2xl p-6`}>
          <h2 className={`type-heading ${text} mb-4`}>Data</h2>
          <p className={`text-sm ${sub} mb-4`}>
            Clear all saved data including saved jobs, skill progress, and profile.
          </p>
          <button onClick={clearData}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-red-400 border border-red-500/30 hover:bg-red-500/10 transition flex items-center gap-2">
            <Trash2 size={16} /> Clear All Saved Data
          </button>
        </div>
      </div>
    </div>
  );
}
