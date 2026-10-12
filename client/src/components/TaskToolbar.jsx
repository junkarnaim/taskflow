import { Search } from 'lucide-react';

export default function TaskToolbar({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  priorities,
  category,
  sortBy,
  setSortBy,
  pagination,
  onReset,
  setPage,
}) {
  return (
    <>
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:p-6 xl:flex-row xl:items-center">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Your tasks</h2>
          <p className="mt-1 text-sm text-slate-400">
            Keep your priorities in sight.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 sm:min-w-52">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="field !py-2.5 !pl-10"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search tasks…"
              aria-label="Search tasks"
            />
          </div>

          <select
            className="field !w-full !py-2.5 sm:!w-36"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
          >
            <option value="All">All status</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>

          <select
            className="field !w-full !py-2.5 sm:!w-36"
            value={priority}
            onChange={(event) => {
              setPriority(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by priority"
          >
            <option value="All">All priority</option>
            {priorities.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">
            {pagination.total}
          </span>
          {' '}tasks found
          {category !== 'All' && (
            <span className="rounded-md bg-blue-50 px-2 py-1 font-semibold text-blue-700">
              {category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400" htmlFor="sort">
            Sort by
          </label>
          <select
            id="sort"
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-600 outline-none"
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value);
              setPage(1);
            }}
          >
            <option value="createdAt">Recently added</option>
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
          </select>
          <button
            onClick={onReset}
            className="rounded-lg px-2 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
