import React, { useState } from 'react';
import { Plus, Trash2, Layout, Check, X, ListPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductDefinition, ProductAttribute } from '../types';
import { Language, translations } from '../translations';

interface CategoryManagerProps {
  definitions: ProductDefinition[];
  onUpdate: (definitions: ProductDefinition[]) => void;
  language: Language;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ definitions, onUpdate, language }) => {
  const t = translations[language];
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState({ type: '', attributes: [] as ProductAttribute[] });
  const [newAttr, setNewAttr] = useState({ label: '', type: 'text' as const });

  const handleAddCategory = () => {
    if (!newCat.type) return;
    onUpdate([...definitions, { type: newCat.type, attributes: newCat.attributes }]);
    setNewCat({ type: '', attributes: [] });
    setIsAdding(false);
  };

  const handleDeleteCategory = (type: string) => {
    onUpdate(definitions.filter(d => d.type !== type));
  };

  const addAttributeToNewCat = () => {
    if (!newAttr.label) return;
    const attr: ProductAttribute = {
      id: newAttr.label.toLowerCase().replace(/\s+/g, '_'),
      label: newAttr.label,
      type: newAttr.type,
      placeholder: `z.B. ${newAttr.label}...`
    };
    setNewCat({ ...newCat, attributes: [...newCat.attributes, attr] });
    setNewAttr({ label: '', type: 'text' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{t.categories}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{language === 'fr' ? 'Gérez les types de produits et leurs attributs.' : language === 'en' ? 'Manage product types and their attributes.' : 'Verwalten Sie Produkttypen und deren Attribute.'}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
        >
          <Plus size={20} />
          {t.addCategory}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {definitions.map((def) => (
            <motion.div
              layout
              key={def.type}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Layout size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase truncate max-w-[200px]">{def.type}</h3>
                </div>
                {def.type !== 'RAM' && def.type !== 'CPU' && (
                  <button 
                    onClick={() => handleDeleteCategory(def.type)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t.attributes}</div>
                <div className="flex flex-wrap gap-2">
                  {def.attributes.map(attr => (
                    <span key={attr.id} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium border border-slate-100 dark:border-slate-700">
                      {attr.label}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{t.addCategory}</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={24} /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{t.categoryName}</label>
                  <input
                    type="text"
                    value={newCat.type}
                    onChange={e => setNewCat({ ...newCat, type: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-5 py-4 mt-1 border-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white font-bold"
                    placeholder="z.B. Tablet, Monitor..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{t.attributes}</label>
                  
                  <div className="flex flex-wrap gap-2">
                    {newCat.attributes.map(attr => (
                      <div key={attr.id} className="group flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold border border-indigo-100 dark:border-indigo-900/50">
                        {attr.label}
                        <button 
                          onClick={() => setNewCat({ ...newCat, attributes: newCat.attributes.filter(a => a.id !== attr.id) })}
                          className="hover:text-rose-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl items-end">
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Alias</span>
                      <input
                        type="text"
                        value={newAttr.label}
                        onChange={e => setNewAttr({ ...newAttr, label: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                        placeholder="Attributname..."
                      />
                    </div>
                    <div className="w-32 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Type</span>
                      <select 
                        value={newAttr.type}
                        onChange={e => setNewAttr({ ...newAttr, type: e.target.value as any })}
                        className="w-full bg-white dark:bg-slate-900 rounded-xl px-4 py-3 border-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm appearance-none"
                      >
                        <option value="text">Texte</option>
                        <option value="number">Nombre</option>
                        <option value="select">Liste</option>
                      </select>
                    </div>
                    <button 
                      onClick={addAttributeToNewCat}
                      className="p-3 bg-white dark:bg-slate-900 text-indigo-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                      <ListPlus size={20} />
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleAddCategory}
                    disabled={!newCat.type || newCat.attributes.length === 0}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    {language === 'fr' ? 'Créer la catégorie' : language === 'en' ? 'Create Category' : 'Kategorie erstellen'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManager;
