import { useState } from 'react';
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { dateLabel } from '../utils/taskUtils';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [menu, setMenu] = useState(false);
  const completed = task.status === 'Completed';

  const priorityStyle = {
    High: 'bg-rose-50 text-rose-600',
    Medium: 'bg-amber-50 text-amber-700',
    Low: 'bg-emerald-50 text-emerald-700',
  };

  const categoryStyle = {
    Work: 'bg-blue-50 text-blue-700',
    Study: 'bg-violet-50 text-violet-700',
    Personal: 'bg-pink-50 text-pink-700',
    Other: 'bg-slate-100 text-slate-600',
  };

  return (
    <article
      className={`group rounded-2xl border bg-white p-4 transition hover:border-blue-200 hover:shadow-soft sm:p-5 ${
        completed
          ? 'border-slate-100 opacity-75'
          : 'border-slate-200/80'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <button
          className={`mt-0.5 shrink-0 rounded-full transition ${
            completed
              ? 'text-emerald-500'
              : 'text-slate-300 hover:text-blue-600'
          }`}
          onClick={() => onToggle(task)}
          aria-label={completed ? 'Mark pending' : 'Mark completed'}
        >
          {completed ? <CheckCircle2 size={23} /> : <Circle size={23} />}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={`break-words text-sm font-bold leading-6 ${
              completed
                ? 'text-slate-400 line-through'
                : 'text-slate-800'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 line-clamp-2 whitespace-pre-line text-sm leading-6 text-slate-500">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                priorityStyle[task.priority] || priorityStyle.Medium
              }`}
            >
              {task.priority}
            </span>

            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                categoryStyle[task.category] || categoryStyle.Other
              }`}
            >
              {task.category}
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <CalendarDays size={13} />
              {dateLabel(task.dueDate)}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            className="rounded-lg p-2 text-slate-400 opacity-100 hover:bg-slate-100 sm:opacity-0 sm:group-hover:opacity-100"
            onClick={() => setMenu(!menu)}
            aria-label="Task options"
          >
            <MoreHorizontal size={19} />
          </button>

          {menu && (
            <div className="absolute right-0 top-10 z-10 w-36 rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl">
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
                onClick={() => {
                  setMenu(false);
                  onEdit(task);
                }}
              >
                <Activity size={15} />
                Edit task
              </button>

              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                onClick={() => {
                  setMenu(false);
                  onDelete(task);
                }}
              >
                <Trash2 size={15} />
                Delete task
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
