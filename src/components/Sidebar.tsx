import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  MessageSquare, 
  Users as UsersIcon, 
  Settings,
  LogOut,
  Cpu,
  Sun,
  Moon
} from 'lucide-react';
import { Language, translations } from '../translations';

import { User as UserType } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  currentUser: UserType;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isDarkMode, toggleDarkMode, language, currentUser, onLogout }) => {
  const t = translations[language];
  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'inventory', label: t.inventory, icon: Package },
    { id: 'sessions', label: t.sessions, icon: History },
    { id: 'chat', label: t.chat, icon: MessageSquare },
  ];

  if (currentUser.role === 'Admin') {
    menuItems.push({ id: 'users', label: t.users, icon: UsersIcon });
    menuItems.push({ id: 'categories', label: t.categories, icon: Settings });
  }

  return (
    <aside className="w-64 bg-white dark:bg-black border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-20 transition-colors duration-500">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
          <Cpu size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">IMS</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all">
          <Settings size={20} />
          {t.settings}
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
        >
          <LogOut size={20} />
          {t.logout}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
