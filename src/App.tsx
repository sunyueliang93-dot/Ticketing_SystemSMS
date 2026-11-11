import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Moon, Sun, Plus, Ticket as TicketIcon, Inbox, Loader2 } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { TicketTable } from '@/components/TicketTable';
import { TicketFormModal } from '@/components/TicketFormModal';
import { SearchBar, type StatusFilter } from '@/components/SearchBar';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { Ticket, TicketInput } from '@/types';

const THEME_KEY = 'theme';

function useTheme() {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  };

  return { dark, toggle };
}

function App() {
  const { dark, toggle } = useTheme();
  const { tickets, loading, error, addTicket, updateTicket, setTicketStatus, deleteTicket } = useTickets();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Ticket | null>(null);

  const [toDelete, setToDelete] = useState<Ticket | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((t) => {
      if (statusFilter !== 'All' && t.status !== statusFilter) return false;
      if (!q) return true;
      return (
        t.customer.toLowerCase().includes(q) ||
        t.vendor.toLowerCase().includes(q) ||
        t.trunk.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q)
      );
    });
  }, [tickets, query, statusFilter]);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (ticket: Ticket) => {
    setEditing(ticket);
    setFormOpen(true);
  };

  const handleSubmit = (input: TicketInput) => {
    if (editing) {
      void updateTicket(editing.id, input);
    } else {
      void addTicket(input);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const confirmDelete = () => {
    if (toDelete) void deleteTicket(toDelete.id);
    setToDelete(null);
  };

  const rootClass = dark
    ? 'min-h-screen bg-slate-950 text-slate-100'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={rootClass}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <TicketIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Ticketing</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Internal support ticket manager
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Ticket</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </header>

        {/* Search + filters */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            resultCount={filtered.length}
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50 py-16 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <p className="mt-4 font-medium text-rose-700 dark:text-rose-300">
              Could not load tickets
            </p>
            <p className="mt-1 max-w-sm text-sm text-rose-600/80 dark:text-rose-400/70">
              {error}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <Inbox className="h-7 w-7" />
            </div>
            <p className="mt-4 font-medium text-slate-700 dark:text-slate-200">
              {tickets.length === 0 ? 'No tickets yet' : 'No tickets match your search'}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {tickets.length === 0
                ? 'Create your first ticket to get started.'
                : 'Try adjusting your search or filters.'}
            </p>
            {tickets.length === 0 && (
              <button
                onClick={openNew}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Create Ticket
              </button>
            )}
          </div>
        ) : (
          <TicketTable
            tickets={filtered}
            onEdit={openEdit}
            onDelete={setToDelete}
            onStatusChange={setTicketStatus}
          />
        )}
      </div>

      <TicketFormModal
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete ticket?"
        message={`This will permanently remove the ticket for "${toDelete?.customer ?? ''}". This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

export default App;
