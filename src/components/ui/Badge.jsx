function colorClasses(color) {
  switch (color) {
    case 'teal':
      return 'bg-teal-50 text-teal-600 ring-teal-200';
    case 'red':
      return 'bg-red-50 text-red-600 ring-red-200';
    case 'orange':
      return 'bg-orange-50 text-orange-500 ring-orange-200';
    case 'yellow':
      return 'bg-yellow-50 text-yellow-500 ring-yellow-200';
    case 'amber':
      return 'bg-amber-50 text-amber-500 ring-amber-200';
    case 'gray':
      return 'bg-gray-100 text-gray-500 ring-gray-200';
    case 'green':
      return 'bg-green-50 text-green-600 ring-green-200';
    case 'slate':
    default:
      return 'bg-slate-100 text-slate-700 ring-slate-200';
  }
}

export default function Badge({ label, color = 'slate' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colorClasses(
        color,
      )}`}
    >
      {label}
    </span>
  );
}
