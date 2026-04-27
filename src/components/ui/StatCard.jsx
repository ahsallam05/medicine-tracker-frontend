export function StatCardsSkeleton() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-20 w-full animate-pulse rounded-xl bg-white shadow-sm ring-1 ring-slate-100"
        />
      ))}
    </>
  );
}

export default function StatCard({ title, value, color = 'teal', icon: Icon, onClick }) {
  const styles = {
    teal: 'border-teal-200 bg-teal-50/80 text-teal-800',
    red: 'border-red-200 bg-red-50/80 text-red-800',
    orange: 'border-orange-200 bg-orange-50/80 text-orange-800',
    yellow: 'border-yellow-200 bg-yellow-50/80 text-yellow-800',
    amber: 'border-amber-200 bg-amber-50/80 text-amber-800',
    green: 'border-green-200 bg-green-50/80 text-green-800',
  };

  const iconStyles = {
    teal: 'bg-teal-100/80 text-teal-600',
    red: 'bg-red-100/80 text-red-600',
    orange: 'bg-orange-100/80 text-orange-600',
    yellow: 'bg-yellow-100/80 text-yellow-500',
    amber: 'bg-amber-100/80 text-amber-600',
    green: 'bg-green-100/80 text-green-600',
  };

  return (
    <button
      onClick={onClick}
      className={`group flex w-full flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all hover:bg-white hover:shadow-md active:scale-95 sm:flex-row sm:gap-4 sm:p-4 sm:text-left ${styles[color] || styles.teal}`}
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110 sm:h-12 sm:w-12 ${iconStyles[color] || iconStyles.teal}`}>
        {Icon && <Icon className="h-4 w-4 sm:h-6 sm:w-6" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[8px] font-bold uppercase tracking-tight text-slate-500 sm:text-xs sm:tracking-wider">
          {title}
        </p>
        <p className="text-sm font-black tracking-tighter text-slate-900 sm:text-xl sm:tracking-tight">
          {value}
        </p>
      </div>
    </button>
  );
}
