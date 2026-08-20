'use client';

import { useEffect, useState, useTransition } from 'react';
import { createClientUser, fetchClientUsers } from '../actions/dbActions';
import { supabase } from '../../utils/supabase/client';

const emptyForm = { name: '', email: '', phone: '' };

export default function SupabaseDemoPage() {
  const [form, setForm] = useState(emptyForm);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();

  const loadUsers = () => {
    startTransition(async () => {
      try {
        setUsers(await fetchClientUsers());
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
    });
  };

  useEffect(() => {
    loadUsers();

    const channel = supabase
      .channel('client-users-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'client_users' },
        ({ new: newUser }) => setUsers((current) => [newUser, ...current.filter((user) => user.id !== newUser.id)])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createClientUser(Object.fromEntries(formData));
      if (!result.success) {
        setMessage({ type: 'error', text: result.error });
        return;
      }
      setForm(emptyForm);
      setMessage({ type: 'success', text: 'Client user added successfully.' });
      loadUsers();
    });
  };

  return (
    <main className="mx-auto max-w-5xl space-y-8 py-8">
      <header className="space-y-2">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">Supabase workspace</p>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Client users</h1>
        <p className="max-w-2xl text-slate-600">Create records securely through a Server Action and watch new rows appear in real time.</p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-slate-900">Add a client</h2>
          {['name', 'email', 'phone'].map((field) => (
            <label key={field} className="block space-y-1.5">
              <span className="text-sm font-semibold capitalize text-slate-700">{field}</span>
              <input
                required
                name={field}
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                value={form[field]}
                onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          ))}
          <button disabled={isPending} className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60">
            {isPending ? 'Saving...' : 'Save client'}
          </button>
          {message && <p className={message.type === 'error' ? 'text-sm font-semibold text-red-600' : 'text-sm font-semibold text-emerald-700'}>{message.text}</p>}
        </form>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-extrabold text-slate-900">Registered clients</h2>
            <button onClick={loadUsers} disabled={isPending} className="text-sm font-bold text-emerald-700 hover:text-emerald-900 disabled:opacity-50">Refresh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Phone</th><th className="px-6 py-3">Added</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => <tr key={user.id}><td className="px-6 py-4 font-semibold text-slate-800">{user.name}</td><td className="px-6 py-4 text-slate-600">{user.email}</td><td className="px-6 py-4 text-slate-600">{user.phone}</td><td className="px-6 py-4 text-slate-500">{new Date(user.created_at).toLocaleDateString()}</td></tr>)}
                {!users.length && <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">No client users yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
