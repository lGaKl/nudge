import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  outcome: text("outcome").notNull(),
  stepsJson: text("steps_json").notNull(),
  recurrenceJson: text("recurrence_json"),
  scheduledAt: integer("scheduled_at", { mode: "timestamp" }),
  notifyAt: integer("notify_at", { mode: "timestamp" }),
  musicQuery: text("music_query"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  archivedAt: integer("archived_at", { mode: "timestamp" }),
});

export const taskInstances = sqliteTable("task_instances", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull().references(() => tasks.id),
  date: text("date").notNull(),
  completedStepsJson: text("completed_steps_json").notNull().default("[]"),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  skippedAt: integer("skipped_at", { mode: "timestamp" }),
});
