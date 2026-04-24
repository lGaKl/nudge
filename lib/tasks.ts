import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { tasks } from "@/db/schema";
import type { Step } from "./types";

export type TaskInput = {
  title: string;
  outcome: string;
  stepLabel: string;
};

export async function addTask(input: TaskInput): Promise<string> {
  const id = uuidv4();
  const steps: Step[] = [{ id: uuidv4(), label: input.stepLabel }];
  await db.insert(tasks).values({
    id,
    title: input.title,
    outcome: input.outcome,
    stepsJson: JSON.stringify(steps),
    recurrenceJson: null,
    scheduledAt: null,
    notifyAt: null,
    musicQuery: null,
    createdAt: new Date(),
    archivedAt: null,
  });
  return id;
}

export async function updateTask(id: string, input: TaskInput): Promise<void> {
  const [existing] = await db.select().from(tasks).where(eq(tasks.id, id));
  if (!existing) throw new Error(`Task ${id} not found`);
  const existingSteps = JSON.parse(existing.stepsJson) as Step[];
  const firstStepId = existingSteps[0]?.id ?? uuidv4();
  const steps: Step[] = [{ id: firstStepId, label: input.stepLabel }];
  await db
    .update(tasks)
    .set({
      title: input.title,
      outcome: input.outcome,
      stepsJson: JSON.stringify(steps),
    })
    .where(eq(tasks.id, id));
}

export async function archiveTask(id: string): Promise<void> {
  await db.update(tasks).set({ archivedAt: new Date() }).where(eq(tasks.id, id));
}
