import { useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { router, useNavigation } from "expo-router";
import { Field } from "@/components/Field";
import { addTask } from "@/lib/tasks";

export default function NewTaskScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [outcome, setOutcome] = useState("");
  const [stepLabel, setStepLabel] = useState("");
  const [saving, setSaving] = useState(false);

  const isValid =
    title.trim().length > 0 && outcome.trim().length > 0 && stepLabel.trim().length > 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Nouvelle tâche",
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
              await addTask({
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
  }, [navigation, isValid, saving, title, outcome, stepLabel]);

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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
