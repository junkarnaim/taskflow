import TaskList from './components/TaskList';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Bell, CalendarDays,
  CheckCheck, CheckCircle2, ClipboardList,
  Clock3, LayoutDashboard, ListTodo, LoaderCircle, LogOut,
  Menu, Plus, Search, ShieldCheck,
  Sparkles, TrendingUp, X, Zap,
} from 'lucide-react';

import { format } from 'date-fns';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const priorities = ['Low', 'Medium', 'High'];
const categories = ['Work', 'Study', 'Personal', 'Other'];
const blankTask = {
  title: '', description: '', priority: 'Medium', category: 'Work',
  status: 'Pending', dueDate: format(new Date(), 'yyyy-MM-dd'),
};

function messageFrom(error) {
  return error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.msg ||
    error?.message ||
    'Something went wrong. Please try again.';
}


function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post(
        mode === 'login' ? '/auth/login' : '/auth/register',
        mode === 'login'
          ? { email: form.email, password: form.password }
          : form
      );
      localStorage.setItem('taskflow_token', data.token);
      onAuth(data.user);
      toast.success(mode === 'login' ? 'Welcome back!' : 'Your account is ready!');
    } catch (error) {
      toast.error(messageFrom(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500 p-2.5"><CheckCheck size={25} /></div>
          <span className="text-2xl font-extrabold tracking-tight">TaskFlow</span>
        </div>
        <div className="relative max-w-xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-blue-200">
            <Sparkles size={15} /> Make room for meaningful work
          </span>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight xl:text-6xl">
            A clearer mind starts with a <span className="text-blue-400">clear plan.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
            Bring your tasks together, focus on your priorities, and turn busy days into real progress.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {['J', 'T', 'A'].map((letter, i) => (
                <div key={letter} className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 text-sm font-bold ${['bg-blue-500', 'bg-violet-500', 'bg-emerald-500'][i]}`}>{letter}</div>
              ))}
            </div>
            <p className="text-sm text-slate-400">One task at a time. <span className="text-white">Real progress.</span></p>
          </div>
        </div>
        <p className="relative text-sm text-slate-500">Your personal workspace · Simple, focused, yours.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="rounded-xl bg-blue-600 p-2 text-white"><CheckCheck size={22} /></div>
            <span className="text-xl font-extrabold">TaskFlow</span>
          </div>
          <div className="mb-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-blue-600">
              {mode === 'login' ? 'Welcome back' : 'Get started'}
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {mode === 'login' ? 'Sign in to TaskFlow' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {mode === 'login' ? 'Pick up where you left off.' : 'A few details and your workspace is ready.'}
            </p>
          </div>
          <form className="space-y-5" onSubmit={submit}>
            {mode === 'register' && (
              <label className="block text-sm font-semibold text-slate-700">
                Full name
                <input className="field mt-2" name="name" value={form.name} onChange={update} placeholder="Your name" minLength={2} maxLength={60} required autoComplete="name" />
              </label>
            )}
            <label className="block text-sm font-semibold text-slate-700">
              Email address
              <input className="field mt-2" type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" required autoComplete="email" />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input className="field mt-2" type="password" name="password" value={form.password} onChange={update} placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'} minLength={mode === 'register' ? 8 : undefined} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
              {mode === 'register' && <span className="mt-2 block text-xs font-normal text-slate-400">Include uppercase, lowercase, and a number.</span>}
            </label>
            <button className="btn-primary w-full !py-3.5" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" size={18} /> : null}
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button className="font-bold text-blue-600 hover:text-blue-700" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} /> Your tasks are private to your account
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value, detail, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className={`rounded-xl p-2.5 ${color}`}><Icon size={19} /></span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</span>
        <span className="pb-1 text-xs text-slate-400">{detail}</span>
      </div>
    </div>
  );
}

function TaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState(task || blankTask);
  const [saving, setSaving] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...form,
        dueDate: new Date(`${form.dueDate}T12:00:00`).toISOString(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{task ? 'Edit task' : 'Create a task'}</h2>
            <p className="mt-1 text-sm text-slate-500">Give your next step a clear shape.</p>
          </div>
          <button className="rounded-xl p-2 text-slate-400 hover:bg-slate-100" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Task title
            <input className="field mt-2" name="title" value={form.title} onChange={change} minLength={2} maxLength={120} placeholder="What needs to get done?" required autoFocus />
          </label>
          <label className="block text-sm font-semibold text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span>
            <textarea className="field mt-2 resize-y" name="description" value={form.description || ''} onChange={change} rows={3} maxLength={1000} placeholder="Add a few useful details…" />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">Priority
              <select className="field mt-2" name="priority" value={form.priority} onChange={change}>
                {priorities.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">Category
              <select className="field mt-2" name="category" value={form.category} onChange={change}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <label className="block text-sm font-semibold text-slate-700">Due date
            <input className="field mt-2" type="date" name="dueDate" value={form.dueDate?.slice(0, 10) || ''} onChange={change} required />
          </label>
          <div className="flex gap-3 pt-3">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
            <button className="btn-primary flex-1" disabled={saving}>
              {saving && <LoaderCircle size={17} className="animate-spin" />}
              {task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout })

{
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks', {
        params: { search, status, priority, category, sortBy, page, limit: 8 },
      });
      setTasks(data.tasks || []);
      setPagination(data.pagination || { total: 0, page: 1, pages: 1 });
    } catch (error) {
      toast.error(messageFrom(error));
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, category, sortBy, page]);

  useEffect(() => {
    const timer = setTimeout(loadTasks, 250);
    return () => clearTimeout(timer);
  }, [loadTasks]);

  const stats = useMemo(() => ({
    total: pagination.total,
    completed: tasks.filter((t) => t.status === 'Completed').length,
    pending: tasks.filter((t) => t.status === 'Pending').length,
    high: tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length,
  }), [tasks, pagination.total]);

  async function saveTask(form) {
    try {
      if (modal?.task?._id) {
        await api.put(`/tasks/${modal.task._id}`, form);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', form);
        toast.success('Task created');
        setPage(1);
      }
      setModal(null);
      await loadTasks();
    } catch (error) {
      toast.error(messageFrom(error));
      throw error;
    }
  }

  async function toggleTask(task) {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.patch(`/tasks/${task._id}/status`, { status: nextStatus });
      toast.success(nextStatus === 'Completed' ? 'Nice work! Task completed.' : 'Task moved back to pending');
      await loadTasks();
    } catch (error) {
      toast.error(messageFrom(error));
    }
  }

  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success('Task deleted');
      if (tasks.length === 1 && page > 1) setPage(page - 1);
      else await loadTasks();
    } catch (error) {
      toast.error(messageFrom(error));
    }
  }

  const resetFilters = () => {
    setSearch('');
    setStatus('All');
    setPriority('All');
    setCategory('All');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {sidebarOpen && <button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/80 bg-white transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-600/20"><CheckCheck size={21} /></div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">TaskFlow<span className="text-blue-600">.</span></span>
          <button className="ml-auto rounded-lg p-1 text-slate-400 lg:hidden" onClick={() => setSidebarOpen(false)}><X size={19} /></button>
        </div>
        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
          <button className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-3.5 py-3 text-sm font-bold text-blue-700"><LayoutDashboard size={18} /> Overview <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" /></button>
          <button onClick={() => { setStatus('Pending'); setPage(1); setSidebarOpen(false); }} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"><ListTodo size={18} /> My tasks</button>
          <button onClick={() => { setStatus('Completed'); setPage(1); setSidebarOpen(false); }} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"><CheckCircle2 size={18} /> Completed</button>
        </div>
        <div className="px-4 pt-8">
          <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Categories</p>
          {categories.map((c, i) => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); setSidebarOpen(false); }} className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition ${category === c ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>
              <span className={`h-2 w-2 rounded-full ${['bg-blue-500', 'bg-violet-500', 'bg-pink-500', 'bg-slate-400'][i]}`} />{c}
            </button>
          ))}
          <button onClick={() => { setCategory('All'); setStatus('All'); setPage(1); }} className="mt-2 w-full rounded-lg px-3.5 py-2 text-left text-xs font-semibold text-blue-600 hover:bg-blue-50">Clear category filters</button>
        </div>
        <div className="mt-auto p-4">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white">
            <div className="mb-3 inline-flex rounded-lg bg-white/15 p-2"><Zap size={18} /></div>
            <p className="text-sm font-bold">Small steps, big wins.</p>
            <p className="mt-1 text-xs leading-5 text-blue-100">Stay consistent. Progress follows.</p>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-100 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</div>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{user?.name || 'My account'}</p><p className="truncate text-xs text-slate-400">{user?.email}</p></div>
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" onClick={onLogout} title="Sign out"><LogOut size={17} /></button>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/70 bg-white/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
            <div><p className="text-xs font-medium text-slate-400">Workspace / Overview</p><p className="mt-1 text-sm font-extrabold text-slate-800">My dashboard</p></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 sm:flex"><CalendarDays size={14} />{format(new Date(), 'EEE, MMM d')}</span>
            <div className="hidden h-7 w-px bg-slate-200 sm:block" />
            <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100" title="Notifications are not configured"><Bell size={19} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500" /></button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] p-5 sm:p-8">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"><Sparkles size={13} /> Your personal workspace</div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Good to see you, {(user?.name || 'there').split(' ')[0]} <span aria-hidden="true">👋</span></h1>
              <p className="mt-2 text-sm text-slate-500">Make today count, one task at a time.</p>
            </div>
            <button className="btn-primary self-start sm:self-auto" onClick={() => setModal({ task: null })}><Plus size={18} /> New task</button>
          </div>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Tasks in view" value={stats.total} detail="Matching filters" icon={ClipboardList} color="bg-blue-50 text-blue-600" />
            <StatCard label="Completed" value={stats.completed} detail="Current page" icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
            <StatCard label="Pending" value={stats.pending} detail="Current page" icon={Clock3} color="bg-amber-50 text-amber-600" />
            <StatCard label="High priority" value={stats.high} detail="Current page" icon={TrendingUp} color="bg-rose-50 text-rose-600" />
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:p-6 xl:flex-row xl:items-center">
              <div><h2 className="text-lg font-extrabold text-slate-900">Your tasks</h2><p className="mt-1 text-sm text-slate-400">Keep your priorities in sight.</p></div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:min-w-52"><Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input className="field !py-2.5 !pl-10" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search tasks…" /></div>
                <select className="field !w-full !py-2.5 sm:!w-36" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status"><option value="All">All status</option><option>Pending</option><option>Completed</option></select>
                <select className="field !w-full !py-2.5 sm:!w-36" value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }} aria-label="Filter by priority"><option value="All">All priority</option>{priorities.map((p) => <option key={p}>{p}</option>)}</select>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500"><span className="font-semibold text-slate-700">{pagination.total}</span> tasks found{category !== 'All' && <span className="rounded-md bg-blue-50 px-2 py-1 font-semibold text-blue-700">{category}</span>}</div>
              <div className="flex items-center gap-2"><label className="text-xs text-slate-400" htmlFor="sort">Sort by</label><select id="sort" className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 outline-none" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}><option value="createdAt">Recently added</option><option value="dueDate">Due date</option><option value="priority">Priority</option></select><button onClick={resetFilters} className="rounded-lg px-2 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50">Reset</button></div>
            </div>

            <TaskList
              loading={loading}
              tasks={tasks}
              search={search}
              status={status}
              category={category}
              priority={priority}
              page={page}
              pagination={pagination}
              onCreate={() => setModal({ task: null })}
              onToggle={toggleTask}
              onEdit={(task) => setModal({ task })}
              onDelete={deleteTask}
              onPageChange={setPage}
            />
          </section>
          <p className="mt-6 text-center text-xs text-slate-400">Made for focused work. One step at a time.</p>
        </main>
      </div>

      {modal && <TaskModal key={modal.task?._id || 'new-task'} task={modal.task} onClose={() => setModal(null)} onSave={saveTask} />}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(Boolean(localStorage.getItem('taskflow_token')));

  useEffect(() => {
    const token = localStorage.getItem('taskflow_token');
    if (!token) {
      setChecking(false);
      return;
    }
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('taskflow_token');
        setUser(null);
      })
      .finally(() => setChecking(false));
  }, []);

  function logout() {
    localStorage.removeItem('taskflow_token');
    setUser(null);
    toast.success('Signed out successfully');
  }

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="flex items-center gap-3 text-sm font-medium text-slate-500"><LoaderCircle size={22} className="animate-spin text-blue-600" /> Loading your workspace…</div></div>;
  }

  return user
  ?
   <Dashboard user={user} onLogout={logout} />
   : <AuthScreen onAuth={setUser} />;
}
