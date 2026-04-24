import type { Recurrence } from "./types";

export type ScheduledTask = {
  recurrenceJson: string | null;
  scheduledAt: Date | null;
  archivedAt: Date | null;
};

type LegacyRecurrence = { kind: "monthly"; dayOfMonth: number };

function normalizeRecurrence(parsed: Recurrence | LegacyRecurrence): Recurrence {
  if (parsed.kind === "monthly" && "dayOfMonth" in parsed) {
    return { kind: "monthly", daysOfMonth: [parsed.dayOfMonth] };
  }
  return parsed as Recurrence;
}

export function parseRecurrence(recurrenceJson: string | null): Recurrence | null {
  if (!recurrenceJson) return null;
  const parsed = JSON.parse(recurrenceJson) as Recurrence | LegacyRecurrence;
  return normalizeRecurrence(parsed);
}

export function isTaskForDate(task: ScheduledTask, date: Date): boolean {
  if (task.archivedAt) return false;

  const recurrence = parseRecurrence(task.recurrenceJson);

  if (recurrence === null) {
    if (task.scheduledAt === null) return true;
    return sameDay(task.scheduledAt, date);
  }

  switch (recurrence.kind) {
    case "daily":
      return true;
    case "weekly":
      return recurrence.weekdays.includes(date.getDay());
    case "monthly":
      return recurrence.daysOfMonth.includes(date.getDate());
  }
}

export function getTasksForDate<T extends ScheduledTask>(allTasks: readonly T[], date: Date): T[] {
  return allTasks.filter((t) => isTaskForDate(t, date));
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
