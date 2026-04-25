import { Pressable, Text, View } from "react-native";
import * as haptics from "@/lib/haptics";

type SegmentValue = string | number;

type Option<T extends SegmentValue> = {
  value: T;
  label: string;
};

type Props<T extends SegmentValue> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function Segmented<T extends SegmentValue>({ options, value, onChange }: Props<T>) {
  return (
    <View className="flex-row gap-2">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            onPress={() => {
              if (active) return;
              haptics.tapLight();
              onChange(option.value);
            }}
            className={`flex-1 rounded-2xl py-3 items-center ${
              active ? "bg-accent dark:bg-accent-dark" : "bg-soft dark:bg-soft-dark"
            }`}
          >
            <Text
              className={
                active
                  ? "text-white text-caption font-medium"
                  : "text-fg dark:text-fg-dark text-caption"
              }
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
