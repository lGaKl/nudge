import { v4 as uuidv4 } from "uuid";
import { db } from "@/db/client";
import { tasks } from "@/db/schema";
import type { Step } from "./types";

export async function seedIfEmpty(): Promise<void> {
  const existing = await db.select({ id: tasks.id }).from(tasks).limit(1);
  if (existing.length > 0) return;

  const steps: Step[] = [
    { id: uuidv4(), label: "Ouvrir le robinet" },
    { id: uuidv4(), label: "Laver les verres" },
    { id: uuidv4(), label: "Laver les assiettes" },
  ];

  await db.insert(tasks).values({
    id: uuidv4(),
    title: "Faire la vaisselle",
    outcome: "Une cuisine prête pour demain matin",
    stepsJson: JSON.stringify(steps),
    recurrenceJson: null,
    scheduledAt: null,
    notifyAt: null,
    musicQuery: null,
    createdAt: new Date(),
    archivedAt: null,
  });
}
