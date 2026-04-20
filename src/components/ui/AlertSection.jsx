import { useEffect, useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

function formatDate(dateRaw) {
  if (!dateRaw) return '—';
  const d = new Date(dateRaw);
  if (Number.isNaN(d.getTime())) return String(dateRaw);
  return d.toLocaleDateString();
}

const DEFAULT_VISIBLE_COUNT = 10;

export default function AlertSection({
  title,
  icon,
  colorClass,
  medicines = [],
  defaultOpen = false,
  onToggle,
}) {
  const isOpen = defaultOpen;
  const count = medicines.length;
  const IconComponent = icon;
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_COUNT);

  // Reset visible count when section is collapsed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setVisibleCount(DEFAULT_VISIBLE_COUNT), 0);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOpen]);

  const handleToggle = () => {
    onToggle?.(!isOpen);
  };

  const displayedMedicines = medicines.slice(0, visibleCount);
  const remainingCount = medicines.length - visibleCount;
  const canShowMore = visibleCount < medicines.length;
  const canShowLess = visibleCount >= medicines.length && medicines.length > DEFAULT_VISIBLE_COUNT;

  const contentStyle = isOpen
    ? {
        maxHeight: '1000px',
        opacity: 1,
        transition: 'max-height 0.3s ease, opacity 0.2s ease',
        overflow: 'hidden',
      }
    : {
        maxHeight: 0,
        opacity: 0,
        transition: 'max-height 0.3s ease, opacity 0.2s ease',
        overflow: 'hidden',
      };

  return (
    <div className={`rounded-lg ring-1 ${colorClass}`}>
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left"
      >
        <IconComponent className="h-5 w-5 shrink-0" />
        <span className="flex-1 text-sm font-semibold">{title}</span>
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/80 px-2 text-xs font-medium">
          {count}
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0" />
        )}
      </button>

      <div style={contentStyle}>
        <div className="alert-content max-h-[400px] overflow-y-auto border-t border-current/10 px-4 pb-4 pt-2">
          {count === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6">
              <CheckCircle className="h-6 w-6 opacity-60" />
              <p className="text-center text-sm opacity-80">
                No medicines in this category
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide opacity-70">
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Quantity</th>
                    <th className="px-3 py-2">Expiry Date</th>
                    <th className="px-3 py-2">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedMedicines.map((m) => (
                    <tr key={m.medicine_id ?? `${m.medicine_name}-${m.expiry_date}`}>
                      <td className="px-3 py-2 text-sm font-medium">{m.medicine_name}</td>
                      <td className="px-3 py-2 text-sm">{m.category ?? '—'}</td>
                      <td className="px-3 py-2 text-sm">{m.quantity ?? 0}</td>
                      <td className="px-3 py-2 text-sm">
                        {formatDate(m.expiry_date)}
                      </td>
                      <td className="px-3 py-2 text-sm">{m.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Show More / Show Less buttons */}
              <div className="mt-3 flex justify-center">
                {canShowMore ? (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + DEFAULT_VISIBLE_COUNT)}
                    className="cursor-pointer text-sm font-medium text-teal-600 underline hover:text-teal-700"
                  >
                    Show More ({remainingCount} remaining)
                  </button>
                ) : canShowLess ? (
                  <button
                    type="button"
                    onClick={() => setVisibleCount(DEFAULT_VISIBLE_COUNT)}
                    className="cursor-pointer text-sm font-medium text-gray-500 underline hover:text-gray-600"
                  >
                    Show Less
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
