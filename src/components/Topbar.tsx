import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User as UserIcon, ChevronRight, X as CloseIcon, Sun, Moon } from 'lucide-react';
import { User, InventoryItem } from '../types';
import { RAM_DATA, CPU_DATA } from '../constants';
import { Language, translations } from '../translations';

interface TopbarProps {
  user: User;
  inventory: InventoryItem[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchSelect: (model: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Topbar: React.FC<TopbarProps> = ({ 
  user, 
  inventory, 
  searchTerm, 
  onSearchChange, 
  onSearchSelect, 
  isDarkMode, 
  toggleDarkMode,
  language,
  setLanguage
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Collect all unique model names from inventory and predefined data with their types
  const allModels = React.useMemo(() => {
    const modelsMap = new Map<string, string>(); // model -> type
    
    // From predefined data
    RAM_DATA.models.forEach(m => modelsMap.set(m.model, 'RAM'));
    CPU_DATA.models.forEach(m => modelsMap.set(m.model, 'CPU'));

    // From inventory
    inventory.forEach(item => {
      if (item.attributes.model) {
        modelsMap.set(item.attributes.model, item.type);
      }
    });

    return Array.from(modelsMap.entries()).map(([model, type]) => ({ model, type }));
  }, [inventory]);

  const suggestions = React.useMemo(() => {
    if (searchTerm.length < 2) return [];
    const lowerSearch = searchTerm.toLowerCase();
    
    const matches = allModels.filter(m => 
      m.model.toLowerCase().includes(lowerSearch) || 
      m.type.toLowerCase().includes(lowerSearch)
    );
    
    return matches.sort((a, b) => {
      const aLower = a.model.toLowerCase();
      const bLower = b.model.toLowerCase();
      const aStarts = aLower.startsWith(lowerSearch);
      const bStarts = bLower.startsWith(lowerSearch);
      
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.model.localeCompare(b.model);
    }).slice(0, 8);
  }, [searchTerm, allModels]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-20 transition-colors duration-500">
      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setShowSuggestions(false);
              onSearchSelect(searchTerm);
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-slate-100"
        />
        {searchTerm && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <CloseIcon size={16} />
          </button>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">{t.quickSearch}</p>
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSearchChange(suggestion.model);
                    setShowSuggestions(false);
                    onSearchSelect(suggestion.model);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400">{suggestion.model}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{suggestion.type}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-300 dark:group-hover:text-indigo-500" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="hidden md:flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
          {(['fr', 'en', 'de'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all uppercase ${
                language === lang 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <button 
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
          title={isDarkMode ? 'Mode Clair' : 'Mode Noir'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.role}</p>
          </div>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
