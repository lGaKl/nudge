import { FlatList, Text, View } from "react-native";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/db/client";
import { tasks } from "@/db/schema";
import type { Step } from "@/lib/types";

export default function Index() {
  const { data } = useLiveQuery(db.select().from(tasks));

  return (
    <View className="flex-1 bg-bg">
      <View className="pt-20 px-6 pb-6">
        <Text className="text-fg text-3xl">Bonjour 👋</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => {
          const steps = JSON.parse(item.stepsJson) as Step[];
          return (
            <View className="bg-soft rounded-2xl p-5">
              <Text className="text-fg text-lg">{item.title}</Text>
              <Text className="text-muted text-sm mt-1">{item.outcome}</Text>
              <Text className="text-muted text-xs mt-3">
                {steps.length} étape{steps.length > 1 ? "s" : ""}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
