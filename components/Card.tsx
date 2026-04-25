import { type ReactNode } from "react";
import { Pressable, View } from "react-native";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function Card({ children, onPress, accessibilityLabel }: Props) {
  if (!onPress) {
    return (
      <View className="bg-soft dark:bg-soft-dark rounded-2xl p-5">{children}</View>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      className="bg-soft dark:bg-soft-dark rounded-2xl p-5 active:opacity-70"
    >
      {children}
    </Pressable>
  );
}
