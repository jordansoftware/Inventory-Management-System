import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  History, 
  MessageSquare, 
  Users as UsersIcon, 
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InventoryItem, ChatMessage, User, ActivityLog, ProductType, ProductDefinition } from './types';
import { PRODUCT_DEFINITIONS, LOCATIONS } from './constants';
import { translations, Language } from './translations';

// Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import QuickEntry from './components/QuickEntry';
import SessionList from './components/SessionList';
import Chat from './components/Chat';
import Users from './components/Users';
import Login from './components/Login';

import CategoryManager from './components/CategoryManager';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sessionItems, setSessionItems] = useState<InventoryItem[]>([]);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language;
      if (['fr', 'en', 'de'].includes(saved)) return saved;
      // Default to English if no saved preference
      return 'en';
    }
    return 'en';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [productDefinitions, setProductDefinitions] = useState<ProductDefinition[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('productDefinitions');
      return saved ? JSON.parse(saved) : PRODUCT_DEFINITIONS;
    }
    return PRODUCT_DEFINITIONS;
  });

  useEffect(() => {
    localStorage.setItem('productDefinitions', JSON.stringify(productDefinitions));
  }, [productDefinitions]);

  const [toasts, setToasts] = useState<{id: string, message: string}[]>([]);

  const t = translations[language];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addToast = (message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleAddItem = (item: Omit<InventoryItem, 'id' | 'timestamp' | 'addedBy'>) => {
    // Helper to compare attributes deeply but safely
    const areAttributesEqual = (a: any, b: any) => {
      const keysA = Object.keys(a).sort();
      const keysB = Object.keys(b).sort();
      if (keysA.length !== keysB.length) return false;
      return keysA.every(key => a[key] === b[key]);
    };

    // Check for duplicate in inventory
    const existingInvIndex = inventory.findIndex(i => 
      i.type === item.type && areAttributesEqual(i.attributes, item.attributes)
    );

    if (existingInvIndex !== -1) {
      // Merge: Update quantity of existing item in inventory
      const updatedInventory = [...inventory];
      const existingItem = { ...updatedInventory[existingInvIndex] };
      
      existingItem.quantity += item.quantity;
      existingItem.timestamp = Date.now();
      updatedInventory[existingInvIndex] = existingItem;
      setInventory(updatedInventory);
      
      // Also update or add to session items
      const sessionIndex = sessionItems.findIndex(i => i.id === existingItem.id);
      if (sessionIndex !== -1) {
        const updatedSession = [...sessionItems];
        updatedSession[sessionIndex] = {
          ...updatedSession[sessionIndex],
          quantity: updatedSession[sessionIndex].quantity + item.quantity,
          timestamp: Date.now()
        };
        setSessionItems(updatedSession);
      } else {
        // If it was in inventory but not in current session, add it to session
        // We use the same ID to keep them linked
        setSessionItems(prev => [{ ...existingItem, quantity: item.quantity }, ...prev]);
      }
      
      addToast(`${item.type} Menge aktualisiert (+${item.quantity})`);
    } else {
      // Create new item
      const newItem: InventoryItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        addedBy: currentUser.name
      };
      setSessionItems(prev => [newItem, ...prev]);
      setInventory(prev => [newItem, ...prev]);
      addToast(`${item.type} hinzugefügt`);
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} language={language} />;
  }

  const handleBulkAdd = (items: Omit<InventoryItem, 'id' | 'timestamp' | 'addedBy'>[]) => {
    const newItems: InventoryItem[] = items.map(item => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      addedBy: currentUser.name
    }));
    
    setInventory(prev => [...newItems, ...prev]);
    setSessionItems(prev => [...newItems, ...prev]);
    addToast(`${items.length} ${t.articles} importiert`);
  };

  const handleDeleteSessionItem = (id: string) => {
    setSessionItems(prev => prev.filter(item => item.id !== id));
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateSessionItem = (id: string, updates: Partial<InventoryItem>) => {
    setSessionItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    setInventory(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  return (
    <div className={`flex h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-500 ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        language={language}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar 
          user={currentUser} 
          inventory={inventory} 
          searchTerm={globalSearchTerm}
          onSearchChange={setGlobalSearchTerm}
          onSearchSelect={(model) => {
            setGlobalSearchTerm(model);
            setActiveTab('inventory');
          }} 
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          language={language}
          setLanguage={setLanguage}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Dashboard inventory={inventory} language={language} />
              </motion.div>
            )}
            
            {activeTab === 'inventory' && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Inventory 
                  inventory={inventory} 
                  searchTerm={globalSearchTerm}
                  onSearchChange={setGlobalSearchTerm}
                  onBulkAdd={handleBulkAdd}
                  language={language}
                  currentUser={currentUser}
                  definitions={productDefinitions}
                />
              </motion.div>
            )}

            {activeTab === 'sessions' && (
              <motion.div
                key="sessions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <div className="lg:col-span-1">
                  <QuickEntry onAdd={handleAddItem} language={language} definitions={productDefinitions} />
                </div>
                <div className="lg:col-span-2">
                  <SessionList 
                    items={sessionItems} 
                    onDelete={handleDeleteSessionItem}
                    onUpdate={handleUpdateSessionItem}
                    language={language}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Chat currentUser={currentUser} language={language} />
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Users language={language} currentUser={currentUser} />
              </motion.div>
            )}
            {activeTab === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CategoryManager 
                  definitions={productDefinitions} 
                  onUpdate={setProductDefinitions} 
                  language={language}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-white/10"
            >
              <PlusCircle size={18} className="text-emerald-400" />
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
