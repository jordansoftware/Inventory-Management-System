import React, { useState, useRef, useEffect } from 'react';
import { 
  Filter, 
  Download, 
  Upload, 
  MoreVertical, 
  Search,
  ChevronRight,
  ChevronLeft,
  X as CloseIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';
import { InventoryItem, ProductType, User, ProductDefinition } from '../types';
import { RAM_DATA, CPU_DATA, LOCATIONS } from '../constants';
import { Language, translations } from '../translations';

interface InventoryProps {
  inventory: InventoryItem[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onBulkAdd: (items: Omit<InventoryItem, 'id' | 'timestamp' | 'addedBy'>[]) => void;
  language: Language;
  currentUser: User;
  definitions: ProductDefinition[];
}

const Inventory: React.FC<InventoryProps> = ({ inventory, searchTerm, onSearchChange, onBulkAdd, language, currentUser, definitions }) => {
  const [filterType, setFilterType] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pendingItems, setPendingItems] = useState<Omit<InventoryItem, 'id' | 'timestamp' | 'addedBy'>[] | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws) as any[];

      const importedItems: Omit<InventoryItem, 'id' | 'timestamp' | 'addedBy'>[] = data.map(row => {
        // Map common column names to our structure
        const rawType = (row.Typ || row.Category || row.Kategorie || '').toString().toUpperCase();
        let type: ProductType = 'RAM'; // Default
        
        if (rawType.includes('RAM')) type = 'RAM';
        else if (rawType.includes('SSD')) type = 'SSD';
        else if (rawType.includes('CPU') || rawType.includes('PROZESSOR')) type = 'CPU';
        else if (rawType.includes('GPU') || rawType.includes('GRAFIK')) type = 'GPU';
        else if (rawType.includes('MAINBOARD') || rawType.includes('MOTHERBOARD')) type = 'Mainboard';
        else type = 'RAM'; // Fallback to RAM if unknown, or we could add a generic type

        const brand = row.Marke || row.Brand || row.Hersteller || 'Unbekannt';
        const model = row.Modell || row.Model || 'Unbekannt';
        const serial = row.Seriennummer || row.Serial || row.SN || '';
        const quantity = parseInt(row.Menge || row.Quantity || row.Anzahl || '1');
        const location = row.Lagerort || row.Location || LOCATIONS[0];

        // Build attributes based on type
        const attributes: any = { brand, model };
        if (serial) attributes.serial = serial;

        // Add other columns as attributes
        Object.keys(row).forEach(key => {
          if (!['Typ', 'Category', 'Kategorie', 'Marke', 'Brand', 'Hersteller', 'Modell', 'Model', 'Seriennummer', 'Serial', 'SN', 'Menge', 'Quantity', 'Anzahl', 'Lagerort', 'Location'].includes(key)) {
            attributes[key.toLowerCase()] = row[key];
          }
        });

        return {
          type,
          attributes,
          quantity,
          location
        };
      });

      if (importedItems.length > 0) {
        setPendingItems(importedItems);
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const confirmImport = () => {
    if (pendingItems) {
      onBulkAdd(pendingItems);
      setPendingItems(null);
    }
  };

  const cancelImport = () => {
    setPendingItems(null);
  };

  // Collect all unique model names from inventory and predefined data with their types
  const allModels = React.useMemo(() => {
    const modelsMap = new Map<string, string>(); // model -> type
    
    // From predefined data (prioritize these for correct typing)
    RAM_DATA.models.forEach(m => modelsMap.set(m.model, 'RAM'));
    CPU_DATA.models.forEach(m => modelsMap.set(m.model, 'CPU'));

    // From inventory (might overwrite or add new ones)
    inventory.forEach(item => {
      if (item.attributes.model) {
        modelsMap.set(item.attributes.model, item.type);
      }
    });

    return Array.from(modelsMap.entries()).map(([model, type]) => ({ model, type }));
  }, [inventory]);

  const suggestions = React.useMemo(() => {
    if (searchTerm.length < 2) return [];
    const lowerSearch = searchTerm.toLowerCase();
    
    const matches = allModels.filter(m => 
      m.model.toLowerCase().includes(lowerSearch) || 
      m.type.toLowerCase().includes(lowerSearch)
    );
    
    return matches.sort((a, b) => {
      const aLower = a.model.toLowerCase();
      const bLower = b.model.toLowerCase();
      const aStarts = aLower.startsWith(lowerSearch);
      const bStarts = bLower.startsWith(lowerSearch);
      
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.model.localeCompare(b.model);
    }).slice(0, 8);
  }, [searchTerm, allModels]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = Object.values(item.attributes).some(val => 
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) || item.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'All' || item.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    const headers = [t.article, t.category, t.properties, t.quantity, t.location, 'Datum'];
    const rows = filteredInventory.map(item => [
      item.id,
      item.type,
      Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join('; '),
      item.quantity,
      item.location,
      new Date(item.timestamp).toLocaleString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `it_inventar_export_${language}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.inventory}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{language === 'fr' ? 'Gérez et parcourez l\'ensemble de votre stock.' : language === 'en' ? 'Manage and browse your entire stock.' : 'Verwalten und durchsuchen Sie Ihren gesamten Bestand.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <Download size={18} />
            {t.exportCsv}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
          />
          {currentUser.role === 'Admin' && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20"
            >
              <Upload size={18} />
              {t.import}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-slate-100"
            />
            {searchTerm && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <CloseIcon size={16} />
              </button>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">{t.quickSearch}</p>
                </div>
                <div className="max-h-64 overflow-y-auto p-1">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSearchChange(suggestion.model);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors flex items-center justify-between group"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400">{suggestion.model}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{suggestion.type}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-300 dark:group-hover:text-indigo-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm px-3 py-2 focus:outline-none text-slate-900 dark:text-slate-100"
              >
                <option value="All">{t.allTypes}</option>
                {definitions.map(def => (
                  <option key={def.type} value={def.type}>{def.type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-b-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">{t.article}</th>
                <th className="px-6 py-4">{t.category}</th>
                <th className="px-6 py-4">{t.properties}</th>
                <th className="px-6 py-4">{t.location}</th>
                <th className="px-6 py-4">{t.quantity}</th>
                {currentUser.role === 'Admin' && <th className="px-6 py-4 text-right">{t.actions}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                          {item.type.substring(0, 3)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-200">#{item.id.toUpperCase()}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{new Date(item.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(item.attributes).map(([key, value]) => (
                          <span key={key} className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2 py-0.5 rounded-md">
                            <span className="text-slate-400 dark:text-slate-500 font-medium">{key}:</span> {value}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.location}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`text-sm font-black ${item.quantity < 5 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                        {item.quantity}
                      </p>
                    </td>
                    {currentUser.role === 'Admin' && (
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 italic">
                    {t.noArticlesFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">{t.showing} {filteredInventory.length} {t.of} {inventory.length} {t.articles}</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="px-3 py-1 text-xs font-bold bg-indigo-600 text-white rounded-lg">1</button>
            <button className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg disabled:opacity-30" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {pendingItems && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{t.importPreview}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.checkData}</p>
                  </div>
                </div>
                <button 
                  onClick={cancelImport}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
                >
                  <CloseIcon size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                        <th className="px-4 py-3">{t.category}</th>
                        <th className="px-4 py-3">{t.model} / {t.brand}</th>
                        <th className="px-4 py-3">Seriennummer</th>
                        <th className="px-4 py-3">{t.location}</th>
                        <th className="px-4 py-3 text-right">{t.quantity}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {pendingItems.map((item, idx) => (
                        <tr key={idx} className="bg-white/50 dark:bg-slate-950/50">
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded text-[10px] font-bold uppercase tracking-wider">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{item.attributes.model}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{item.attributes.brand}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs font-mono text-slate-600 dark:text-slate-400">{item.attributes.serial || '-'}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{item.location}</td>
                          <td className="px-4 py-3 text-right font-black text-slate-900 dark:text-white">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-4">
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <span className="font-black text-slate-900 dark:text-white">{pendingItems.length}</span> {t.readyToImport}
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={cancelImport}
                    className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    onClick={confirmImport}
                    className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
                  >
                    <Check size={18} />
                    {t.saveToStock}
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

export default Inventory;
