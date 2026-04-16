import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight, ArrowLeft, Layout, CheckCircle2 } from 'lucide-react';
import { InventoryItem } from '../types';
import { MAINBOARD_DATA } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

import { Language, translations } from '../translations';

interface MainboardEntryWizardProps {
  onAdd: (item: Omit<InventoryItem, 'id' | 'timestamp' | 'addedBy'>) => void;
  location: string;
  language: Language;
}

const MainboardEntryWizard: React.FC<MainboardEntryWizardProps> = ({ onAdd, location, language }) => {
  const [step, setStep] = useState(1);
  const t = translations[language];
  const [brand, setBrand] = useState('');
  const [socket, setSocket] = useState('');
  const [chipset, setChipset] = useState('');
  const [formFactor, setFormFactor] = useState('');
  const [model, setModel] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAdd({
      type: 'Mainboard',
      attributes: {
        brand,
        socket,
        chipset,
        formFactor,
        model
      },
      quantity,
      location
    });
    // Reset
    setStep(1);
    setBrand('');
    setSocket('');
    setChipset('');
    setFormFactor('');
    setModel('');
    setQuantity(1);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-600 text-white rounded-xl shadow-lg">
            <Layout size={18} />
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">{t.advancedMbEntry}</h2>
            <p className="text-[10px] text-slate-400 font-medium">{language === 'fr' ? 'Étape' : language === 'en' ? 'Step' : 'Schritt'} {step} {language === 'fr' ? 'sur' : language === 'en' ? 'of' : 'von'} 5</p>
          </div>
        </div>
        {step > 1 && (
          <button onClick={prevStep} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft size={16} />
          </button>
        )}
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t.choose} {t.brand}</label>
              <div className="grid grid-cols-2 gap-3">
                {MAINBOARD_DATA.brands.map(b => (
                  <button
                    key={b}
                    onClick={() => { setBrand(b); nextStep(); }}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                      brand === b ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-50 hover:border-violet-200 hover:bg-slate-50'
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
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t.choose} Socket</label>
              <div className="grid grid-cols-2 gap-3">
                {MAINBOARD_DATA.sockets.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSocket(s); nextStep(); }}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                      socket === s ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-50 hover:border-violet-200 hover:bg-slate-50'
                    }`}
                  >
                    {s}
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
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t.choose} Chipset</label>
              <div className="grid grid-cols-2 gap-3">
                {(MAINBOARD_DATA.chipsets[socket as keyof typeof MAINBOARD_DATA.chipsets] || ['Generic']).map(c => (
                  <button
                    key={c}
                    onClick={() => { setChipset(c); nextStep(); }}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                      chipset === c ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-50 hover:border-violet-200 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="pt-4">
                <input
                  type="text"
                  placeholder={t.manualEntry + "..."}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setChipset((e.target as HTMLInputElement).value);
                      nextStep();
                    }
                  }}
                />
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
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Format & {t.model}</label>
              <div className="grid grid-cols-2 gap-3">
                {MAINBOARD_DATA.formFactors.map(f => (
                  <button
                    key={f}
                    onClick={() => setFormFactor(f)}
                    className={`p-3 rounded-xl border-2 transition-all font-bold text-xs ${
                      formFactor === f ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-50 hover:border-violet-200 hover:bg-slate-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <input
                  type="text"
                  placeholder={`${t.model} (ex: ROG STRIX Z790-E)`}
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 font-bold"
                />
              </div>
              <button
                disabled={!formFactor || !model}
                onClick={nextStep}
                className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                {t.confirm}
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="bg-violet-50 p-4 rounded-2xl border border-violet-100">
                <h3 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">{t.summary}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t.article}</span>
                    <span className="font-bold text-slate-900">Mainboard {brand}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t.model}</span>
                    <span className="font-bold text-slate-900">{model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Socket / Chipset</span>
                    <span className="font-bold text-slate-900">{socket} / {chipset}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Format</span>
                    <span className="font-bold text-slate-900">{formFactor}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t.quantity}</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full bg-transparent border-none p-0 text-lg focus:ring-0 font-black text-violet-600"
                  />
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t.location}</label>
                  <div className="text-sm font-bold text-slate-700 py-1">{location}</div>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold shadow-xl shadow-violet-200 transition-all flex items-center justify-center gap-2 group"
              >
                <CheckCircle2 size={20} />
                {t.addToStock}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainboardEntryWizard;
