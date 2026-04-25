import { type ReactNode } from "react";
import { Pressable, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { animation } from "@/lib/theme";
import * as haptics from "@/lib/haptics";

type Variant = "primary" | "secondary" | "ghost";
type HapticKind = "none" | "light" | "medium" | "success" | "warning";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  haptic?: HapticKind;
  accessibilityLabel?: string;
};

const containerByVariant: Record<Variant, string> = {
  primary: "bg-accent dark:bg-accent-dark",
  secondary: "bg-soft dark:bg-soft-dark",
  ghost: "bg-transparent",
};

const textByVariant: Record<Variant, string> = {
  primary: "text-white",
  secondary: "text-fg dark:text-fg-dark",
  ghost: "text-accent dark:text-accent-dark",
};

function fireHaptic(kind: HapticKind) {
  switch (kind) {
    case "light":
      return haptics.tapLight();
    case "medium":
      return haptics.tapMedium();
    case "success":
      return haptics.success();
    case "warning":
      return haptics.warning();
    case "none":
      return;
  }
}

export function Button({
  children,
  onPress,
  variant = "primary",
  disabled = false,
  fullWidth = false,
  haptic = "light",
  accessibilityLabel,
}: Props) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[animStyle, fullWidth ? { alignSelf: "stretch" } : undefined]}>
      <Pressable
        onPress={() => {
          if (disabled) return;
          fireHaptic(haptic);
          onPress?.();
        }}
        onPressIn={() =>
          (scale.value = withSpring(0.96, {
            damping: animation.spring.damping,
            stiffness: animation.spring.stiffness,
            mass: animation.spring.mass,
          }))
        }
        onPressOut={() =>
          (scale.value = withSpring(1, {
            damping: animation.spring.damping,
            stiffness: animation.spring.stiffness,
            mass: animation.spring.mass,
          }))
        }
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        className={`${containerByVariant[variant]} ${disabled ? "opacity-40" : ""} rounded-2xl px-6 py-3 items-center justify-center`}
      >
        <Text className={`${textByVariant[variant]} text-body font-medium`}>{children}</Text>
      </Pressable>
    </Animated.View>
  );
}
