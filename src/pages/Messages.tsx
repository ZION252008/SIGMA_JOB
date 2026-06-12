import { useState, useRef, useEffect } from 'react';
import { Send, Search, MessageCircle } from 'lucide-react';

const seedConversations = [
  { id: 'conv1', name: 'Ahmad Razif', avatar: 'AR', lastMessage: 'Thanks for the salary advice!', time: '2m ago', online: true, unread: 2 },
  { id: 'conv2', name: 'Sarah Lim', avatar: 'SL', lastMessage: 'Are you attending the tech meetup?', time: '15m ago', online: true, unread: 0 },
  { id: 'conv3', name: 'Dr. Lee Wei', avatar: 'LW', lastMessage: 'The ML course starts next Monday', time: '1h ago', online: false, unread: 1 },
  { id: 'conv4', name: 'Priya Devi', avatar: 'PD', lastMessage: 'Got the interview at Maybank!', time: '3h ago', online: false, unread: 0 },
  { id: 'conv5', name: 'Jason Wong', avatar: 'JW', lastMessage: "Let's discuss the project proposal", time: '1d ago', online: false, unread: 0 },
];

const seedMessages: Record<string, { id: string; sender: string; content: string; time: string; mine: boolean }[]> = {
  conv1: [
    { id: 'm1', sender: 'Ahmad Razif', content: 'Hey! I saw your post about software engineer salaries in KL.', time: '10:30 AM', mine: false },
    { id: 'm2', sender: 'You', content: 'Hi Ahmad! Yes, Robert Walters 2025 data shows Junior Devs earn RM 60K-120K/year in MY.', time: '10:32 AM', mine: true },
    { id: 'm3', sender: 'Ahmad Razif', content: 'That aligns with what I found. Mid-level is around RM 6,000-8,500/month right?', time: '10:35 AM', mine: false },
    { id: 'm4', sender: 'You', content: 'Exactly. Senior can go up to RM 12,000-18,000/month depending on the company.', time: '10:36 AM', mine: true },
    { id: 'm5', sender: 'Ahmad Razif', content: 'Thanks for the salary advice!', time: '10:38 AM', mine: false },
  ],
  conv2: [
    { id: 'm1', sender: 'Sarah Lim', content: 'Hi! Are you attending the cybersecurity meetup in KL next week?', time: '9:00 AM', mine: false },
    { id: 'm2', sender: 'You', content: "I'm interested! Where is it?", time: '9:05 AM', mine: true },
    { id: 'm3', sender: 'Sarah Lim', content: 'Are you attending the tech meetup?', time: '9:10 AM', mine: false },
  ],
  conv3: [
    { id: 'm1', sender: 'Dr. Lee Wei', content: 'The ML course enrollment is closing soon. Are you joining?', time: 'Yesterday', mine: false },
    { id: 'm2', sender: 'You', content: "Yes! I've been wanting to learn TensorFlow.", time: 'Yesterday', mine: true },
    { id: 'm3', sender: 'Dr. Lee Wei', content: 'The ML course starts next Monday', time: 'Yesterday', mine: false },
  ],
};

export default function Messages({ dark }: { dark: boolean }) {
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState(seedMessages);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const bg = dark ? 'bg-[#07070F]' : 'bg-[#ECECF8]';
  const card = dark ? 'bg-[#09091A] border-[#13133A] galaxy-card-dark' : 'bg-[#F8F8FD] border-[#D0D0E8] galaxy-card-light';
  const text = dark ? 'text-[#E8E8F5]' : 'text-[#0D0D2E]';
  const sub = dark ? 'text-[#8B8BA8]' : 'text-[#4A4A6A]';
  const success = dark ? 'text-emerald-400' : 'text-[#1F4D3A]';

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, selectedConv]);

  const sendMessage = () => {
    if (!input.trim() || !selectedConv) return;
    const newMsg = {
      id: 'm' + Date.now(),
      sender: 'You',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mine: true,
    };
    setMessages(prev => ({
      ...prev,
      [selectedConv]: [...(prev[selectedConv] || []), newMsg],
    }));
    setInput('');
  };

  const convMessages = selectedConv ? (messages[selectedConv] || []) : [];
  const conv = selectedConv ? seedConversations.find(c => c.id === selectedConv) : null;
  const filteredConvs = seedConversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`${bg} min-h-screen pt-16 relative z-[1]`}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className={`${card} border rounded-2xl overflow-hidden flex`} style={{ height: 'calc(100vh - 120px)' }}>
          {/* Conversation List */}
          <div className={`w-full md:w-80 border-r ${dark ? 'border-[#13133A]' : 'border-[#D0D0E8]'} flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b" style={{ borderColor: dark ? '#1E1E45' : '#D0D0EC' }}>
              <h2 className={`type-heading ${text} mb-3`}>Messages</h2>
              <div className={`flex items-center gap-2 ${dark ? 'bg-[#060611]' : 'bg-[#E8E8F5]'} rounded-xl px-3 py-2`}>
                <Search size={16} className={sub} />
                <input placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)}
                  className={`bg-transparent text-sm ${text} outline-none w-full`} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map(c => (
                <button key={c.id} onClick={() => setSelectedConv(c.id)}
                  className={`w-full text-left p-4 flex items-center gap-3 transition hover:bg-[#5B52C4]/5 ${
                    selectedConv === c.id ? 'bg-[#5B52C4]/10' : ''
                  } border-b ${dark ? 'border-[#13133A]' : 'border-[#D0D0E8]'}`}>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#5B52C4]/20 flex items-center justify-center text-[#5B52C4] text-sm font-bold">
                      {c.avatar}
                    </div>
                    {c.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#1F4D3A] rounded-full border-2" style={{ borderColor: dark ? '#0D0D1C' : '#F8F8FD' }}></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${text}`}>{c.name}</span>
                      <span className={`text-xs ${sub}`}>{c.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className={`text-xs ${sub} truncate`}>{c.lastMessage}</span>
                      {c.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#1F4D3A] text-white text-xs flex items-center justify-center shrink-0 ml-2">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
            {conv ? (
              <>
                <div className={`p-4 border-b ${dark ? 'border-[#13133A]' : 'border-[#D0D0E8]'} flex items-center gap-3`}>
                  <button onClick={() => setSelectedConv(null)} className={`md:hidden ${sub} text-sm`}>←</button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#5B52C4]/20 flex items-center justify-center text-[#5B52C4] text-sm font-bold">
                      {conv.avatar}
                    </div>
                    {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#1F4D3A] rounded-full border-2" style={{ borderColor: dark ? '#0D0D1C' : '#F8F8FD' }}></div>}
                  </div>
                  <div>
                    <div className={`font-medium ${text}`}>{conv.name}</div>
                    <div className={`text-xs ${conv.online ? success : sub}`}>
                      {conv.online ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>

                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {convMessages.map(m => (
                    <div key={m.id} className={`flex ${m.mine ? 'justify-end' : ''} animate-fadeIn`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.mine
                          ? 'bg-[#1F4D3A] text-white rounded-br-md'
                          : `${dark ? 'bg-[#060611]' : 'bg-[#E8E8F5]'} ${text} rounded-bl-md`
                      }`}>
                        <div>{m.content}</div>
                        <div className={`text-xs mt-1 ${m.mine ? 'text-white/60' : sub}`}>{m.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`p-4 border-t ${dark ? 'border-[#13133A]' : 'border-[#D0D0E8]'}`}>
                  <div className="flex gap-2">
                    <input value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className={`flex-1 ${dark ? 'bg-[#060611]' : 'bg-[#E8E8F5]'} ${text} rounded-xl px-4 py-2.5 text-sm outline-none`} />
                    <button onClick={sendMessage} disabled={!input.trim()}
                      className="bg-[#1F4D3A] text-white p-2.5 rounded-xl disabled:opacity-50">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle size={16} className={`${sub} mx-auto mb-3 opacity-40`} />
                  <p className={`${sub} text-sm`}>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
