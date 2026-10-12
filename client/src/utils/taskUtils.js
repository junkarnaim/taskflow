import { format, isToday, isTomorrow, parseISO } from 'date-fns';

export function messageFrom(error) {
  return error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.msg ||
    error?.message ||
    'Something went wrong. Please try again.';
}

export function dateLabel(value) {
  if (!value) return 'No due date';
  const date = parseISO(value.slice(0, 10));
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d, yyyy');
}
