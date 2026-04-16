import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Zap, ChevronDown, Cpu, HardDrive, Cpu as Processor, Monitor, Layout, ArrowLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductType, InventoryItem, ProductDefinition } from '../types';
import { LOCATIONS, SUGGESTIONS } from '../constants';
import { Language, translations } from '../translations';
import RAMEntryWizard from './RAMEntryWizard';
import CPUEntryWizard from './CPUEntryWizard';
import MainboardEntryWizard from './MainboardEntryWizard';

const TYPE_ICONS: Record<string, any> = {
  'RAM': Cpu,
  'SSD': HardDrive,
  'CPU': Processor,
  'GPU': Monitor,
  'Mainboard': Layout
};

const TYPE_COLORS: Record<string, string> = {
  'RAM': 'bg-indigo-500',
  'SSD': 'bg-amber-500',
  'CPU': 'bg-emerald-500',
  'GPU': 'bg-rose-500',
  'Mainboard': 'bg-violet-500'
};

interface QuickEntryProps {
  onAdd: (item: Omit<InventoryItem, 'id' | 'timestamp' | 'addedBy'>) => void;
  language: Language;
  definitions: ProductDefinition[];
}

const QuickEntry: React.FC<QuickEntryProps> = ({ onAdd, language, definitions }) => {
  const [type, setType] = useState<ProductType | null>(null);
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(1);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [showSuggestions, setShowSuggestions] = useState<string | null>(null);
  const t = translations[language];

  const quantityRef = useRef<HTMLInputElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const currentDef = type ? definitions.find(d => d.type === type) : null;

  useEffect(() => {
    if (!type || type === 'RAM' || type === 'CPU' || type === 'Mainboard') return; // Handled by wizard

    const initialAttrs: Record<string, string> = {};
    currentDef?.attributes.forEach(attr => {
      initialAttrs[attr.id] = attributes[attr.id] || '';
    });
    setAttributes(initialAttrs);
    
    setTimeout(() => firstInputRef.current?.focus(), 100);
  }, [type]);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleAdd = () => {
    if (!currentDef) return;
    const newErrors: Record<string, boolean> = {};
    currentDef.attributes.forEach(attr => {
      if (!attributes[attr.id]) {
        newErrors[attr.id] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onAdd({
      type: type!,
      attributes: { ...attributes },
      quantity,
      location
    });

    setQuantity(1);
    quantityRef.current?.focus();
  };

  const handleInputChange = (id: string, value: string) => {
    setAttributes(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="space-y-6">
      {/* POS Selection Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-5 bg-slate-900 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">{t.quickEntryPos}</h2>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold">{t.selectCategory}</p>
              </div>
            </div>
            {type && (
              <button 
                onClick={() => setType(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 border border-white/5"
              >
                <ArrowLeft size={14} />
                {t.change}
              </button>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className={`grid gap-3 transition-all duration-500 ${type ? 'grid-cols-5' : 'grid-cols-2 sm:grid-cols-3'}`}>
            {definitions.map(def => {
              const Icon = TYPE_ICONS[def.type] || Cpu;
              const color = TYPE_COLORS[def.type] || 'bg-slate-500';
              const isActive = type === def.type;
              
              return (
                <button
                  key={def.type}
                  onClick={() => setType(def.type)}
                  className={`group relative flex flex-col items-center justify-center transition-all duration-300 rounded-2xl border-2 ${
                    isActive 
                      ? 'border-indigo-500 bg-white dark:bg-slate-800 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 ring-4 ring-indigo-500/5' 
                      : 'border-transparent bg-white dark:bg-slate-800 hover:border-indigo-200 hover:shadow-md'
                  } ${type ? 'p-2' : 'p-5'}`}
                >
                  <div className={`rounded-xl ${color} flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                    type ? 'w-8 h-8 mb-1' : 'w-12 h-12 mb-3 group-hover:scale-110 group-hover:rotate-3'
                  }`}>
                    <Icon size={type ? 16 : 24} />
                  </div>
                  <span className={`font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-all ${type ? 'text-[9px]' : 'text-xs'}`}>
                    {def.type}
                  </span>
                  {!type && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Plus size={12} className="text-white" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lower Section (Entry Form/Wizard) */}
      <AnimatePresence mode="wait">
        {type && (
          <motion.div
            key={type}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              {type === 'RAM' ? (
                <RAMEntryWizard onAdd={onAdd} location={location} language={language} />
              ) : type === 'CPU' ? (
                <CPUEntryWizard onAdd={onAdd} location={location} language={language} />
              ) : type === 'Mainboard' ? (
                <MainboardEntryWizard onAdd={onAdd} location={location} language={language} />
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <div className={`p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${TYPE_COLORS[type] || 'bg-indigo-600'} text-white rounded-xl shadow-lg`}>
                        {React.createElement(TYPE_ICONS[type] || Cpu, { size: 18 })}
                      </div>
                      <div>
                        <h2 className="font-bold text-sm text-white">{type} {t.entry}</h2>
                        <p className="text-[10px] text-slate-400 font-medium">{t.fillDetails}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.liveMode}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-5">
                      {currentDef?.attributes.map((attr, index) => (
                        <div key={attr.id} className="relative">
                          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 block">
                            {attr.label}
                            {errors[attr.id] && <span className="ml-2 text-red-500 normal-case font-medium">{t.required}</span>}
                          </label>
                          {attr.type === 'select' ? (
                            <div className="relative">
                              <select
                                value={attributes[attr.id] || ''}
                                onChange={(e) => handleInputChange(attr.id, e.target.value)}
                                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 appearance-none transition-all font-medium text-slate-900 dark:text-slate-100 ${
                                  errors[attr.id] ? 'border-red-300 bg-red-50/30 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <option value="">{t.choose}...</option>
                                {attr.options?.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${errors[attr.id] ? 'text-red-400' : 'text-slate-400'}`} size={16} />
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                ref={index === 0 ? firstInputRef : null}
                                type="text"
                                placeholder={attr.placeholder}
                                value={attributes[attr.id] || ''}
                                onChange={(e) => {
                                  handleInputChange(attr.id, e.target.value);
                                  setShowSuggestions(attr.id);
                                }}
                                onFocus={() => setShowSuggestions(attr.id)}
                                onBlur={() => setTimeout(() => setShowSuggestions(null), 200)}
                                onKeyDown={handleKeyDown}
                                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-slate-100 ${
                                  errors[attr.id] ? 'border-red-300 bg-red-50/30 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700'
                                }`}
                              />
                              {showSuggestions === attr.id && SUGGESTIONS[attr.id] && (
                                <div className="absolute z-30 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto p-1 animate-in fade-in slide-in-from-top-2">
                                  {SUGGESTIONS[attr.id]
                                    .filter(s => s.toLowerCase().includes((attributes[attr.id] || '').toLowerCase()))
                                    .map(s => (
                                      <button
                                        key={s}
                                        onClick={() => {
                                          handleInputChange(attr.id, s);
                                          setShowSuggestions(null);
                                        }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors font-medium text-slate-700 dark:text-slate-200"
                                      >
                                        {s}
                                      </button>
                                    ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{t.quantity}</label>
                        <input
                          ref={quantityRef}
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          onKeyDown={handleKeyDown}
                          className="w-full bg-transparent border-none p-0 text-lg focus:ring-0 font-black text-indigo-600 dark:text-indigo-400"
                        />
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{t.location}</label>
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 font-bold text-slate-700 dark:text-slate-200 appearance-none"
                        >
                          {LOCATIONS.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleAdd}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                    >
                      <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                      {t.addToStock}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!type && (
        <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
          <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" />
          <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
            {t.quickEntryTip}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickEntry;
