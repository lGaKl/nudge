import { Pressable, Text, View } from "react-native";
import { Segmented } from "./Segmented";
import * as haptics from "@/lib/haptics";
import type { Recurrence } from "@/lib/types";

type Props = {
  recurrence: Recurrence | null;
  onChange: (recurrence: Recurrence | null) => void;
};

type Kind = "none" | "daily" | "weekly" | "monthly";

const KIND_OPTIONS: { value: Kind; label: string }[] = [
  { value: "none", label: "Aucune" },
  { value: "daily", label: "Quotidien" },
  { value: "weekly", label: "Hebdo" },
  { value: "monthly", label: "Mensuel" },
];

const WEEKDAYS: { label: string; value: number }[] = [
  { label: "L", value: 1 },
  { label: "M", value: 2 },
  { label: "M", value: 3 },
  { label: "J", value: 4 },
  { label: "V", value: 5 },
  { label: "S", value: 6 },
  { label: "D", value: 0 },
];

const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

export function RecurrencePicker({ recurrence, onChange }: Props) {
  const activeKind: Kind = recurrence?.kind ?? "none";

  const selectKind = (kind: Kind) => {
    if (kind === activeKind) return;
    switch (kind) {
      case "none":
        return onChange(null);
      case "daily":
        return onChange({ kind: "daily" });
      case "weekly":
        return onChange({ kind: "weekly", weekdays: [] });
      case "monthly":
        return onChange({ kind: "monthly", daysOfMonth: [] });
    }
  };

  const toggleWeekday = (day: number) => {
    if (recurrence?.kind !== "weekly") return;
    haptics.tapLight();
    const has = recurrence.weekdays.includes(day);
    const next = has
      ? recurrence.weekdays.filter((d) => d !== day)
      : [...recurrence.weekdays, day].sort((a, b) => a - b);
    onChange({ kind: "weekly", weekdays: next });
  };

  const toggleDayOfMonth = (day: number) => {
    if (recurrence?.kind !== "monthly") return;
    haptics.tapLight();
    const has = recurrence.daysOfMonth.includes(day);
    const next = has
      ? recurrence.daysOfMonth.filter((d) => d !== day)
      : [...recurrence.daysOfMonth, day].sort((a, b) => a - b);
    onChange({ kind: "monthly", daysOfMonth: next });
  };

  return (
    <View className="gap-3">
      <Text className="text-muted dark:text-muted-dark text-caption">Récurrence</Text>

      <Segmented options={KIND_OPTIONS} value={activeKind} onChange={selectKind} />

      {recurrence?.kind === "weekly" && (
        <View className="flex-row gap-2 justify-between">
          {WEEKDAYS.map((day, i) => {
            const active = recurrence.weekdays.includes(day.value);
            return (
              <Pressable
                key={i}
                onPress={() => toggleWeekday(day.value)}
                className={`flex-1 aspect-square rounded-full items-center justify-center ${
                  active ? "bg-accent dark:bg-accent-dark" : "bg-soft dark:bg-soft-dark"
                }`}
                accessibilityLabel={`Jour ${day.label}`}
              >
                <Text
                  className={
                    active
                      ? "text-white text-body"
                      : "text-fg dark:text-fg-dark text-body"
                  }
                >
                  {day.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {recurrence?.kind === "monthly" && (
        <View className="flex-row flex-wrap gap-2">
          {DAYS_OF_MONTH.map((d) => {
            const active = recurrence.daysOfMonth.includes(d);
            return (
              <Pressable
                key={d}
                onPress={() => toggleDayOfMonth(d)}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  active ? "bg-accent dark:bg-accent-dark" : "bg-soft dark:bg-soft-dark"
                }`}
                accessibilityLabel={`Jour ${d} du mois`}
              >
                <Text
                  className={
                    active
                      ? "text-white text-body"
                      : "text-fg dark:text-fg-dark text-body"
                  }
                >
                  {d}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
