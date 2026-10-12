import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import {
  ArrowDown,
  ArrowUp,
  CheckCheck,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LoaderCircle,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';

import { format } from 'date-fns';
import { messageFrom } from './utils/taskUtils';
import StatCard from './components/StatCard';
import TaskModal from './components/TaskModal';
import TaskCard from './components/TaskCard';
import TaskToolbar from './components/TaskToolbar';
import Sidebar from './layout/Sidebar';
import DashboardHeader from './layout/DashboardHeader';
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



function Dashboard({ user, onLogout, theme, onToggleTheme }) {
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
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setStatus={setStatus}
        setPage={setPage}
        setCategory={setCategory}
        categories={categories}
        category={category}
        user={user}
        onLogout={onLogout}
      />

      <div className="min-h-screen lg:pl-64">
        <DashboardHeader
          user={user}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

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
            <TaskToolbar
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
              priority={priority}
              setPriority={setPriority}
              priorities={priorities}
              category={category}
              sortBy={sortBy}
              setSortBy={setSortBy}
              pagination={pagination}
              onReset={resetFilters}
              setPage={setPage}
            />

            <div className="space-y-3 p-4 sm:p-6">
              {loading ? (
                <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-slate-400"><LoaderCircle size={20} className="animate-spin text-blue-600" /> Loading your tasks…</div>
              ) : tasks.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
                  <div className="mb-4 rounded-2xl bg-blue-50 p-4 text-blue-600"><Target size={27} /></div>
                  <h3 className="text-base font-extrabold text-slate-800">Nothing on your list yet</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">{search || status !== 'All' || category !== 'All' || priority !== 'All' ? 'Try changing your filters, or create a task that matches.' : 'Start with one small task. You can build momentum from there.'}</p>
                  <button className="btn-primary mt-5" onClick={() => setModal({ task: null })}><Plus size={17} /> Create your first task</button>
                </div>
              ) : tasks.map((task) => (
                <TaskCard key={task._id} task={task} onToggle={toggleTask} onEdit={(t) => setModal({ task: { ...t, dueDate: t.dueDate?.slice(0, 10) || format(new Date(), 'yyyy-MM-dd') } })} onDelete={deleteTask} />
              ))}
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-slate-400">Page {pagination.page || page} of {pagination.pages || 1} · Showing up to 8 tasks per page</p>
              <div className="flex gap-2">
                <button className="btn-secondary !py-2 text-xs" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}><ArrowDown size={14} className="rotate-90" /> Previous</button>
                <button className="btn-secondary !py-2 text-xs" disabled={page >= (pagination.pages || 1) || loading} onClick={() => setPage((p) => p + 1)}>Next <ArrowUp size={14} className="rotate-90" /></button>
              </div>
            </div>
          </section>
          <p className="mt-6 text-center text-xs text-slate-400">Made for focused work. One step at a time.</p>
        </main>
      </div>

      {modal && (
        <TaskModal
          key={modal.task?._id || 'new-task'}
          task={modal.task}
          onClose={() => setModal(null)}
          onSave={saveTask}
          priorities={priorities}
          categories={categories}
        />
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(Boolean(localStorage.getItem('taskflow_token')));

    const [theme, setTheme] = useState(
    () => localStorage.getItem('taskflow_theme') || 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

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
   <Dashboard user={user} onLogout={logout} theme={theme} onToggleTheme={toggleTheme} /> 
   : <AuthScreen onAuth={setUser} />;
}
   

