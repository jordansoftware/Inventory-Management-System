import React, { useState } from 'react';
import { Cpu, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, translations } from '../translations';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  language: Language;
}

const Login: React.FC<LoginProps> = ({ onLogin, language }) => {
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simulated login logic
    if (email === 'admin@ims.com' && password === 'admin123') {
      onLogin({
        id: '1',
        name: 'Admin User',
        email: 'admin@ims.com',
        role: 'Admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      });
    } else if (email === 'user@ims.com' && password === 'user123') {
      onLogin({
        id: '3',
        name: 'Lisa Schmidt',
        email: 'lisa@ims.com',
        role: 'Employee',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa'
      });
    } else {
      setError(t.wrongCredentials);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-8 text-center">
            <div className="inline-flex w-16 h-16 bg-indigo-600 rounded-2xl items-center justify-center text-white mb-4 shadow-lg shadow-indigo-900/20">
              <Cpu size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">IMS Inventory</h1>
            <p className="text-slate-400 text-sm mt-2">{t.login}</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t.email}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ims.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">{t.password}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
            >
              {t.signIn}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-4 text-center space-y-2">
              <p className="text-xs text-slate-400 font-medium italic">Simulation Roles:</p>
              <div className="flex justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <button type="button" onClick={() => { setEmail('admin@ims.com'); setPassword('admin123'); }} className="hover:text-indigo-600">Admin</button>
                <span>|</span>
                <button type="button" onClick={() => { setEmail('user@ims.com'); setPassword('user123'); }} className="hover:text-indigo-600">User</button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
