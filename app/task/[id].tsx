import { useEffect, useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { tasks } from "@/db/schema";
import { Field } from "@/components/Field";
import { archiveTask, updateTask } from "@/lib/tasks";
import type { Step } from "@/lib/types";

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [outcome, setOutcome] = useState("");
  const [stepLabel, setStepLabel] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [row] = await db.select().from(tasks).where(eq(tasks.id, id));
      if (cancelled) return;
      if (!row) {
        router.back();
        return;
      }
      const steps = JSON.parse(row.stepsJson) as Step[];
      setTitle(row.title);
      setOutcome(row.outcome);
      setStepLabel(steps[0]?.label ?? "");
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const isValid =
    title.trim().length > 0 && outcome.trim().length > 0 && stepLabel.trim().length > 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Modifier",
      headerLeft: () => (
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text className="text-accent text-base">Annuler</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={async () => {
            if (!isValid || saving) return;
            setSaving(true);
            try {
              await updateTask(id, {
                title: title.trim(),
                outcome: outcome.trim(),
                stepLabel: stepLabel.trim(),
              });
              router.back();
            } catch {
              setSaving(false);
            }
          }}
          disabled={!isValid || saving}
          hitSlop={12}
        >
          <Text
            className={
              isValid && !saving ? "text-accent text-base font-medium" : "text-muted text-base"
            }
          >
            Enregistrer
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, isValid, saving, title, outcome, stepLabel, id]);

  const handleArchive = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await archiveTask(id);
      router.back();
    } catch {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 24, gap: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {loaded && (
            <>
              <Field
                label="Titre"
                value={title}
                onChangeText={setTitle}
                placeholder="Faire la vaisselle"
              />
              <Field
                label="Ce que ça t'apporte"
                value={outcome}
                onChangeText={setOutcome}
                placeholder="Une cuisine prête pour demain matin"
                multiline
              />
              <Field
                label="Première étape"
                value={stepLabel}
                onChangeText={setStepLabel}
                placeholder="Ridiculement facile (ex: ouvrir le robinet)"
              />
              <Pressable
                onPress={handleArchive}
                disabled={saving}
                hitSlop={8}
                className="mt-4 items-center py-4"
              >
                <Text className="text-muted text-base">Archiver</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
