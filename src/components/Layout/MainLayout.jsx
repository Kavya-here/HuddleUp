import React from 'react';
import { useAuth } from '../../context/AuthContext';

const MainLayout = ({ children, sidebarContent }) => {
  const { logoutUser } = useAuth();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      
      {/* 1. Leftmost Activity Rail (Icons) */}
      <div className="w-16 h-full bg-slate-950 flex flex-col items-center py-4 border-r border-slate-900/50 space-y-4 flex-shrink-0">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-white cursor-pointer hover:opacity-90">
          H
        </div>
        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-medium text-slate-400 cursor-pointer hover:bg-slate-700 hover:text-white transition-colors">
          💬
        </div>
      </div>

      {/* 2. Primary Navigation Sidebar Panel */}
      <div className="w-64 h-full bg-slate-900 border-r border-slate-900/50 flex flex-col shrink-0">
        <div className="h-14 border-b border-slate-950 flex items-center justify-between px-4 font-bold text-white">
          <span>HuddleUp Workspace</span>
        </div>
        
        {/* Inject dynamic dynamic sidebar content list here */}
        {sidebarContent}
      </div>

      {/* 3. Primary Workspace Chat Window View Area */}
      <div className="flex-1 h-full flex flex-col bg-slate-900">
        {children}
      </div>

    </div>
  );
};

export default MainLayout;