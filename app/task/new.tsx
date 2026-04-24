import { router } from "expo-router";
import { TaskForm } from "@/components/TaskForm";
import { addTask } from "@/lib/tasks";

export default function NewTaskScreen() {
  return (
    <TaskForm
      title="Nouvelle tâche"
      submitLabel="Enregistrer"
      onCancel={() => router.back()}
      onSubmit={async (values) => {
        await addTask(values);
        router.back();
      }}
    />
  );
}
