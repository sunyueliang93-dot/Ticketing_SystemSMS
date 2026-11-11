export type TicketStatus = 'Open' | 'Close' | 'Down Vendor';

export const STATUS_OPTIONS: TicketStatus[] = ['Open', 'Close', 'Down Vendor'];

export interface Ticket {
  id: string;
  customer: string;
  trunk: string;
  destination: string;
  content: string;
  issue: string;
  vendor: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export type TicketInput = Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>;

/** Shape returned by Supabase (snake_case columns). */
export interface TicketRow {
  id: string;
  customer: string;
  trunk: string;
  destination: string;
  content: string;
  issue: string;
  vendor: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
}

export function rowToTicket(row: TicketRow): Ticket {
  return {
    id: row.id,
    customer: row.customer,
    trunk: row.trunk,
    destination: row.destination,
    content: row.content,
    issue: row.issue,
    vendor: row.vendor,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const STATUS_STYLES: Record<TicketStatus, string> = {
  Open: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30',
  Close: 'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/15 dark:text-slate-300 dark:ring-slate-400/30',
  'Down Vendor': 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/30',
};

export const STATUS_DOT: Record<TicketStatus, string> = {
  Open: 'bg-emerald-500',
  Close: 'bg-slate-400',
  'Down Vendor': 'bg-rose-500',
};
