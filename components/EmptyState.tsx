import { Text, View } from "react-native";

type Props = {
  emoji?: string;
  title?: string;
  caption?: string;
};

export function EmptyState({ emoji, title, caption }: Props) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      {emoji ? <Text className="text-display mb-3">{emoji}</Text> : null}
      {title ? (
        <Text className="text-fg dark:text-fg-dark text-title font-rounded text-center mb-1">
          {title}
        </Text>
      ) : null}
      {caption ? (
        <Text className="text-muted dark:text-muted-dark text-body text-center">{caption}</Text>
      ) : null}
    </View>
  );
}
