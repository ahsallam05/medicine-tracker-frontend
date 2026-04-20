import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { medicineService } from '../../api';

export default function MedicineFilters({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <button
        type="button" onClick={() => setIsOpen(!isOpen)}
        className="flex h-full w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 shadow-sm outline-none hover:bg-slate-50 focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
      >
        <span className="truncate">{value === 'All' ? 'Filter by Category' : value}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-100 bg-white py-2 shadow-2xl animate-in fade-in zoom-in-95">
          <div className="max-h-[280px] overflow-y-auto px-1 scrollbar-hide">
            {medicineService.CATEGORIES.map((cat) => (
              <button
                key={cat} type="button"
                onClick={() => { onChange(cat); setIsOpen(false); }}
                className={`flex w-full cursor-pointer rounded-xl px-3 py-2.5 text-sm transition-colors ${value === cat ? 'bg-teal-50 font-bold text-teal-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
