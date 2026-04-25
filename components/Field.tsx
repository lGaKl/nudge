import { Text, TextInput, useColorScheme, View } from "react-native";
import { alpha } from "@/lib/theme";

type Props = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  multiline?: boolean;
};

export function Field({ label, value, onChangeText, placeholder, multiline }: Props) {
  const scheme = useColorScheme();
  const placeholderColor = scheme === "dark" ? alpha.placeholderDark : alpha.placeholder;

  return (
    <View className="gap-2">
      <Text className="text-muted dark:text-muted-dark text-caption">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        multiline={multiline}
        className="bg-soft dark:bg-soft-dark rounded-2xl px-4 py-4 text-fg dark:text-fg-dark text-body"
        style={multiline ? { minHeight: 80, textAlignVertical: "top" } : undefined}
      />
    </View>
  );
}
