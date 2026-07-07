import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './components/Layout/MainLayout';

const IntegratedChatWorkspace = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // States for Channels and DMs
  const [channels, setChannels] = useState([
    { id: 'ch1', name: 'general', type: 'channel' },
    { id: 'ch2', name: 'random', type: 'channel' },
    { id: 'ch3', name: 'project-huddleup', type: 'channel' },
  ]);

  const [users, setUsers] = useState([
    { id: 'u1', name: 'Gemini AI', status: 'online', type: 'dm' },
    { id: 'u2', name: 'Project Evaluator', status: 'offline', type: 'dm' },
  ]);

  const [activeTarget, setActiveTarget] = useState({ id: 'ch1', name: 'general', type: 'channel' });
  const [newChannelName, setNewChannelName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Message Engine
  const [messagesByRoom, setMessagesByRoom] = useState({
    ch1: [{ id: 1, user: 'Gemini AI', text: 'Welcome to the #general channel! One sidebar to rule them all now.', time: '2:30 PM', initials: 'G' }],
    ch2: [{ id: 1, user: 'Gemini AI', text: 'This is the random channel. ☕', time: '11:15 AM', initials: 'G' }],
    ch3: [],
    u1: [{ id: 1, user: 'Gemini AI', text: 'Hey Kavya! The double sidebar bug is fixed.', time: 'Yesterday', initials: 'G' }],
    u2: []
  });

  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesByRoom, activeTarget]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const currentRoomId = activeTarget.id;
    const newMsg = {
      id: Date.now(),
      user: 'Kavya Gupta',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      initials: 'K',
      isYou: true
    };

    setMessagesByRoom(prev => ({
      ...prev,
      [currentRoomId]: [...(prev[currentRoomId] || []), newMsg]
    }));
    setInputMessage('');
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const newId = `ch_${Date.now()}`;
    const newChan = { id: newId, name: newChannelName.toLowerCase().replace(/\s+/g, '-'), type: 'channel' };
    
    setChannels([...channels, newChan]);
    setMessagesByRoom(prev => ({ ...prev, [newId]: [] }));
    setActiveTarget(newChan);
    setNewChannelName('');
    setShowAddModal(false);
  };

  const currentMessages = messagesByRoom[activeTarget.id] || [];

  // Extract the sidebar content list so we can pass it down as a clean prop
  const SidebarNavigation = (
    <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6 select-none">
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-2 uppercase tracking-wider">
          <span>Channels</span>
          <button onClick={() => setShowAddModal(true)} className="hover:text-emerald-400 text-base font-bold transition-colors cursor-pointer">＋</button>
        </div>
        <ul className="mt-2 space-y-0.5">
          {channels.map(ch => (
            <li
              key={ch.id}
              onClick={() => setActiveTarget(ch)}
              className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all ${
                activeTarget.id === ch.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              # {ch.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-500 px-2 uppercase tracking-wider">
          Direct Messages
        </div>
        <ul className="mt-2 space-y-0.5">
          {users.map(u => (
            <li
              key={u.id}
              onClick={() => setActiveTarget(u)}
              className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all flex items-center space-x-2 ${
                activeTarget.id === u.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-md'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'online' ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
              <span className="truncate">{u.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <MainLayout sidebarContent={SidebarNavigation}>
      {/* Chat Windows View Header Panel */}
      <div className="h-14 border-b border-slate-950 flex items-center justify-between px-6 bg-slate-900 shadow-sm flex-shrink-0">
        <span className="font-bold text-white text-base">
          {activeTarget.type === 'channel' ? `# ${activeTarget.name}` : `🟢 ${activeTarget.name}`}
        </span>
        <button onClick={() => navigate('/login')} className="text-xs font-semibold text-slate-500 hover:text-red-400 transition-colors">
          Logout
        </button>
      </div>

      {/* Main Messages Output Viewport container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/40">
        {currentMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm italic">
            This is the absolute beginning of your message history with {activeTarget.type === 'channel' ? `#${activeTarget.name}` : activeTarget.name}.
          </div>
        ) : (
          currentMessages.map(msg => (
            <div key={msg.id} className="flex items-start space-x-3">
              <div className={`w-9 h-9 rounded text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm ${msg.isYou ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                {msg.initials}
              </div>
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-bold text-slate-200 text-sm">{msg.user}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{msg.time}</span>
                </div>
                <p className="text-sm mt-0.5 text-slate-300 bg-slate-950/20 px-3 py-1.5 rounded-r-xl rounded-bl-xl border border-slate-900/30 inline-block max-w-xl break-words">
                  {msg.text}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      
      {/* Bottom Message Composition Input Pane */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 flex-shrink-0">
        <div className="border border-slate-800 rounded-xl bg-slate-950 p-3 flex flex-col shadow-inner">
          <textarea 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
            placeholder={activeTarget.type === 'channel' ? `Message #${activeTarget.name}` : `Message ${activeTarget.name}`}
            className="bg-transparent border-0 outline-none text-sm text-slate-200 resize-none h-12 w-full placeholder-slate-600 focus:ring-0"
          />
          <div className="flex justify-end pt-2 border-t border-slate-900/50 mt-2">
            <button type="submit" className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-md cursor-pointer">
              Send
            </button>
          </div>
        </div>
      </form>

      {/* Dynamic Pop-up Modal Container to Append Channels */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateChannel} className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Create a channel</h3>
            <p className="text-xs text-slate-400 mb-4">Channels are where your team communicates. They’re best when organized around a topic.</p>
            <input 
              type="text"
              autoFocus
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="e.g. plan-launch"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-emerald-500 mb-5"
            />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-md">Create</button>
            </div>
          </form>
        </div>
      )}
    </MainLayout>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<IntegratedChatWorkspace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;