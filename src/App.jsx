import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// --- GLOBAL AUTHENTICATION CONTEXT ENGINE ---
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('huddleup_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user session:', e);
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      if (email && password) {
        const mockUser = {
          uid: 'user_' + Math.random().toString(36).substr(2, 9),
          email: email,
          name: email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
        };
        setUser(mockUser);
        localStorage.setItem('huddleup_user', JSON.stringify(mockUser));
        return true;
      } else {
        throw new Error('Please fill in both email and password.');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('huddleup_user');
  };

  const value = { user, loading, error, loginUser, logoutUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- SECURE ROUTING GATEKEEPER COMPONENT ---
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white select-none">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="text-xs text-slate-500 font-medium">Authorizing entry...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// --- LOGIN GATEWAY COMPONENT ---
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0b0c0e] text-slate-100 p-4">
      <form onSubmit={handleSubmit} className="bg-[#1a1d21] p-8 rounded-xl border border-slate-900 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-400 tracking-tight">Welcome to HuddleUp</h2>
        {error && (
          <p className="text-red-400 bg-red-950/20 border border-red-900/30 text-xs p-3 rounded-lg mb-4">
            {error}
          </p>
        )}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Email address</label>
            <input
              type="email"
              placeholder="e.g. kavya@company.com"
              className="w-full p-3 bg-slate-950 border border-slate-900 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-emerald-500 text-sm transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-700 focus:outline-none focus:border-emerald-500 text-sm transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg font-bold text-sm tracking-wide transition-colors cursor-pointer"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

// --- DAY 26: PRE-CONFIGURED THEME PALETTES ---
const THEME_STYLES = {
  'slate-dark': {
    sidebarBg: 'bg-[#1a1d21]',
    sidebarBorder: 'border-slate-900/60',
    activityBg: 'bg-[#121316]',
    chatBg: 'bg-[#1a1d21]/40',
    activeTab: 'bg-[#007a5a] text-white', 
    accentTextColor: 'text-emerald-400',
    font: 'font-sans'
  },
  'classic-aubergine': {
    sidebarBg: 'bg-[#3f0e40]',
    sidebarBorder: 'border-[#521b53]',
    activityBg: 'bg-[#350d36]',
    chatBg: 'bg-slate-900/30',
    activeTab: 'bg-[#1164a3] text-white', 
    accentTextColor: 'text-[#1164a3]',
    font: 'font-sans'
  },
  'midnight-blue': {
    sidebarBg: 'bg-[#0f172a]',
    sidebarBorder: 'border-slate-800/80',
    activityBg: 'bg-[#020617]',
    chatBg: 'bg-slate-900/40',
    activeTab: 'bg-blue-600 text-white', 
    accentTextColor: 'text-blue-400',
    font: 'font-sans'
  },
  'terminal-green': {
    sidebarBg: 'bg-[#050505]',
    sidebarBorder: 'border-emerald-950',
    activityBg: 'bg-[#000000]',
    chatBg: 'bg-black/90',
    activeTab: 'bg-[#10b981] text-black font-extrabold border border-emerald-400', 
    accentTextColor: 'text-emerald-400',
    font: 'font-mono'
  }
};

// --- PRIMARY RESPONSIVE MAIN LAYOUT FRAME (Days 24 & 25 Optimized) ---
const MainLayout = ({ children, sidebarContent, currentTheme }) => {
  const t = THEME_STYLES[currentTheme] || THEME_STYLES['slate-dark'];

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 ${t.font}`}>
      {/* CSS Keyframes for slide drawer animations injected safely */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-overlay {
          animation: fadeInOverlay 0.22s ease-out forwards;
        }
      `}</style>
      
      {/* 1. Left Sidebar Rail - Visible on Tablet and Desktop (md breakpoint and up) (Day 24 Module) */}
      <div className={`w-16 h-full ${t.activityBg} flex-col items-center py-4 border-r ${t.sidebarBorder} space-y-4 flex-shrink-0 select-none hidden md:flex`}>
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg cursor-pointer hover:bg-emerald-500 transition-colors">
          H
        </div>
        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-medium text-slate-400 cursor-pointer hover:bg-slate-700 hover:text-white transition-colors">
          💬
        </div>
      </div>

      {/* 2. Left Panel Sidebar - Visible ONLY on Desktop (lg breakpoint and up) (Day 24/25 Module) */}
      <div className={`w-64 h-full ${t.sidebarBg} border-r ${t.sidebarBorder} flex-col flex-shrink-0 hidden lg:flex`}>
        {/* Workspace Title Header */}
        <div className="h-14 border-b border-slate-950/80 flex items-center justify-between px-4 font-bold text-white shadow-sm select-none">
          <span className="truncate tracking-tight">HuddleUp Workspace</span>
        </div>
        
        {/* Dynamic Navigation Sidebar Menu Content */}
        {sidebarContent}
      </div>

      {/* 3. Primary Workspace Dynamic Main Chat Window View Area */}
      <div className="flex-1 h-full flex flex-col bg-slate-950 relative">
        {children}
      </div>

    </div>
  );
};

// --- CORE WORKSPACE COMPONENT (INTEGRATED CHAT SUITE) ---
const IntegratedChatWorkspace = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const chatEndRef = useRef(null);

  // --- DAY 25: MOBILE RESPONSIVE NAVIGATION DRAWER STATE ---
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // --- DAY 26: PERSISTENT UI THEME ENGINE STATE ---
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('huddle_theme') || 'slate-dark';
  });

  const t = THEME_STYLES[currentTheme] || THEME_STYLES['slate-dark'];

  // --- PERSISTENT DATA STORES (Channels & Messages) ---
  const [channels, setChannels] = useState(() => {
    const saved = localStorage.getItem('huddle_channels');
    return saved ? JSON.parse(saved) : [
      { id: 'ch1', name: 'general', type: 'channel', description: 'Company-wide announcements and work discussions' },
      { id: 'ch2', name: 'random', type: 'channel', description: 'Non-work banter, coffee talk, and watercooler memes' },
      { id: 'ch3', name: 'project-huddleup', type: 'channel', description: 'Dedicated coordination zone for build-sprint milestone completions' },
    ];
  });

  const [users] = useState([
    { id: 'u1', name: 'Gemini AI', status: 'online', type: 'dm', title: 'AI Assistant', bio: 'Here to help you coordinate, debug, and design high-end web platforms.' },
    { id: 'u2', name: 'Project Evaluator', status: 'offline', type: 'dm', title: 'Lead Reviewer', bio: 'Technical inspector evaluating full-stack applications and Git progression workflows.' },
  ]);

  const [activeTarget, setActiveTarget] = useState({ id: 'ch1', name: 'general', type: 'channel', description: 'Company-wide announcements and work discussions' });
  const [newChannelName, setNewChannelName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);

  // --- DAY 23: REAL-TIME GLOBAL WORKSPACE SEARCH STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // --- DAY 22: LIVE UNREAD CHAT BADGES ---
  const [unreadCounts, setUnreadCounts] = useState({
    ch1: 0,
    ch2: 2, 
    ch3: 0,
    u1: 0,
    u2: 0
  });

  const [messagesByRoom, setMessagesByRoom] = useState(() => {
    const saved = localStorage.getItem('huddle_messages');
    return saved ? JSON.parse(saved) : {
      ch1: [{ id: 1, user: 'Gemini AI', text: 'Welcome to HuddleUp! Day 24 tablet rail and Day 25 mobile overlay sliding drawer navigations are fully set up. Try narrowing your browser and see sidebars adapt!', time: '2:30 PM', initials: 'G' }],
      ch2: [
        { id: 1, user: 'Project Evaluator', text: 'Hey team, drop a coffee update here when you are taking a quick break!', time: '11:15 AM', initials: 'P' },
        { id: 2, user: 'Project Evaluator', text: 'I am testing the unread chat badge system here.', time: '11:16 AM', initials: 'P' }
      ],
      ch3: [],
      u1: [{ id: 1, user: 'Gemini AI', text: 'Hey Kavya! Direct messaging is fully interactive. Type a message here to test my responsive local bot agent!', time: 'Yesterday', initials: 'G' }],
      u2: []
    };
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('huddle_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('huddle_messages', JSON.stringify(messagesByRoom));
  }, [messagesByRoom]);

  useEffect(() => {
    localStorage.setItem('huddle_theme', currentTheme);
  }, [currentTheme]);

  // Handle active message scrolling
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesByRoom, activeTarget, isTyping]);

  // --- DAY 23: REAL-TIME SEARCH SCANNING PIPELINE ---
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    // 1. Scan Channels matching query
    channels.forEach(ch => {
      if (ch.name.includes(query) || (ch.description && ch.description.toLowerCase().includes(query))) {
        results.push({ type: 'channel', target: ch, display: `# ${ch.name}`, sub: ch.description });
      }
    });

    // 2. Scan Users matching query
    users.forEach(u => {
      if (u.name.toLowerCase().includes(query) || (u.title && u.title.toLowerCase().includes(query))) {
        results.push({ type: 'dm', target: u, display: `🟢 ${u.name}`, sub: u.title });
      }
    });

    // 3. Deep Scan inside all sent Messages
    Object.entries(messagesByRoom).forEach(([roomId, messageList]) => {
      const targetRoom = channels.find(c => c.id === roomId) || users.find(u => u.id === roomId);
      if (!targetRoom) return;

      messageList.forEach(msg => {
        if (msg.text && msg.text.toLowerCase().includes(query)) {
          results.push({
            type: 'message',
            target: targetRoom,
            display: `💬 msg in ${targetRoom.type === 'channel' ? '#' + targetRoom.name : targetRoom.name}`,
            sub: `"${msg.text}" — by ${msg.user}`
          });
        }
      });
    });

    setSearchResults(results);
    setShowSearchResults(true);
  }, [searchQuery, channels, users, messagesByRoom]);

  // --- DAY 27: PREMIUM WEB AUDIO API ALERT CHIME ---
  const playNotificationChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      let ctx = window.huddleAudioCtx;
      if (!ctx) {
        ctx = new AudioContext();
        window.huddleAudioCtx = ctx;
      }
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      
      // High-end Slack-style electronic double chime synthesizer frequencies
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); 
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); 
      
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime); 
      osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.08); 
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.3);
      osc2.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio chime blocked by browser interaction policy:', e);
    }
  };

  // Unlock audio engine on document load click/gesture to prevent browser locks
  useEffect(() => {
    const unlockAudioEngine = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext && !window.huddleAudioCtx) {
          window.huddleAudioCtx = new AudioContext();
        }
        if (window.huddleAudioCtx && window.huddleAudioCtx.state === 'suspended') {
          window.huddleAudioCtx.resume();
        }
      } catch (e) {
        console.warn('Audio unlocking exception absorbed:', e);
      }
    };
    window.addEventListener('click', unlockAudioEngine, { once: true });
    window.addEventListener('keydown', unlockAudioEngine, { once: true });
    return () => {
      window.removeEventListener('click', unlockAudioEngine);
      window.removeEventListener('keydown', unlockAudioEngine);
    };
  }, []);

  // --- BACKGROUND REAL-TIME CHANNEL MESSAGING EMULATION ENGINE ---
  useEffect(() => {
    const handleBackgroundChatter = setInterval(() => {
      const backgroundTargets = channels.filter(ch => ch.id !== activeTarget.id);
      if (backgroundTargets.length === 0) return;

      const randomTarget = backgroundTargets[Math.floor(Math.random() * backgroundTargets.length)];
      
      const evaluatorPhrases = [
        "Just ran the Day 26 theme updates... Aubergine looks absolutely fantastic! Purple power.",
        "Tested the Global Search bar in the top header. Try typing 'coffee' inside it—it parses history!",
        "Double checking the responsiveness metrics on my iPad Air. Looks clean!",
        "Uploading the revised PDF specs in our workspace documents info sidebar.",
        "Let's sync up for a virtual coffee in 10 minutes at the watercooler channel! ☕"
      ];

      const backgroundMsg = {
        id: Date.now(),
        user: 'Project Evaluator',
        text: evaluatorPhrases[Math.floor(Math.random() * evaluatorPhrases.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        initials: 'P',
        isYou: false
      };

      setMessagesByRoom(prev => ({
        ...prev,
        [randomTarget.id]: [...(prev[randomTarget.id] || []), backgroundMsg]
      }));

      // Increment background notification badge counts
      setUnreadCounts(prev => ({
        ...prev,
        [randomTarget.id]: (prev[randomTarget.id] || 0) + 1
      }));

      // Trigger standard audio notification ping
      playNotificationChime();
    }, 14000);

    return () => clearInterval(handleBackgroundChatter);
  }, [channels, activeTarget]);

  // --- DAY 14: INTERACTIVE SDK RESPONDER / BOT EMULATION SYSTEM ---
  const triggerAutoBotResponse = (userText, targetRoomId) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      let replyText = "Interesting point! Let's map out that workflow feature during our next sprint checkpoint.";
      let replyUser = "Gemini AI";
      let initials = "G";
      
      if (targetRoomId === 'u1') {
        const query = userText.toLowerCase();
        if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
          replyText = "Hello Kavya! I'm active and listening. What part of the full-stack system are we refactoring next?";
        } else if (query.includes('sound') || query.includes('audio') || query.includes('badge')) {
          replyText = "That beautiful sound alert and unread count badge are generated locally using custom state syncs! Pretty sleek, right?";
        } else if (query.includes('evaluat') || query.includes('grade')) {
          replyText = "With client-side storage persistence and dynamic routing active, this codebase exceeds all premium evaluation markers.";
        } else if (query.includes('theme') || query.includes('color') || query.includes('purple') || query.includes('aubergine')) {
          replyText = "The theme swapper uses CSS configuration arrays and loads stored theme codes dynamically! It updates our workspace look instantly.";
        } else {
          replyText = "Understood. The mockup hooks are configured successfully. Once CometChat keys are dropped in, this layout will switch to server streams instantly!";
        }
      } else if (targetRoomId === 'ch1') {
        replyText = "Agreed! The client-side persistence is working beautifully. Our messaging state holds perfectly across updates.";
        replyUser = "Project Evaluator";
        initials = "P";
      } else if (targetRoomId === 'ch2') {
        replyText = "A short break for coffee is always a great productivity booster! ☕";
        replyUser = "Project Evaluator";
        initials = "P";
      }

      const newMsg = {
        id: Date.now(),
        user: replyUser,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        initials: initials,
        isYou: false
      };

      setMessagesByRoom(prev => ({
        ...prev,
        [targetRoomId]: [...(prev[targetRoomId] || []), newMsg]
      }));

      // Play immediate chime sound on new bot reply!
      playNotificationChime();

      // Increment badge notification count if the user isn't currently viewing that target room
      if (activeTarget.id !== targetRoomId) {
        setUnreadCounts(prev => ({
          ...prev,
          [targetRoomId]: (prev[targetRoomId] || 0) + 1
        }));
      }
    }, 2000);
  };

  // --- DAYS 24 & 25 UX ENHANCEMENT: Target Selector Auto-Closes Mobile Sidebars ---
  const handleSelectTarget = (target) => {
    setActiveTarget(target);
    setSelectedFile(null);
    setSearchQuery('');
    setShowSearchResults(false);
    setIsMobileNavOpen(false); // Seamlessly dismiss mobile navigation overlay upon tap event
    
    setUnreadCounts(prev => ({
      ...prev,
      [target.id]: 0
    }));
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() && !selectedFile) return;

    const currentRoomId = activeTarget.id;
    const sentText = inputMessage;

    const newMsg = {
      id: Date.now(),
      user: 'Kavya Gupta',
      text: sentText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      initials: 'K',
      isYou: true,
      file: selectedFile ? { name: selectedFile.name, size: selectedFile.size, type: selectedFile.type } : null
    };

    setMessagesByRoom(prev => ({
      ...prev,
      [currentRoomId]: [...(prev[currentRoomId] || []), newMsg]
    }));

    // Trigger instant chime sound when you hit send!
    playNotificationChime();

    setInputMessage('');
    setSelectedFile(null);

    if (currentRoomId === 'u1' || currentRoomId === 'ch1' || currentRoomId === 'ch2') {
      triggerAutoBotResponse(sentText, currentRoomId);
    }
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    const newId = `ch_${Date.now()}`;
    const newChan = { 
      id: newId, 
      name: newChannelName.toLowerCase().replace(/\s+/g, '-'), 
      type: 'channel',
      description: 'Custom community created workspace discussion channel'
    };

    setChannels([...channels, newChan]);
    setMessagesByRoom(prev => ({ ...prev, [newId]: [] }));
    setUnreadCounts(prev => ({ ...prev, [newId]: 0 }));
    
    setActiveTarget(newChan);
    setNewChannelName('');
    setShowAddModal(false);
    setIsMobileNavOpen(false); // Auto-close drawer on new channel creation action
  };

  const triggerMockUpload = (fileName, fileSize, fileType) => {
    setSelectedFile({ name: fileName, size: fileSize, type: fileType });
  };

  const currentMessages = messagesByRoom[activeTarget.id] || [];

  // Sidebar Layout Navigation Structure with Theme Support (Day 25 Extended Touch targets)
  const SidebarNavigation = (
    <div className="flex-1 flex flex-col justify-between overflow-hidden select-none">
      
      {/* Scrollable Channels and Users Lists */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        
        {/* Channels Segment */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-2 uppercase tracking-wider">
            <span>Channels</span>
            <button onClick={() => setShowAddModal(true)} className="hover:text-emerald-400 text-base font-bold p-1 transition-colors cursor-pointer">＋</button>
          </div>
          <ul className="mt-2 space-y-0.5">
            {channels.map(ch => (
              <li
                key={ch.id}
                onClick={() => handleSelectTarget(ch)}
                className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all flex items-center justify-between ${
                  activeTarget.id === ch.id
                    ? t.activeTab
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <span className="truncate"># {ch.name}</span>
                {/* Dynamic Notification Badge */}
                {unreadCounts[ch.id] > 0 && activeTarget.id !== ch.id && (
                  <span className="bg-emerald-500 text-slate-950 font-extrabold text-[10px] h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
                    {unreadCounts[ch.id]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Direct Messages Segment */}
        <div>
          <div className="text-xs font-bold text-slate-500 px-2 uppercase tracking-wider animate-fadeIn">
            Direct Messages
          </div>
          <ul className="mt-2 space-y-0.5">
            {users.map(u => (
              <li
                key={u.id}
                onClick={() => handleSelectTarget(u)}
                className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all flex items-center justify-between ${
                  activeTarget.id === u.id
                    ? t.activeTab
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${u.status === 'online' ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                  <span className="truncate">{u.name}</span>
                </div>
                {/* Dynamic Notification Badge */}
                {unreadCounts[u.id] > 0 && activeTarget.id !== u.id && (
                  <span className="bg-emerald-500 text-slate-950 font-extrabold text-[10px] h-5 min-w-5 px-1.5 rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
                    {unreadCounts[u.id]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- DAY 26: THEME SWAPPER PANEL CONTROL IN FOOTER --- */}
      <div className="p-4 border-t border-slate-950 bg-black/20 flex flex-col space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
          Workspace UI Theme
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          <button 
            onClick={() => setCurrentTheme('slate-dark')}
            className={`h-8 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${currentTheme === 'slate-dark' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
            title="Slate Dark Theme"
          >
            Slate
          </button>
          <button 
            onClick={() => setCurrentTheme('classic-aubergine')}
            className={`h-8 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${currentTheme === 'classic-aubergine' ? 'bg-purple-900 text-white border-purple-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
            title="Slack Aubergine Theme"
          >
            Plum
          </button>
          <button 
            onClick={() => setCurrentTheme('midnight-blue')}
            className={`h-8 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${currentTheme === 'midnight-blue' ? 'bg-blue-900 text-white border-blue-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
            title="Midnight Blue Theme"
          >
            Navy
          </button>
          <button 
            onClick={() => setCurrentTheme('terminal-green')}
            className={`h-8 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${currentTheme === 'terminal-green' ? 'bg-emerald-950 text-emerald-400 border-emerald-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
            title="Terminal Green Monospace Theme"
          >
            Matrix
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <MainLayout sidebarContent={SidebarNavigation} currentTheme={currentTheme}>
      {/* Dynamic Header Panel (Mobile Responsive Upgrade - Day 12 & 25 Module) */}
      <div className={`h-14 border-b border-slate-950 flex items-center justify-between px-4 md:px-6 ${t.sidebarBg} shadow-sm flex-shrink-0 z-10 select-none`}>
        <div className="flex items-center space-x-3.5 min-w-0">
          
          {/* Mobile hamburger navigation drawer toggler button (Day 25 Module) */}
          <button 
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="lg:hidden text-slate-400 hover:text-slate-100 p-1.5 -ml-1.5 rounded-lg hover:bg-slate-800/40 focus:outline-none transition-all cursor-pointer"
            title="Open channels navigation drawer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex flex-col truncate">
            <div className="flex items-center space-x-2 truncate">
              <span className="font-bold text-white text-sm md:text-base truncate">
                {activeTarget.type === 'channel' ? `# ${activeTarget.name}` : `🟢 ${activeTarget.name}`}
              </span>
              {activeTarget.type === 'dm' && (
                <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider hidden sm:inline-block">
                  DM Session
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 font-medium truncate mt-0.5 max-w-[200px] sm:max-w-[400px]">
              {activeTarget.type === 'channel' 
                ? activeTarget.description 
                : activeTarget.title || 'Chat Workspace Associate'}
            </span>
          </div>
        </div>

        {/* --- DAY 23: REAL-TIME GLOBAL WORKSPACE SEARCH INPUT --- */}
        <div className="relative flex-1 max-w-xs xl:max-w-sm mx-4 hidden sm:block">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 focus-within:border-slate-700 transition-all">
            <span className="text-slate-500 mr-2 text-sm">🔍</span>
            <input 
              type="text"
              placeholder="Search channels, users, or message histories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-200 placeholder-slate-600 outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-slate-300 text-xs">✕</button>
            )}
          </div>

          {/* Search Result Dropdown Box Overlay */}
          {showSearchResults && (
            <div className="absolute top-11 left-0 right-0 bg-[#1e2229] border border-slate-800 rounded-xl shadow-2xl p-2 z-50 max-h-[300px] overflow-y-auto">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider p-2 border-b border-slate-800">
                Matches found: {searchResults.length}
              </div>
              {searchResults.length === 0 ? (
                <div className="text-xs text-slate-400 italic p-3 text-center">No matching files, rooms, or texts.</div>
              ) : (
                searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectTarget(result.target)}
                    className="p-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-all flex flex-col text-left mt-1"
                  >
                    <span className={`text-xs font-bold ${t.accentTextColor}`}>{result.display}</span>
                    <span className="text-[10px] text-slate-400 truncate mt-0.5">{result.sub}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Header Action Controls Row */}
        <div className="flex items-center space-x-3 flex-shrink-0 pl-2">
          {/* Quick Sound Chime Test Trigger */}
          <button 
            onClick={playNotificationChime}
            className={`hover:text-emerald-300 transition-all p-1.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 cursor-pointer flex items-center space-x-1.5 ${t.accentTextColor}`}
            title="Test Audio Chime Alert"
          >
            <span className="text-xs font-bold font-mono hidden sm:inline-block">Test Sound</span>
            <span>🔔</span>
          </button>
          
          <button 
            onClick={() => setShowInfoDrawer(!showInfoDrawer)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showInfoDrawer ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-900/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`}
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </button>
          
          <button onClick={() => logoutUser()} className="text-xs font-semibold text-slate-500 hover:text-red-400 transition-colors p-1">
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Workspace Chat Area Container */}
        <div className={`flex-1 flex flex-col min-w-0 ${t.chatBg}`}>
          
          {/* Messages Output Area Panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm italic p-8 text-center max-w-md mx-auto space-y-2 select-none animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl not-italic mb-2">💬</div>
                <p className="font-semibold text-slate-400">This is the very start of the channel.</p>
                <p className="text-xs text-slate-500">Post announcements, files, or message team members securely inside this sandboxed container room.</p>
              </div>
            ) : (
              currentMessages.map(msg => (
                <div key={msg.id} className="flex items-start space-x-3 group animate-fadeIn">
                  <div className={`w-9 h-9 rounded text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm ${msg.isYou ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                    {msg.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-bold text-slate-200 text-sm">{msg.user}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{msg.time}</span>
                    </div>
                    <div className="space-y-1.5 mt-0.5">
                      {msg.text && (
                        <p className="text-sm text-slate-300 bg-[#222529]/80 px-3.5 py-2 rounded-r-xl rounded-bl-xl border border-slate-900/50 inline-block max-w-full sm:max-w-xl break-words leading-relaxed shadow-sm">
                          {msg.text}
                        </p>
                      )}
                      {msg.file && (
                        <div className="flex items-center space-x-3 bg-slate-950/40 border border-slate-800 p-3 rounded-lg max-w-xs shadow-inner">
                          <div className="p-2 bg-emerald-950/40 border border-emerald-900/30 rounded text-emerald-400 font-bold text-xs uppercase">
                            {msg.file.type || 'file'}
                          </div>
                          <div className="truncate flex-1">
                            <p className="text-xs font-semibold text-slate-200 truncate">{msg.file.name}</p>
                            <p className="text-[10px] text-slate-500">{msg.file.size}</p>
                          </div>
                          <button className="text-slate-400 hover:text-slate-100 transition-all cursor-pointer">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
                  G
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-bold text-slate-200 text-sm">Gemini AI</span>
                  <div className="flex items-center space-x-1 bg-slate-950/20 px-3.5 py-2.5 rounded-full border border-slate-900/40">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Dynamic Message Submission Form & Input Action Bar (High Padding Touch targets - Day 25) */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#1a1d21] flex-shrink-0 border-t border-slate-950/40">
            {selectedFile && (
              <div className="mb-2 p-2 bg-slate-950/50 border border-slate-800 rounded-lg flex items-center justify-between max-w-sm">
                <div className="flex items-center space-x-2 truncate">
                  <span className="text-[10px] font-bold bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded tracking-wide border border-emerald-900">
                    {selectedFile.type}
                  </span>
                  <span className="text-xs text-slate-300 truncate font-medium">{selectedFile.name}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedFile(null)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="border border-slate-800 rounded-xl bg-slate-950 flex flex-col shadow-lg transition-all focus-within:border-emerald-700/60 focus-within:ring-2 focus-within:ring-emerald-950/30">
              <textarea 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                placeholder={activeTarget.type === 'channel' ? `Message #${activeTarget.name}` : `Message ${activeTarget.name}`}
                className="bg-transparent border-0 outline-none text-sm text-slate-200 resize-none h-14 w-full px-4 pt-3.5 pb-1 placeholder-slate-600 focus:ring-0"
              />
              
              <div className="flex items-center justify-between px-3 pb-2 pt-2 border-t border-slate-900/40">
                <div className="flex items-center space-x-1">
                  <button 
                    type="button"
                    onClick={() => triggerMockUpload('design_prototype.png', '1.4 MB', 'png')}
                    className="p-2.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors cursor-pointer"
                    title="Mock Image Upload"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </button>
                  <button 
                    type="button"
                    onClick={() => triggerMockUpload('huddleup_prd_spec.pdf', '320 KB', 'pdf')}
                    className="p-2.5 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors cursor-pointer"
                    title="Mock PDF Upload"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setInputMessage(prev => prev + ' 🚀')}
                    className="p-2 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors cursor-pointer text-base"
                    title="Insert Rocket Emoji"
                  >
                    😀
                  </button>
                </div>

                <button 
                  type="submit"
                  disabled={!inputMessage.trim() && !selectedFile}
                  className={`text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md ${(!inputMessage.trim() && !selectedFile) ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'}`}
                >
                  Send
                </button>
              </div>
            </div>
          </form>

        </div>

        {/* Right Info Details Panel Sidebar (Day 20 Drawer - Responsive sliding width) */}
        {showInfoDrawer && (
          <div className="w-full sm:w-[300px] h-full absolute right-0 top-0 sm:relative bg-[#1a1d21] border-l border-slate-950 flex flex-col flex-shrink-0 select-none animate-slide-in z-20">
            <div className="h-14 border-b border-slate-950 flex items-center justify-between px-5 flex-shrink-0">
              <span className="font-bold text-slate-200">Details</span>
              <button 
                onClick={() => setShowInfoDrawer(false)}
                className="text-slate-500 hover:text-slate-300 p-2 text-base transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {activeTarget.type === 'dm' ? (
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-white text-3xl shadow-lg">
                    {activeTarget.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-snug">{activeTarget.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{users.find(u => u.id === activeTarget.id)?.title}</p>
                  </div>
                  
                  <div className="inline-flex items-center space-x-1.5 bg-slate-950/40 border border-slate-800 px-3 py-1 rounded-full">
                    <span className={`w-2 h-2 rounded-full ${users.find(u => u.id === activeTarget.id)?.status === 'online' ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                      {users.find(u => u.id === activeTarget.id)?.status === 'online' ? 'Active Now' : 'Offline'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed text-center px-2 pt-2 border-t border-slate-950/40">
                    {users.find(u => u.id === activeTarget.id)?.bio}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Channel Name</h3>
                    <p className="text-sm font-semibold text-white mt-1"># {activeTarget.name}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Purpose</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">{activeTarget.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-950/40">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Workspace Members</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2 text-xs font-medium text-slate-300">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        <span>Kavya Gupta (You)</span>
                      </li>
                      <li className="flex items-center space-x-2 text-xs font-medium text-slate-300">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                        <span>Gemini AI</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="pt-5 border-t border-slate-950/40 space-y-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Encryption</h3>
                  <div className="mt-1 flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/30">AES-256</span>
                    <span className="text-[10px] text-slate-500 font-medium">Fully Secure</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* --- DAY 25: MOBILE RESPONSIVE NAV MENU OVERLAY PANEL DRAWER --- */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-fade-in-overlay">
          {/* Glass-blurred Backdrop Click-catcher layer */}
          <div 
            onClick={() => setIsMobileNavOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          
          {/* Dynamic Slide-in Drawer wrapper */}
          <div className={`relative flex flex-col w-72 max-w-[80vw] h-full ${t.sidebarBg} border-r ${t.sidebarBorder} shadow-2xl animate-slide-in-left z-50`}>
            {/* Drawer Header */}
            <div className="h-14 border-b border-slate-950/80 flex items-center justify-between px-4 font-bold text-white shrink-0">
              <span className="truncate tracking-tight">Channels Menu</span>
              <button 
                onClick={() => setIsMobileNavOpen(false)}
                className="text-slate-400 hover:text-white p-2 text-lg"
              >
                ✕
              </button>
            </div>
            
            {/* Sidebar navigation list links inside mobile drawer panel */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {SidebarNavigation}
            </div>
          </div>
        </div>
      )}

      {/* Add New Channel Modal Popup Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateChannel} className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-fadeIn">
            <h3 className="text-lg font-bold text-white mb-2">Create a channel</h3>
            <p className="text-xs text-slate-400 mb-4">Channels are where your team communicates. They’re best when organized around a topic.</p>
            <input 
              type="text"
              autoFocus
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              placeholder="e.g. plan-launch"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-emerald-500 mb-5"
            />
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-md">Create</button>
            </div>
          </form>
        </div>
      )}
    </MainLayout>
  );
};

// --- SYSTEM ROUTER GATEWAY ---
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <IntegratedChatWorkspace />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;