
import { ArrowDown, ArrowUp, LoaderCircle, Plus, Target } from 'lucide-react';
import { format } from 'date-fns';
import TaskCard from './TaskCard';

export default function TaskList({
  loading,
  tasks,
  search,
  status,
  category,
  priority,
  page,
  pagination,
  onCreate,
  onToggle,
  onEdit,
  onDelete,
  onPageChange,
}) {
  return (
    <>
      <div className="space-y-3 p-4 sm:p-6">
        {loading ? (
          <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-slate-400">
            <LoaderCircle size={20} className="animate-spin text-blue-600" />
            Loading your tasks…
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <div className="mb-4 rounded-2xl bg-blue-50 p-4 text-blue-600">
              <Target size={27} />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">
              Nothing on your list yet
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              {search || status !== 'All' || category !== 'All' || priority !== 'All'
                ? 'Try changing your filters, or create a task that matches.'
                : 'Start with one small task. You can build momentum from there.'}
            </p>
            <button className="btn-primary mt-5" onClick={onCreate}>
              <Plus size={17} /> Create your first task
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggle={onToggle}
              onEdit={(item) =>
                onEdit({
                  ...item,
                  dueDate: item.dueDate?.slice(0, 10) || format(new Date(), 'yyyy-MM-dd'),
                })
              }
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-slate-400">
          Page {pagination.page || page} of {pagination.pages || 1} · Showing up to 8 tasks per page
        </p>
        <div className="flex gap-2">
          <button
            className="btn-secondary !py-2 text-xs"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange((current) => current - 1)}
          >
            <ArrowDown size={14} className="rotate-90" /> Previous
          </button>
          <button
            className="btn-secondary !py-2 text-xs"
            disabled={page >= (pagination.pages || 1) || loading}
            onClick={() => onPageChange((current) => current + 1)}
          >
            Next <ArrowUp size={14} className="rotate-90" />
          </button>
        </div>
      </div>
    </>
  );
}
