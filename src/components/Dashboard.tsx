import React from 'react';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { InventoryItem } from '../types';
import { Language, translations } from '../translations';

interface DashboardProps {
  inventory: InventoryItem[];
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ inventory, language }) => {
  const t = translations[language];
  
  const stats = [
    { label: t.totalStock, value: inventory.reduce((a, b) => a + b.quantity, 0), icon: Package, color: 'indigo', trend: '+12%' },
    { label: t.articleTypes, value: new Set(inventory.map(i => i.type)).size, icon: Activity, color: 'emerald', trend: '+2' },
    { label: t.stockAlerts, value: 3, icon: AlertTriangle, color: 'rose', trend: '-1' },
    { label: t.todayEntries, value: inventory.filter(i => new Date(i.timestamp).toDateString() === new Date().toDateString()).length, icon: TrendingUp, color: 'amber', trend: '+5' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.dashboard}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{t.welcomeBack}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {stat.trend}
                {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">{t.recentActivities}</h3>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">{t.viewAll}</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <Activity size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                    <span className="font-bold">Max Mustermann</span> {language === 'fr' ? 'a ajouté' : language === 'en' ? 'added' : 'hat hinzugefügt'} 10x RAM
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{language === 'fr' ? 'Il y a 5 minutes' : language === 'en' ? '5 mins ago' : 'Vor 5 Minuten'} • Lager A</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">{t.stockDistribution}</h3>
            <select className="text-xs font-bold bg-slate-50 dark:bg-slate-900 border-none rounded-lg px-2 py-1 focus:ring-0 text-slate-900 dark:text-slate-100">
              <option>{t.byCategory}</option>
              <option>{t.byLocation}</option>
            </select>
          </div>
          <div className="space-y-6">
            {['RAM', 'SSD', 'CPU', 'GPU'].map((type) => {
              const count = inventory.filter(item => item.type === type).reduce((a, b) => a + b.quantity, 0);
              const total = inventory.reduce((a, b) => a + b.quantity, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{type}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{count} {t.articles.substring(0, 3)}.</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
