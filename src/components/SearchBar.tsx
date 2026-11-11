import { Search, X } from 'lucide-react';
import { STATUS_OPTIONS, type TicketStatus } from '@/types';

export type StatusFilter = TicketStatus | 'All';

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  resultCount: number;
}

export function SearchBar({
  query,
  onQueryChange,
  statusFilter,
  onStatusChange,
  resultCount,
}: SearchBarProps) {
  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white pl-10 pr-9 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400';

  const chipBase =
    'rounded-full px-3 py-1.5 text-xs font-medium transition whitespace-nowrap';
  const chipActive = 'bg-blue-600 text-white shadow-sm';
  const chipIdle =
    'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700';

  const filters: StatusFilter[] = ['All', ...STATUS_OPTIONS];

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by customer or vendor..."
            className={inputClass}
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="shrink-0 self-center text-xs text-slate-400 dark:text-slate-500">
          {resultCount} {resultCount === 1 ? 'ticket' : 'tickets'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => onStatusChange(f)}
            className={`${chipBase} ${statusFilter === f ? chipActive : chipIdle}`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
