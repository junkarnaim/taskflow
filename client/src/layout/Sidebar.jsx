import {
  CheckCheck,
  CheckCircle2,
  LayoutDashboard,
  ListTodo,
  LogOut,
  X,
  Zap,
} from 'lucide-react';

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  setStatus,
  setPage,
  setCategory,
  categories,
  category,
  user,
  onLogout,
}) {
  return (
    <>
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
    </>
  );
}
