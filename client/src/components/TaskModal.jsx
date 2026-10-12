import { useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';

const blankTask = {
  title: '',
  description: '',
  priority: 'Medium',
  category: 'Work',
  dueDate: new Date().toISOString().slice(0, 10),
};

export default function TaskModal({
  task,
  onClose,
  onSave,
  priorities,
  categories,
}) {
  const [form, setForm] = useState(task || blankTask);
  const [saving, setSaving] = useState(false);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="my-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {task ? 'Edit task' : 'Create a task'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Give your next step a clear shape.
            </p>
          </div>

          <button
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Task title
            <input
              className="field mt-2"
              name="title"
              value={form.title}
              onChange={change}
              minLength={2}
              maxLength={120}
              placeholder="What needs to get done?"
              required
              autoFocus
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Description <span className="font-normal text-slate-400">(optional)</span>
            <textarea
              className="field mt-2 resize-y"
              name="description"
              value={form.description || ''}
              onChange={change}
              rows={3}
              maxLength={1000}
              placeholder="Add a few useful details…"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">
              Priority
              <select
                className="field mt-2"
                name="priority"
                value={form.priority}
                onChange={change}
              >
                {priorities.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Category
              <select
                className="field mt-2"
                name="category"
                value={form.category}
                onChange={change}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Due date
            <input
              className="field mt-2"
              type="date"
              name="dueDate"
              value={form.dueDate?.slice(0, 10) || ''}
              onChange={change}
              required
            />
          </label>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={onClose}
            >
              Cancel
            </button>

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
