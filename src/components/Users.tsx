import React, { useState, useEffect, useRef } from 'react';
import { Shield, Mail, MoreVertical, Plus, UserPlus, Trash2, UserCog, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { Language, translations } from '../translations';

interface UsersProps {
  language: Language;
  currentUser: User;
}

const Users: React.FC<UsersProps> = ({ language, currentUser }) => {
  const t = translations[language];
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('it_pro_users');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Admin User', email: 'admin@it-pro.de', role: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
      { id: '2', name: 'Max Mustermann', email: 'max@it-pro.de', role: 'Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max' },
      { id: '3', name: 'Lisa Schmidt', email: 'lisa@it-pro.de', role: 'Employee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' },
      { id: '4', name: 'Kevin Klein', email: 'kevin@it-pro.de', role: 'Employee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin' },
    ];
  });

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Employee' });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('it_pro_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const userToAdd: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`
    };

    setUsers(prev => [...prev, userToAdd]);
    setNewUser({ name: '', email: '', role: 'Employee' });
    setIsAddingUser(false);
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser.id) return; // Cannot delete self
    setUsers(users.filter(u => u.id !== id));
    setActiveMenu(null);
  };

  const handleChangeRole = (id: string, newRole: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole as any } : u));
    setActiveMenu(null);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'Manager': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'Admin': return t.admin;
      case 'Manager': return t.manager;
      default: return t.employee;
    }
  };

  const getPermissionLabel = (role: string) => {
    return role === 'Admin' ? t.fullAccess : role === 'Manager' ? t.limitedAccess : t.readOnly;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            {language === 'fr' ? 'Gestion des utilisateurs' : language === 'en' ? 'User Management' : 'Benutzerverwaltung'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {language === 'fr' ? 'Gérez les membres de l\'équipe et leurs permissions.' : language === 'en' ? 'Manage team members and their permissions.' : 'Verwalten Sie Teammitglieder und deren Berechtigungen.'}
          </p>
        </div>
        <button 
          onClick={() => setIsAddingUser(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 group cursor-pointer"
        >
          <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
          <span>{t.inviteUser}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <motion.div 
            layout
            key={user.id} 
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all group relative"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-50 dark:border-slate-800 shadow-sm relative group-hover:scale-105 transition-transform">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                  className={`p-2 rounded-xl transition-all ${
                    activeMenu === user.id 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' 
                      : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900'
                  } opacity-0 group-hover:opacity-100`}
                >
                  <MoreVertical size={18} />
                </button>

                <AnimatePresence>
                  {activeMenu === user.id && (
                    <motion.div
                      ref={menuRef}
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-1.5 space-y-1">
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.changeRole}</div>
                        {(['Admin', 'Manager', 'Employee'] as const).map(role => (
                          <button
                            key={role}
                            onClick={() => handleChangeRole(user.id, role)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                              user.role === role 
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' 
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Shield size={14} className={user.role === role ? 'text-indigo-600' : 'text-slate-400'} />
                              {getRoleLabel(role)}
                            </div>
                            {user.role === role && <Check size={14} />}
                          </button>
                        ))}
                        
                        {user.id !== currentUser.id && (
                          <>
                            <div className="h-px bg-slate-100 dark:bg-slate-700 mx-2 my-1" />
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                            >
                              <Trash2 size={14} />
                              {t.deleteUser}
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.name}</h3>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
                  <Mail size={14} className="shrink-0" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getRoleBadge(user.role)}`}>
                  {getRoleLabel(user.role)}
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                  <Shield size={12} />
                  {getPermissionLabel(user.role)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        <button 
          onClick={() => setIsAddingUser(true)}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group font-bold min-h-[220px]"
        >
          <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 group-hover:scale-110 transition-all shadow-sm">
            <Plus size={28} />
          </div>
          <span className="text-sm tracking-wide">
            {t.addUser}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isAddingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingUser(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{t.addUser}</h3>
                <button 
                  onClick={() => setIsAddingUser(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t.userName}</label>
                  <input
                    autoFocus
                    required
                    type="text"
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t.email}</label>
                  <input
                    required
                    type="email"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t.role}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Admin', 'Manager', 'Employee'] as const).map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setNewUser({ ...newUser, role })}
                        className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                          newUser.role === role 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                            : 'bg-transparent border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                        }`}
                      >
                        {getRoleLabel(role)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 group"
                  >
                    <Check size={20} className="group-hover:scale-110 transition-transform" />
                    <span>{t.createUser}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Users;
