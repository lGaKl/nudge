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
import { v4 as uuidv4 } from "uuid";
import type { Recurrence, Step } from "@/lib/types";
import { Field } from "./Field";
import { StepsEditor } from "./StepsEditor";
import { RecurrencePicker } from "./RecurrencePicker";

export type TaskFormValues = {
  title: string;
  outcome: string;
  steps: Step[];
  recurrence: Recurrence | null;
};

type Props = {
  title: string;
  initialValues?: TaskFormValues;
  submitLabel: string;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
  footer?: ReactNode;
};

function emptyValues(): TaskFormValues {
  return {
    title: "",
    outcome: "",
    steps: [{ id: uuidv4(), label: "" }],
    recurrence: null,
  };
}

function isValid(values: TaskFormValues): boolean {
  if (values.title.trim().length === 0) return false;
  if (values.outcome.trim().length === 0) return false;
  if (values.steps.length === 0) return false;
  if (values.steps.some((s) => s.label.trim().length === 0)) return false;
  if (values.recurrence?.kind === "weekly" && values.recurrence.weekdays.length === 0) return false;
  if (values.recurrence?.kind === "monthly" && values.recurrence.daysOfMonth.length === 0)
    return false;
  return true;
}

export function TaskForm({
  title: screenTitle,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  footer,
}: Props) {
  const navigation = useNavigation();
  const [values, setValues] = useState<TaskFormValues>(() => initialValues ?? emptyValues());
  const [submitting, setSubmitting] = useState(false);

  const valid = isValid(values);

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
            if (!valid || submitting) return;
            setSubmitting(true);
            try {
              await onSubmit({
                title: values.title.trim(),
                outcome: values.outcome.trim(),
                steps: values.steps.map((s) => ({ ...s, label: s.label.trim() })),
                recurrence: values.recurrence,
              });
            } catch {
              setSubmitting(false);
            }
          }}
          disabled={!valid || submitting}
          hitSlop={12}
        >
          <Text
            className={
              valid && !submitting
                ? "text-accent text-base font-medium"
                : "text-muted text-base"
            }
          >
            {submitLabel}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, screenTitle, valid, submitting, values, onSubmit, onCancel, submitLabel]);

  return (
    <View className="flex-1 bg-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 24, gap: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Field
            label="Titre"
            value={values.title}
            onChangeText={(title) => setValues({ ...values, title })}
            placeholder="Faire la vaisselle"
          />
          <Field
            label="Ce que ça t'apporte"
            value={values.outcome}
            onChangeText={(outcome) => setValues({ ...values, outcome })}
            placeholder="Une cuisine prête pour demain matin"
            multiline
          />
          <StepsEditor
            steps={values.steps}
            onChange={(steps) => setValues({ ...values, steps })}
          />
          <RecurrencePicker
            recurrence={values.recurrence}
            onChange={(recurrence) => setValues({ ...values, recurrence })}
          />
          {footer}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
