import "react-native-get-random-values";
import "../global.css";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useDbMigrations } from "@/db/migrate";
import { seedIfEmpty } from "@/lib/seed";
import { colors } from "@/lib/theme";

const modalScreenOptions = {
  presentation: "modal",
  headerShown: true,
  headerTitleStyle: { color: colors.fg },
  headerStyle: { backgroundColor: colors.bg },
  headerShadowVisible: false,
} as const;

export default function RootLayout() {
  const { success: migrationsReady, error: migrationError } = useDbMigrations();
  const [seeded, setSeeded] = useState(false);
  const [seedError, setSeedError] = useState<Error | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!migrationsReady) return;
    let cancelled = false;
    setSeedError(null);
    seedIfEmpty()
      .then(() => {
        if (!cancelled) setSeeded(true);
      })
      .catch((e) => {
        if (!cancelled) setSeedError(e instanceof Error ? e : new Error(String(e)));
      });
    return () => {
      cancelled = true;
    };
  }, [migrationsReady, retryKey]);

  const error = migrationError ?? seedError;

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-fg text-lg text-center">Quelque chose a buggé côté données.</Text>
        <Text className="text-muted text-base text-center mt-2">
          Pas grave. Essaie à nouveau dans un instant.
        </Text>
        <Pressable
          onPress={() => {
            setSeedError(null);
            setSeeded(false);
            setRetryKey((k) => k + 1);
          }}
          className="mt-8 px-6 py-3 bg-accent rounded-2xl"
        >
          <Text className="text-white text-base">Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  if (!migrationsReady || !seeded) {
    return <View className="flex-1 bg-bg" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="task/new" options={modalScreenOptions} />
      <Stack.Screen name="task/[id]" options={modalScreenOptions} />
    </Stack>
  );
}
