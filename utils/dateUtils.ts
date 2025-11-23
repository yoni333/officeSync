/**
 * Returns the Sunday of the week for a given date.
 * If the date is Sunday, returns itself.
 */
export const getStartOfWeek = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay(); // 0 is Sunday
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Returns an array of 5 Date objects (Sunday to Thursday) for the week starting at `startDate`.
 */
export const getWorkWeekDays = (startOfWeek: Date): Date[] => {
  const days: Date[] = [];
  const start = new Date(startOfWeek);
  
  for (let i = 0; i < 5; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
};

/**
 * Formats a date to YYYY-MM-DD string for map keys
 */
export const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Formats a date for display (e.g. 23/10)
 */
export const formatDateDisplay = (date: Date): string => {
  return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
};

/**
 * Adds (or subtracts) weeks to a date
 */
export const addWeeks = (date: Date, weeks: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + (weeks * 7));
  return d;
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
    return formatDateKey(d1) === formatDateKey(d2);
}