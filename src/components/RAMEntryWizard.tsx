import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  ChevronRight, 
  Info, 
  Server, 
  Cpu, 
  Database, 
  Layers, 
  Copy,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RAMType, RAMMemoryType, RAMRank, RAMAttributes, InventoryItem } from '../types';
import { RAM_DATA } from '../constants';
import { Language, translations } from '../translations';

interface RAMEntryWizardProps {
  onAdd: (item: Omit<InventoryItem, 'id' | 'timestamp' | 'addedBy'>) => void;
  location: string;
  language: Language;
}

const RAMEntryWizard: React.FC<RAMEntryWizardProps> = ({ onAdd, location, language }) => {
  const [step, setStep] = useState(1);
  const t = translations[language];
  const [attrs, setAttrs] = useState<Partial<RAMAttributes>>({
    ramType: undefined,
    memoryType: undefined,
    rank: undefined,
    brand: '',
    frequency: '',
    model: '',
    capacity: ''
  });
  const [quantity, setQuantity] = useState(1);
  const [lastEntry, setLastEntry] = useState<Partial<RAMAttributes> | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);

  const quantityRef = useRef<HTMLInputElement>(null);
  const manualModelRef = useRef<HTMLInputElement>(null);

  const handleSelect = (field: keyof RAMAttributes, value: any) => {
    setAttrs(prev => {
      const newAttrs = { ...prev, [field]: value };
      
      // Reset dependent fields
      if (field === 'brand') {
        newAttrs.capacity = '';
        newAttrs.ramType = undefined;
        newAttrs.memoryType = undefined;
        newAttrs.rank = undefined;
        newAttrs.frequency = '';
        newAttrs.model = '';
        setIsManualEntry(false);
      }
      if (field === 'capacity') {
        newAttrs.ramType = undefined;
        newAttrs.memoryType = undefined;
        newAttrs.rank = undefined;
        newAttrs.frequency = '';
        newAttrs.model = '';
        setIsManualEntry(false);
      }
      if (field === 'ramType') {
        newAttrs.memoryType = undefined;
        newAttrs.rank = undefined;
        newAttrs.frequency = '';
        newAttrs.model = '';
        setIsManualEntry(false);
      }
      if (field === 'memoryType') {
        newAttrs.rank = undefined;
        newAttrs.frequency = '';
        newAttrs.model = '';
        setIsManualEntry(false);
      }
      if (field === 'frequency') {
        newAttrs.model = '';
        setIsManualEntry(false);
      }
      
      return newAttrs;
    });
    
    // Auto-advance logic
    if (step < 7) setStep(prev => prev + 1);
  };

  const filteredModels = RAM_DATA.models.filter(m => {
    if (attrs.brand && m.brand !== attrs.brand) return false;
    if (attrs.capacity && m.capacity !== attrs.capacity) return false;
    if (attrs.ramType && m.type !== attrs.ramType) return false;
    if (attrs.memoryType && m.memoryType !== attrs.memoryType) return false;
    if (attrs.frequency && m.frequency !== attrs.frequency) return false;
    if (attrs.rank && m.rank !== attrs.rank) return false;
    return true;
  });

  // Helper to get available options for current filters
  const getAvailableOptions = (field: keyof RAMAttributes) => {
    const filtered = RAM_DATA.models.filter(m => {
      if (attrs.brand && m.brand !== attrs.brand) return false;
      if (field !== 'capacity' && attrs.capacity && m.capacity !== attrs.capacity) return false;
      if (field !== 'ramType' && attrs.ramType && m.type !== attrs.ramType) return false;
      if (field !== 'memoryType' && attrs.memoryType && m.memoryType !== attrs.memoryType) return false;
      if (field !== 'frequency' && attrs.frequency && m.frequency !== attrs.frequency) return false;
      return true;
    });

    if (field === 'capacity') return Array.from(new Set(filtered.map(m => m.capacity)));
    if (field === 'ramType') return Array.from(new Set(filtered.map(m => m.type)));
    if (field === 'memoryType') return Array.from(new Set(filtered.map(m => m.memoryType)));
    if (field === 'frequency') return Array.from(new Set(filtered.map(m => m.frequency)));
    return [];
  };

  const canSubmit = attrs.ramType && attrs.memoryType && attrs.brand && attrs.frequency && attrs.model && attrs.capacity;

  const isDuplicate = () => {
    // This is a simple check against the last entry for demo purposes
    if (!lastEntry) return false;
    return JSON.stringify(attrs) === JSON.stringify(lastEntry);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    
    onAdd({
      type: 'RAM',
      attributes: attrs as any,
      quantity,
      location
    });

    setLastEntry({ ...attrs });
    setQuantity(1);
    // Keep selections for fast entry, but maybe jump back to quantity or model
    setStep(7); 
    setTimeout(() => quantityRef.current?.focus(), 100);
  };

  const handleClone = () => {
    if (lastEntry) {
      setAttrs({ ...lastEntry });
      setStep(7);
    }
  };

  const getStepStatus = (s: number) => {
    if (step > s) return 'completed';
    if (step === s) return 'active';
    return 'pending';
  };

  const renderStepIndicator = () => (
    <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2 no-scrollbar">
      {[1, 2, 3, 4, 5, 6, 7].map((s) => (
        <React.Fragment key={s}>
          <div 
            onClick={() => step >= s && setStep(s)}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
              getStepStatus(s) === 'completed' ? 'bg-emerald-500 text-white' :
              getStepStatus(s) === 'active' ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
              'bg-slate-100 text-slate-400'
            }`}
          >
            {getStepStatus(s) === 'completed' ? <Check size={14} /> : s}
          </div>
          {s < 7 && <div className={`w-4 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-slate-100'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full sticky top-6">
      <div className={`p-5 border-b border-slate-100 flex items-center justify-between ${attrs.ramType === 'ECC' ? 'bg-indigo-50/50' : 'bg-slate-50'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${attrs.ramType === 'ECC' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
            <Server size={18} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">{t.advancedRamEntry}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              {attrs.ramType && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  attrs.ramType === 'ECC' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {attrs.ramType} {attrs.memoryType !== 'Standard' ? attrs.memoryType : ''}
                </span>
              )}
            </div>
          </div>
        </div>
        {lastEntry && (
          <button 
            onClick={handleClone}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all"
          >
            <Copy size={14} />
            {t.lastCloned}
          </button>
        )}
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {renderStepIndicator()}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">1. {t.brand}</h3>
              <div className="grid grid-cols-2 gap-2">
                {RAM_DATA.brands.map(b => (
                  <button
                    key={b}
                    onClick={() => handleSelect('brand', b)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      attrs.brand === b ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">2. {t.capacity}</h3>
              <div className="grid grid-cols-2 gap-2">
                {getAvailableOptions('capacity').map(c => (
                  <button
                    key={c}
                    onClick={() => handleSelect('capacity', c)}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                      attrs.capacity === c ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">3. {t.choose} RAM Typ</h3>
              <div className="grid grid-cols-1 gap-3">
                {getAvailableOptions('ramType').map(type => (
                  <button
                    key={type}
                    onClick={() => handleSelect('ramType', type)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      attrs.ramType === type ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{type === 'ECC' ? 'ECC (Server/Workstation)' : 'Non-ECC (Consumer)'}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {type === 'ECC' ? 'Error Correction Code Memory für Server-Systeme' : 'Standard Desktop & Laptop Arbeitsspeicher'}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">4. {t.memoryTechnology}</h3>
                <div className="group relative">
                  <Info size={16} className="text-slate-400 cursor-help" />
                  <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                    <p className="font-bold mb-1">RDIMM (Registered):</p>
                    <p className="mb-2">Gängigster Server-RAM, stabilisiert Signale.</p>
                    <p className="font-bold mb-1">UDIMM (Unbuffered ECC):</p>
                    <p className="mb-2">Günstiger, oft in Workstations/Micro-Servern.</p>
                    <p className="font-bold mb-1">LRDIMM (Load Reduced):</p>
                    <p>Für maximale Kapazitäten pro Slot.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {getAvailableOptions('memoryType').map(t => (
                  <button
                    key={t}
                    onClick={() => handleSelect('memoryType', t)}
                    className={`px-4 py-3 rounded-xl border text-sm font-bold text-left transition-all ${
                      attrs.memoryType === t ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    {t} {
                      t === 'RDIMM' ? '(Registered)' : 
                      t === 'UDIMM' ? (attrs.ramType === 'ECC' ? '(Unbuffered)' : '(Desktop)') : 
                      t === 'LRDIMM' ? '(Load Reduced)' : 
                      t === 'SO-DIMM' ? '(Laptop)' : ''
                    }
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">5. {t.frequency} (MHz)</h3>
              <div className="grid grid-cols-3 gap-2">
                {getAvailableOptions('frequency').map(f => (
                  <button
                    key={f}
                    onClick={() => handleSelect('frequency', f)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      attrs.frequency === f ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div 
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">6. {t.model} {t.choose}</h3>
              
              {isManualEntry ? (
                <div className="space-y-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-indigo-600">{t.manualEntry}</p>
                    <button 
                      onClick={() => {
                        setIsManualEntry(false);
                        setAttrs(prev => ({ ...prev, model: '', rank: undefined }));
                      }}
                      className="text-[10px] text-slate-400 hover:text-slate-600 underline"
                    >
                      {t.backToList}
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Modellbezeichnung</label>
                      <input
                        autoFocus
                        type="text"
                        value={attrs.model}
                        onChange={(e) => setAttrs(prev => ({ ...prev, model: e.target.value }))}
                        placeholder="z.B. CMK16GX4M2B3200C16"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rank (Optional)</label>
                      <div className="grid grid-cols-3 gap-1">
                        {RAM_DATA.ranks.map(r => (
                          <button
                            key={r}
                            onClick={() => setAttrs(prev => ({ ...prev, rank: r as RAMRank }))}
                            className={`py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                              attrs.rank === r ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      disabled={!attrs.model}
                      onClick={() => setStep(7)}
                      className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 disabled:opacity-50"
                    >
                      Bestätigen
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredModels.length > 0 ? (
                    <>
                      {filteredModels.map(m => (
                        <button
                          key={m.model}
                          onClick={() => {
                            setAttrs(prev => ({ ...prev, model: m.model, rank: m.rank as RAMRank }));
                            setStep(7);
                          }}
                          className={`w-full p-4 rounded-2xl border text-left transition-all ${
                            attrs.model === m.model ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 hover:border-indigo-300'
                          }`}
                        >
                          <div className="font-bold">{m.model}</div>
                          <div className={`text-[10px] mt-1 ${attrs.model === m.model ? 'text-indigo-100' : 'text-slate-400'}`}>
                            Rank: {m.rank} • {m.brand} • {m.frequency}MHz
                          </div>
                        </button>
                      ))}
                      <button 
                        onClick={() => setIsManualEntry(true)}
                        className="w-full p-3 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs font-bold hover:bg-slate-50 transition-all"
                      >
                        + Modell manuell eingeben
                      </button>
                    </>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <AlertCircle className="mx-auto text-slate-300 mb-2" size={32} />
                      <p className="text-xs text-slate-500">Keine passenden Modelle gefunden.</p>
                      <div className="flex flex-col gap-2 mt-4">
                        <button 
                          onClick={() => setIsManualEntry(true)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100"
                        >
                          {t.manualEntry}
                        </button>
                        <button onClick={() => setStep(3)} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 underline">{t.resetFilter}</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {step === 7 && (
            <motion.div 
              key="step7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.summary}</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{t.model}</p>
                    <p className="text-sm font-bold text-slate-900">{attrs.model}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{t.capacity}</p>
                    <p className="text-sm font-bold text-slate-900">{attrs.capacity}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{t.category}</p>
                    <p className="text-sm font-bold text-slate-900">{attrs.ramType} {attrs.memoryType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{t.rank}</p>
                    <p className="text-sm font-bold text-slate-900">{attrs.rank || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.quantity}</label>
                  <input
                    ref={quantityRef}
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-lg font-black text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 ${
                    canSubmit 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check size={20} />
                  {t.addToStock} (Enter)
                </button>

                {isDuplicate() && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[10px] text-amber-700 font-bold animate-pulse">
                    <AlertCircle size={14} />
                    {t.identicalArticle}
                  </div>
                )}
                
                <button 
                  onClick={() => setStep(1)}
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-all"
                >
                  {t.startOver}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Database size={12} />
          {RAM_DATA.models.length} {t.modelsLoaded}
        </div>
        <div className="flex items-center gap-2">
          <Layers size={12} />
          {location}
        </div>
      </div>
    </div>
  );
};

export default RAMEntryWizard;
