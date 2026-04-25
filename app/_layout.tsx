import "react-native-get-random-values";
import "../global.css";
import { useEffect, useMemo, useState } from "react";
import { Stack } from "expo-router";
import { Text, useColorScheme, View } from "react-native";
import { useDbMigrations } from "@/db/migrate";
import { seedIfEmpty } from "@/lib/seed";
import { colors, colorsDark } from "@/lib/theme";
import { Button } from "@/components/Button";

export default function RootLayout() {
  const scheme = useColorScheme();
  const themeColors = scheme === "dark" ? colorsDark : colors;

  const modalScreenOptions = useMemo(
    () =>
      ({
        presentation: "modal",
        headerShown: true,
        headerTitleStyle: { color: themeColors.fg },
        headerStyle: { backgroundColor: themeColors.bg },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: themeColors.bg },
      }) as const,
    [themeColors],
  );

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
      <View className="flex-1 items-center justify-center bg-bg dark:bg-bg-dark px-6">
        <Text className="text-fg dark:text-fg-dark text-title text-center">
          Quelque chose a buggé côté données.
        </Text>
        <Text className="text-muted dark:text-muted-dark text-body text-center mt-2">
          Pas grave. Essaie à nouveau dans un instant.
        </Text>
        <View className="mt-8">
          <Button
            onPress={() => {
              setSeedError(null);
              setSeeded(false);
              setRetryKey((k) => k + 1);
            }}
            haptic="medium"
          >
            Réessayer
          </Button>
        </View>
      </View>
    );
  }

  if (!migrationsReady || !seeded) {
    return <View className="flex-1 bg-bg dark:bg-bg-dark" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: themeColors.bg } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="task/new" options={modalScreenOptions} />
      <Stack.Screen name="task/[id]" options={modalScreenOptions} />
    </Stack>
  );
}
