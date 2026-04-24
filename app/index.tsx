import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { isNull } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/db/client";
import { tasks } from "@/db/schema";
import { parseSteps } from "@/lib/tasks";
import { getTasksForDate } from "@/lib/schedule";

type ViewMode = "today" | "all";

type TaskCard = {
  id: string;
  title: string;
  outcome: string;
  stepCount: number;
};

const SEGMENTS: { mode: ViewMode; label: string }[] = [
  { mode: "today", label: "Aujourd'hui" },
  { mode: "all", label: "Toutes" },
];

export default function Index() {
  const { data } = useLiveQuery(db.select().from(tasks).where(isNull(tasks.archivedAt)));
  const [viewMode, setViewMode] = useState<ViewMode>("today");
  const today = useMemo(() => new Date(), []);

  const cards = useMemo<TaskCard[]>(() => {
    const filtered = viewMode === "today" ? getTasksForDate(data, today) : data;
    return filtered.map((t) => ({
      id: t.id,
      title: t.title,
      outcome: t.outcome,
      stepCount: parseSteps(t.stepsJson).length,
    }));
  }, [data, today, viewMode]);

  return (
    <View className="flex-1 bg-bg">
      <View className="pt-20 px-6 pb-4">
        <Text className="text-fg text-3xl">Bonjour 👋</Text>
      </View>
      <View className="flex-row gap-2 px-6 pb-4">
        {SEGMENTS.map((segment) => {
          const active = segment.mode === viewMode;
          return (
            <Pressable
              key={segment.mode}
              onPress={() => setViewMode(segment.mode)}
              className={`flex-1 rounded-2xl py-3 items-center ${active ? "bg-accent" : "bg-soft"}`}
            >
              <Text className={active ? "text-white text-sm" : "text-fg text-sm"}>
                {segment.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, flexGrow: 1 }}
        ItemSeparatorComponent={Separator}
        renderItem={renderCard}
        ListEmptyComponent={<EmptyState mode={viewMode} />}
      />
      <Pressable
        onPress={() => router.push("/task/new")}
        className="absolute bottom-10 right-6 w-14 h-14 bg-accent rounded-full items-center justify-center shadow-lg active:opacity-80"
        accessibilityLabel="Nouvelle tâche"
      >
        <Text className="text-white text-3xl leading-8">+</Text>
      </Pressable>
    </View>
  );
}

function Separator() {
  return <View className="h-3" />;
}

function renderCard({ item }: { item: TaskCard }) {
  return (
    <Pressable
      onPress={() => router.push(`/task/${item.id}`)}
      className="bg-soft rounded-2xl p-5 active:opacity-70"
    >
      <Text className="text-fg text-lg">{item.title}</Text>
      <Text className="text-muted text-sm mt-1">{item.outcome}</Text>
      <Text className="text-muted text-xs mt-3">
        {item.stepCount} étape{item.stepCount > 1 ? "s" : ""}
      </Text>
    </Pressable>
  );
}

function EmptyState({ mode }: { mode: ViewMode }) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="text-muted text-base text-center">
        {mode === "today" ? "Rien aujourd'hui. Respire." : "Aucune tâche. Crée-en une avec le + en bas."}
      </Text>
    </View>
  );
}
