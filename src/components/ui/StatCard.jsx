export default function StatCard({
  title,
  value,
  icon: Icon,
  accent = 'teal',
  onClick,
}) {
  const clickable = typeof onClick === 'function';

  const accentClasses =
    accent === 'red'
      ? 'bg-red-50 text-red-700 ring-red-100'
      : accent === 'amber'
        ? 'bg-amber-50 text-amber-800 ring-amber-100'
        : accent === 'green'
          ? 'bg-green-50 text-green-700 ring-green-100'
          : 'bg-teal-50 text-teal-700 ring-teal-100';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      className={`w-full rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-200 transition ${
        clickable ? 'hover:bg-gray-50' : ''
      } ${!clickable ? 'cursor-default' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-600">{title}</div>
          <div className="mt-1 text-2xl font-bold text-slate-800">{value}</div>
        </div>
        <div
          className={`ml-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${accentClasses}`}
        >
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
      </div>
    </button>
  );
}
