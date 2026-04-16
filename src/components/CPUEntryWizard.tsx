import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  ChevronRight, 
  Info, 
  Cpu, 
  Layers, 
  Copy,
  AlertCircle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CPUAttributes, InventoryItem } from '../types';
import { CPU_DATA } from '../constants';
import { Language, translations } from '../translations';

interface CPUEntryWizardProps {
  onAdd: (item: Omit<InventoryItem, 'id' | 'timestamp' | 'addedBy'>) => void;
  location: string;
  language: Language;
}

const CPUEntryWizard: React.FC<CPUEntryWizardProps> = ({ onAdd, location, language }) => {
  const [step, setStep] = useState(1);
  const t = translations[language];
  const [attrs, setAttrs] = useState<Partial<CPUAttributes>>({
    brand: '',
    socket: '',
    generation: '',
    ramType: '',
    model: ''
  });
  const [quantity, setQuantity] = useState(1);
  const [lastEntry, setLastEntry] = useState<Partial<CPUAttributes> | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);

  const quantityRef = useRef<HTMLInputElement>(null);
  const manualModelRef = useRef<HTMLInputElement>(null);

  const handleSelect = (field: keyof CPUAttributes, value: any) => {
    setAttrs(prev => {
      const newAttrs = { ...prev, [field]: value };
      
      // Reset dependent fields
      if (field === 'brand') {
        newAttrs.socket = '';
        newAttrs.generation = '';
        newAttrs.ramType = '';
        newAttrs.model = '';
        setIsManualEntry(false);
      }
      if (field === 'socket') {
        newAttrs.generation = '';
        newAttrs.ramType = '';
        newAttrs.model = '';
        setIsManualEntry(false);
      }
      if (field === 'generation') {
        newAttrs.ramType = '';
        newAttrs.model = '';
        setIsManualEntry(false);
      }
      if (field === 'ramType') {
        newAttrs.model = '';
        setIsManualEntry(false);
      }
      
      return newAttrs;
    });
    
    // Auto-advance logic
    if (step < 5) setStep(prev => prev + 1);
  };

  const filteredModels = CPU_DATA.models.filter(m => {
    if (attrs.brand && m.brand !== attrs.brand) return false;
    if (attrs.socket && m.socket !== attrs.socket) return false;
    if (attrs.generation && m.generation !== attrs.generation) return false;
    if (attrs.ramType && m.ram !== attrs.ramType) return false;
    return true;
  });

  // Helper to get available options for current filters
  const getAvailableOptions = (field: keyof CPUAttributes) => {
    const filtered = CPU_DATA.models.filter(m => {
      if (field !== 'brand' && attrs.brand && m.brand !== attrs.brand) return false;
      if (field !== 'socket' && attrs.socket && m.socket !== attrs.socket) return false;
      if (field !== 'generation' && attrs.generation && m.generation !== attrs.generation) return false;
      if (field !== 'ramType' && attrs.ramType && m.ram !== attrs.ramType) return false;
      return true;
    });

    const options = new Set<string>();
    filtered.forEach(m => {
      if (field === 'brand') options.add(m.brand);
      if (field === 'socket') options.add(m.socket);
      if (field === 'generation') options.add(m.generation);
      if (field === 'ramType') options.add(m.ram);
    });

    return Array.from(options).sort();
  };

  const handleAdd = () => {
    if (!attrs.brand || !attrs.model) return;

    onAdd({
      type: 'CPU',
      attributes: {
        brand: attrs.brand,
        socket: attrs.socket || '',
        generation: attrs.generation || '',
        ramType: attrs.ramType || '',
        model: attrs.model,
      },
      quantity,
      location
    });

    setLastEntry({ ...attrs });
    
    // Reset for next entry but keep some context
    setAttrs(prev => ({
      brand: prev.brand,
      socket: prev.socket,
      generation: prev.generation,
      ramType: prev.ramType,
      model: ''
    }));
    setQuantity(1);
    setStep(5); // Stay on model selection
    setIsManualEntry(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Brand
        return (
          <div className="grid grid-cols-2 gap-3">
            {CPU_DATA.brands.map(brand => (
              <button
                key={brand}
                onClick={() => handleSelect('brand', brand)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  attrs.brand === brand 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-900">{brand}</div>
                <div className="text-xs text-slate-500 mt-1">Processor Manufacturer</div>
              </button>
            ))}
          </div>
        );

      case 2: // Socket
        const sockets = getAvailableOptions('socket');
        return (
          <div className="grid grid-cols-2 gap-3">
            {sockets.map(socket => (
              <button
                key={socket}
                onClick={() => handleSelect('socket', socket)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  attrs.socket === socket 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-900">{socket}</div>
              </button>
            ))}
          </div>
        );

      case 3: // Generation
        const generations = getAvailableOptions('generation');
        return (
          <div className="grid grid-cols-2 gap-3">
            {generations.map(gen => (
              <button
                key={gen}
                onClick={() => handleSelect('generation', gen)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  attrs.generation === gen 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-900">{gen}</div>
              </button>
            ))}
          </div>
        );

      case 4: // RAM Type
        const ramTypes = getAvailableOptions('ramType');
        return (
          <div className="grid grid-cols-2 gap-3">
            {ramTypes.map(rt => (
              <button
                key={rt}
                onClick={() => handleSelect('ramType', rt)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  attrs.ramType === rt 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-slate-900">{rt}</div>
              </button>
            ))}
          </div>
        );

      case 5: // Model
        return (
          <div className="space-y-4">
            {!isManualEntry ? (
              <>
                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredModels.map(m => (
                    <button
                      key={m.model}
                      onClick={() => {
                        setAttrs(prev => ({ ...prev, model: m.model }));
                        setStep(6);
                      }}
                      className={`p-3 rounded-lg border text-left transition-all flex justify-between items-center ${
                        attrs.model === m.model 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-900">{m.model}</div>
                        <div className="text-xs text-slate-500">
                          {m.socket} • {m.generation} • {m.ram}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsManualEntry(true)}
                  className="w-full p-3 rounded-lg border border-dashed border-slate-300 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  {t.noMatchingModels} {t.manualEntry}
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">{t.manualEntry}</label>
                <input
                  ref={manualModelRef}
                  type="text"
                  value={attrs.model}
                  onChange={(e) => setAttrs(prev => ({ ...prev, model: e.target.value }))}
                  placeholder="e.g. Xeon Platinum 8480+"
                  className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-0 transition-all outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsManualEntry(false)}
                    className="flex-1 p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-all"
                  >
                    {t.backToList}
                  </button>
                  <button
                    onClick={() => setStep(6)}
                    disabled={!attrs.model}
                    className="flex-1 p-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 disabled:opacity-50 transition-all"
                  >
                    {t.confirm}
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 6: // Quantity
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t.summary}</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">{t.article}</div>
                  <div className="text-sm font-semibold text-slate-900">{attrs.brand} {attrs.model}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Socket</div>
                  <div className="text-sm font-semibold text-slate-900">{attrs.socket}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Generation</div>
                  <div className="text-sm font-semibold text-slate-900">{attrs.generation}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">{t.memoryTechnology}</div>
                  <div className="text-sm font-semibold text-slate-900">{attrs.ramType}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">{t.quantity}</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center bg-white rounded-xl border-2 border-slate-100 overflow-hidden focus-within:border-emerald-500 transition-all">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    -
                  </button>
                  <input
                    ref={quantityRef}
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full text-center font-bold text-slate-900 outline-none"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className="flex-[2] p-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {t.addToStock}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    { id: 1, label: 'Brand', icon: Cpu },
    { id: 2, label: 'Socket', icon: Zap },
    { id: 3, label: 'Gen', icon: Layers },
    { id: 4, label: 'RAM', icon: Info },
    { id: 5, label: 'Model', icon: Copy },
    { id: 6, label: 'Qty', icon: Check }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t.advancedCpuEntry}</h2>
              <p className="text-slate-400 text-xs">Guided server processor cataloging</p>
            </div>
          </div>
          <div className="text-xs font-mono bg-white/10 px-3 py-1 rounded-full text-emerald-400 border border-white/10">
            STEP {step}/6
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1.5">
          {steps.map((s) => (
            <div 
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                step >= s.id ? 'bg-emerald-500' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
          {steps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => step > s.id && setStep(s.id)}
                disabled={step <= s.id}
                className={`flex items-center gap-1.5 whitespace-nowrap px-2 py-1 rounded-lg transition-all ${
                  step === s.id 
                    ? 'text-emerald-600 bg-emerald-50 font-bold' 
                    : step > s.id 
                      ? 'text-slate-500 hover:text-emerald-600' 
                      : 'text-slate-300'
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wider">{s.label}</span>
              </button>
              {idx < steps.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-200 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Last Entry Toast */}
        {lastEntry && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Last added</div>
                <div className="text-sm font-bold text-slate-900">
                  {lastEntry.brand} {lastEntry.model}
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                setAttrs({ ...lastEntry, model: '' });
                setStep(5);
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
            >
              Add another variant
            </button>
          </motion.div>
        )}

        {/* Help Tip */}
        <div className="mt-8 flex gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Selecting the brand and socket first will filter the available generations and models to ensure compatibility and accuracy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CPUEntryWizard;
