import React, { useState } from 'react';

const ChannelList = () => {
  // 1. Dynamic Channels State List Array
  const [channels, setChannels] = useState([
    { id: 'ch1', name: 'general', unread: false },
    { id: 'ch2', name: 'random', unread: true },
    { id: 'ch3', name: 'project-huddleup', unread: false },
  ]);

  // 2. Dynamic Direct Messages State List Array
  const [directMessages, setDirectMessages] = useState([
    { id: 'u1', name: 'Kavya Gupta', status: 'online', isYou: true },
    { id: 'u2', name: 'Gemini AI', status: 'online', isYou: false },
    { id: 'u3', name: 'Project Evaluator', status: 'offline', isYou: false },
  ]);

  // Track the active selected chat item
  const [activeId, setActiveId] = useState('ch1');

  return (
    <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6 select-none">
      {/* Channels Section */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-2 uppercase tracking-wider">
          <span>Channels</span>
          <button className="hover:text-slate-200 text-sm font-bold transition-colors">＋</button>
        </div>
        <ul className="mt-2 space-y-0.5">
          {channels.map((channel) => (
            <li
              key={channel.id}
              onClick={() => setActiveId(channel.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all flex items-center justify-between ${
                activeId === channel.id
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span className="truncate"># {channel.name}</span>
              {channel.unread && activeId !== channel.id && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 block flex-shrink-0 ml-2 shadow-glow"></span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Direct Messages Section */}
      <div>
        <div className="text-xs font-semibold text-slate-500 px-2 uppercase tracking-wider">
          Direct Messages
        </div>
        <ul className="mt-2 space-y-0.5">
          {directMessages.map((user) => (
            <li
              key={user.id}
              onClick={() => setActiveId(user.id)}
              className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all flex items-center space-x-2.5 ${
                activeId === user.id
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              {/* Status Indicator Dot */}
              <span
                className={`w-2 h-2 rounded-full block flex-shrink-0 ${
                  user.status === 'online' ? 'bg-emerald-400' : 'bg-slate-600'
                }`}
              ></span>
              <span className="truncate">
                {user.name} {user.isYou && <span className="text-xs opacity-60">(you)</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChannelList;