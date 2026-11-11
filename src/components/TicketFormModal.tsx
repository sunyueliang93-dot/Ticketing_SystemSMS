import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { STATUS_OPTIONS, type Ticket, type TicketInput, type TicketStatus } from '@/types';

interface TicketFormModalProps {
  open: boolean;
  initial?: Ticket | null;
  onClose: () => void;
  onSubmit: (input: TicketInput) => void;
}

const EMPTY: TicketInput = {
  customer: '',
  trunk: '',
  destination: '',
  content: '',
  issue: '',
  vendor: '',
  status: 'Open',
};

export function TicketFormModal({ open, initial, onClose, onSubmit }: TicketFormModalProps) {
  const [form, setForm] = useState<TicketInput>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof TicketInput, string>>>({});
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              customer: initial.customer,
              trunk: initial.trunk,
              destination: initial.destination,
              content: initial.content,
              issue: initial.issue,
              vendor: initial.vendor,
              status: initial.status,
            }
          : EMPTY,
      );
      setErrors({});
      setTimeout(() => firstFieldRef.current?.focus(), 50);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = (key: keyof TicketInput, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof TicketInput, string>> = {};
    if (!form.customer.trim()) next.customer = 'Customer is required';
    if (!form.trunk.trim()) next.trunk = 'Trunk is required';
    if (!form.destination.trim()) next.destination = 'Destination is required';
    if (!form.vendor.trim()) next.vendor = 'Vendor is required';
    if (!form.issue.trim()) next.issue = 'Issue is required';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({
      customer: form.customer.trim(),
      trunk: form.trunk.trim(),
      destination: form.destination.trim(),
      content: form.content.trim(),
      issue: form.issue.trim(),
      vendor: form.vendor.trim(),
      status: form.status,
    });
  };

  const fieldClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400';

  const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 sm:rounded-2xl dark:bg-slate-900 dark:ring-white/10">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {initial ? 'Edit Ticket' : 'New Ticket'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="customer">
                Customer / Client
              </label>
              <input
                ref={firstFieldRef}
                id="customer"
                type="text"
                value={form.customer}
                onChange={(e) => set('customer', e.target.value)}
                className={fieldClass}
                placeholder="e.g. Acme Corp"
              />
              {errors.customer && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.customer}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="trunk">
                Trunk
              </label>
              <input
                id="trunk"
                type="text"
                value={form.trunk}
                onChange={(e) => set('trunk', e.target.value)}
                className={fieldClass}
                placeholder="e.g. TRK-001"
              />
              {errors.trunk && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.trunk}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="destination">
                Destination / Country
              </label>
              <input
                id="destination"
                type="text"
                value={form.destination}
                onChange={(e) => set('destination', e.target.value)}
                className={fieldClass}
                placeholder="e.g. United Kingdom"
              />
              {errors.destination && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.destination}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="vendor">
                Vendor
              </label>
              <input
                id="vendor"
                type="text"
                value={form.vendor}
                onChange={(e) => set('vendor', e.target.value)}
                className={fieldClass}
                placeholder="e.g. GlobalTel"
              />
              {errors.vendor && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.vendor}</p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="content">
                Content
              </label>
              <input
                id="content"
                type="text"
                value={form.content}
                onChange={(e) => set('content', e.target.value)}
                className={fieldClass}
                placeholder="Brief content description"
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="status">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => set('status', e.target.value as TicketStatus)}
                className={fieldClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className={labelClass} htmlFor="issue">
              Issue
            </label>
            <textarea
              id="issue"
              rows={4}
              value={form.issue}
              onChange={(e) => set('issue', e.target.value)}
              className={`${fieldClass} resize-y`}
              placeholder="Describe the issue in detail..."
            />
            {errors.issue && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{errors.issue}</p>
            )}
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {initial ? 'Save Changes' : 'Create Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}
