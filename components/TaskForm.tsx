import { useLayoutEffect, useState, type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useNavigation } from "expo-router";
import { Field } from "./Field";

export type TaskFormValues = {
  title: string;
  outcome: string;
  stepLabel: string;
};

type Props = {
  title: string;
  initialValues?: TaskFormValues;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
  footer?: ReactNode;
};

const EMPTY: TaskFormValues = { title: "", outcome: "", stepLabel: "" };

export function TaskForm({
  title: screenTitle,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  footer,
}: Props) {
  const navigation = useNavigation();
  const [title, setTitle] = useState(initialValues?.title ?? EMPTY.title);
  const [outcome, setOutcome] = useState(initialValues?.outcome ?? EMPTY.outcome);
  const [stepLabel, setStepLabel] = useState(initialValues?.stepLabel ?? EMPTY.stepLabel);
  const [submitting, setSubmitting] = useState(false);

  const isValid =
    title.trim().length > 0 && outcome.trim().length > 0 && stepLabel.trim().length > 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: screenTitle,
      headerLeft: () => (
        <Pressable onPress={onCancel} hitSlop={12}>
          <Text className="text-accent text-base">Annuler</Text>
        </Pressable>
      ),
      headerRight: () => (
        <Pressable
          onPress={async () => {
            if (!isValid || submitting) return;
            setSubmitting(true);
            try {
              await onSubmit({
                title: title.trim(),
                outcome: outcome.trim(),
                stepLabel: stepLabel.trim(),
              });
            } catch {
              setSubmitting(false);
            }
          }}
          disabled={!isValid || submitting}
          hitSlop={12}
        >
          <Text
            className={
              isValid && !submitting
                ? "text-accent text-base font-medium"
                : "text-muted text-base"
            }
          >
            {submitLabel}
          </Text>
        </Pressable>
      ),
    });
  }, [
    navigation,
    screenTitle,
    isValid,
    submitting,
    title,
    outcome,
    stepLabel,
    onSubmit,
    onCancel,
    submitLabel,
  ]);

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
          {footer}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
