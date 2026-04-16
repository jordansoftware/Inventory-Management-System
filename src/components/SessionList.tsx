import React, { useState } from 'react';
import { Trash2, Edit2, Check, X, Layers } from 'lucide-react';
import { InventoryItem, ProductType } from '../types';
import { Language, translations } from '../translations';

interface SessionListProps {
  items: InventoryItem[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<InventoryItem>) => void;
  language: Language;
}

const SessionList: React.FC<SessionListProps> = ({ items, onDelete, onUpdate, language }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const t = translations[language];

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Group items by type
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<ProductType, InventoryItem[]>);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.sessions}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t.realTimeList}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.totalCount}</div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{totalItems}</div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center transition-colors duration-300">
          <Layers className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t.noArticlesInSession}</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">{t.useQuickEntry}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.entries(groupedItems) as [ProductType, InventoryItem[]][]).map(([type, typeItems]) => (
            <div key={type} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {type} ({typeItems.length})
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {typeItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold border ${
                        item.type === 'RAM' 
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700'
                      }`}>
                        {item.type.substring(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-slate-100">
                            {item.type === 'RAM' 
                              ? `${(item.attributes as any).model} • ${(item.attributes as any).capacity}`
                              : Object.values(item.attributes).join(' • ')
                            }
                          </h4>
                          {item.type === 'RAM' && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                              (item.attributes as any).ramType === 'ECC' 
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}>
                              {(item.attributes as any).ramType}
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md font-bold uppercase">{t.new}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {item.type === 'RAM' 
                            ? `${(item.attributes as any).brand} • ${(item.attributes as any).frequency}MHz • ${(item.attributes as any).memoryType} • ${(item.attributes as any).rank || 'N/A'}`
                            : `${t.addedAt} ${new Date(item.timestamp).toLocaleTimeString()} • ${item.location}`
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.quantity}:</span>
                        {editingId === item.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 rounded-lg text-sm font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none"
                              autoFocus
                            />
                            <button 
                              onClick={() => {
                                onUpdate(item.id, { quantity: editValue });
                                setEditingId(null);
                              }}
                              className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => setEditingId(null)}
                              className="p-1 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-md"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-slate-900 dark:text-white">{item.quantity}</span>
                            <button 
                              onClick={() => {
                                setEditingId(item.id);
                                setEditValue(item.quantity);
                              }}
                              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionList;
