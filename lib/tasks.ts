import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { tasks } from "@/db/schema";
import type { Recurrence, Step } from "./types";

export type TaskInput = {
  title: string;
  outcome: string;
  steps: Step[];
  recurrence: Recurrence | null;
};

export function parseSteps(stepsJson: string): Step[] {
  return JSON.parse(stepsJson) as Step[];
}

export async function addTask(input: TaskInput): Promise<string> {
  const id = uuidv4();
  await db.insert(tasks).values({
    id,
    title: input.title,
    outcome: input.outcome,
    stepsJson: JSON.stringify(input.steps),
    recurrenceJson: input.recurrence ? JSON.stringify(input.recurrence) : null,
    scheduledAt: null,
    notifyAt: null,
    musicQuery: null,
    createdAt: new Date(),
    archivedAt: null,
  });
  return id;
}

export async function updateTask(id: string, input: TaskInput): Promise<void> {
  await db
    .update(tasks)
    .set({
      title: input.title,
      outcome: input.outcome,
      stepsJson: JSON.stringify(input.steps),
      recurrenceJson: input.recurrence ? JSON.stringify(input.recurrence) : null,
    })
    .where(eq(tasks.id, id));
}

export async function archiveTask(id: string): Promise<void> {
  await db.update(tasks).set({ archivedAt: new Date() }).where(eq(tasks.id, id));
}
