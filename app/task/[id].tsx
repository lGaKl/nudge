import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { tasks } from "@/db/schema";
import { TaskForm, type TaskFormValues } from "@/components/TaskForm";
import { archiveTask, parseSteps, updateTask } from "@/lib/tasks";
import { parseRecurrence } from "@/lib/schedule";

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<TaskFormValues | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [row] = await db.select().from(tasks).where(eq(tasks.id, id));
      if (cancelled) return;
      if (!row) {
        router.back();
        return;
      }
      setInitialValues({
        title: row.title,
        outcome: row.outcome,
        steps: parseSteps(row.stepsJson),
        recurrence: parseRecurrence(row.recurrenceJson),
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!initialValues) {
    return <View className="flex-1 bg-bg" />;
  }

  return (
    <TaskForm
      title="Modifier"
      submitLabel="Enregistrer"
      initialValues={initialValues}
      onCancel={() => router.back()}
      onSubmit={async (values) => {
        await updateTask(id, values);
        router.back();
      }}
      footer={
        <Pressable
          onPress={async () => {
            await archiveTask(id);
            router.back();
          }}
          hitSlop={8}
          className="mt-4 items-center py-4"
        >
          <Text className="text-muted text-base">Archiver</Text>
        </Pressable>
      }
    />
  );
}
