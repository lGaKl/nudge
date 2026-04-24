import { Text, TextInput, View } from "react-native";
import { alpha } from "@/lib/theme";

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  multiline?: boolean;
};

export function Field({ label, value, onChangeText, placeholder, multiline }: Props) {
  return (
    <View className="gap-2">
      <Text className="text-muted text-sm">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={alpha.placeholder}
        multiline={multiline}
        className="bg-soft rounded-2xl px-4 py-4 text-fg text-base"
        style={multiline ? { minHeight: 80, textAlignVertical: "top" } : undefined}
      />
    </View>
  );
}
