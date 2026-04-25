import { Pressable, Text, TextInput, useColorScheme, View } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { Plus, X } from "lucide-react-native";
import { alpha, colors, colorsDark } from "@/lib/theme";
import type { Step } from "@/lib/types";
import * as haptics from "@/lib/haptics";

type Props = {
  steps: Step[];
  onChange: (steps: Step[]) => void;
};

export function StepsEditor({ steps, onChange }: Props) {
  const scheme = useColorScheme();
  const placeholderColor = scheme === "dark" ? alpha.placeholderDark : alpha.placeholder;
  const iconColor = scheme === "dark" ? colorsDark.muted : colors.muted;
  const accentColor = scheme === "dark" ? colorsDark.accent : colors.accent;

  const updateLabel = (index: number, label: string) => {
    onChange(steps.map((s, i) => (i === index ? { ...s, label } : s)));
  };

  const remove = (index: number) => {
    if (steps.length <= 1) return;
    haptics.tapLight();
    onChange(steps.filter((_, i) => i !== index));
  };

  const add = () => {
    haptics.tapLight();
    onChange([...steps, { id: uuidv4(), label: "" }]);
  };

  return (
    <View className="gap-3">
      <Text className="text-muted dark:text-muted-dark text-caption">Étapes</Text>
      {steps.map((step, i) => (
        <View key={step.id} className="flex-row gap-2 items-start">
          <TextInput
            value={step.label}
            onChangeText={(label) => updateLabel(i, label)}
            placeholder={
              i === 0 ? "Ridiculement facile (ex: ouvrir le robinet)" : `Étape ${i + 1}`
            }
            placeholderTextColor={placeholderColor}
            className="flex-1 bg-soft dark:bg-soft-dark rounded-2xl px-4 py-4 text-fg dark:text-fg-dark text-body"
          />
          {steps.length > 1 && (
            <Pressable
              onPress={() => remove(i)}
              hitSlop={12}
              className="w-11 h-11 items-center justify-center"
              accessibilityLabel={`Retirer l'étape ${i + 1}`}
            >
              <X size={20} color={iconColor} strokeWidth={2} />
            </Pressable>
          )}
        </View>
      ))}
      <Pressable
        onPress={add}
        hitSlop={8}
        className="flex-row items-center justify-center gap-1.5 py-3"
      >
        <Plus size={16} color={accentColor} strokeWidth={2.2} />
        <Text className="text-accent dark:text-accent-dark text-body">ajouter une étape</Text>
      </Pressable>
    </View>
  );
}
