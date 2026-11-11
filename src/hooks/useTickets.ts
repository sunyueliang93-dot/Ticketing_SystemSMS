import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { rowToTicket, type Ticket, type TicketInput, type TicketRow, type TicketStatus } from '@/types';

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
      setTickets([]);
    } else if (data) {
      setTickets((data as TicketRow[]).map(rowToTicket));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const addTicket = useCallback(
    async (input: TicketInput) => {
      const { data, error: err } = await supabase
        .from('tickets')
        .insert({
          customer: input.customer,
          trunk: input.trunk,
          destination: input.destination,
          content: input.content,
          issue: input.issue,
          vendor: input.vendor,
          status: input.status,
        })
        .select()
        .single();

      if (err) {
        setError(err.message);
        return;
      }
      if (data) {
        setTickets((prev) => [rowToTicket(data as unknown as TicketRow), ...prev]);
      }
    },
    [],
  );

  const updateTicket = useCallback(
    async (id: string, input: TicketInput) => {
      const { data, error: err } = await supabase
        .from('tickets')
        .update({
          customer: input.customer,
          trunk: input.trunk,
          destination: input.destination,
          content: input.content,
          issue: input.issue,
          vendor: input.vendor,
          status: input.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (err) {
        setError(err.message);
        return;
      }
      if (data) {
        const updated = rowToTicket(data as unknown as TicketRow);
        setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
      }
    },
    [],
  );

  const setTicketStatus = useCallback(async (id: string, status: TicketStatus) => {
    const { error: err } = await supabase
      .from('tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (err) {
      setError(err.message);
      return;
    }
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t)),
    );
  }, []);

  const deleteTicket = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('tickets').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    setTickets((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tickets, loading, error, addTicket, updateTicket, setTicketStatus, deleteTicket };
}
