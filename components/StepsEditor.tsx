import { Pressable, Text, TextInput, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { alpha } from "@/lib/theme";
import type { Step } from "@/lib/types";

type Props = {
  steps: Step[];
  onChange: (steps: Step[]) => void;
};

export function StepsEditor({ steps, onChange }: Props) {
  const updateLabel = (index: number, label: string) => {
    onChange(steps.map((s, i) => (i === index ? { ...s, label } : s)));
  };

  const remove = (index: number) => {
    if (steps.length <= 1) return;
    onChange(steps.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([...steps, { id: uuidv4(), label: "" }]);
  };

  return (
    <View className="gap-3">
      <Text className="text-muted text-sm">Étapes</Text>
      {steps.map((step, i) => (
        <View key={step.id} className="flex-row gap-2 items-start">
          <TextInput
            value={step.label}
            onChangeText={(label) => updateLabel(i, label)}
            placeholder={
              i === 0 ? "Ridiculement facile (ex: ouvrir le robinet)" : `Étape ${i + 1}`
            }
            placeholderTextColor={alpha.placeholder}
            className="flex-1 bg-soft rounded-2xl px-4 py-4 text-fg text-base"
          />
          {steps.length > 1 && (
            <Pressable
              onPress={() => remove(i)}
              hitSlop={12}
              className="w-11 h-11 items-center justify-center"
              accessibilityLabel={`Retirer l'étape ${i + 1}`}
            >
              <Text className="text-muted text-2xl leading-6">×</Text>
            </Pressable>
          )}
        </View>
      ))}
      <Pressable onPress={add} hitSlop={8} className="py-3 items-center">
        <Text className="text-accent text-base">+ ajouter une étape</Text>
      </Pressable>
    </View>
  );
}
