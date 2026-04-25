import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, useColorScheme, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { router } from "expo-router";
import { isNull } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDown, ChevronUp, Plus } from "lucide-react-native";
import { db } from "@/db/client";
import { tasks } from "@/db/schema";
import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { Segmented } from "@/components/Segmented";
import { Button } from "@/components/Button";
import { fadeIn } from "@/lib/animations";
import * as haptics from "@/lib/haptics";
import { animation, colors, colorsDark, shadows } from "@/lib/theme";
import { heroTint } from "@/lib/avatar";
import { getTasksForDate } from "@/lib/schedule";
import { parseSteps } from "@/lib/tasks";

type ViewMode = "today" | "all";

type TaskCard = {
  id: string;
  title: string;
  outcome: string;
  stepCount: number;
};

const VIEW_MODE_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: "today", label: "Aujourd'hui" },
  { value: "all", label: "Toutes" },
];

function capitalize(s: string): string {
  return s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);
}

export default function Index() {
  const { data } = useLiveQuery(db.select().from(tasks).where(isNull(tasks.archivedAt)));
  const [viewMode, setViewMode] = useState<ViewMode>("today");
  const [expanded, setExpanded] = useState(false);
  const today = useMemo(() => new Date(), []);

  const cards = useMemo<TaskCard[]>(() => {
    const filtered = viewMode === "today" ? getTasksForDate(data, today) : data;
    return filtered.map((t) => ({
      id: t.id,
      title: t.title,
      outcome: t.outcome,
      stepCount: parseSteps(t.stepsJson).length,
    }));
  }, [data, today, viewMode]);

  const dateLabel = useMemo(
    () => capitalize(format(today, "EEEE d MMMM", { locale: fr })),
    [today],
  );

  const countLabel = useMemo(() => {
    const n = cards.length;
    if (viewMode === "today") {
      return n === 0 ? "rien à faire" : `${n} tâche${n > 1 ? "s" : ""}`;
    }
    return n === 0 ? "aucune tâche" : `${n} tâche${n > 1 ? "s" : ""} au total`;
  }, [cards.length, viewMode]);

  const hero = cards[0] ?? null;
  const rest = cards.slice(1);
  const visibleRest = expanded ? rest : [];

  return (
    <View className="flex-1 bg-bg dark:bg-bg-dark">
      <Animated.View entering={fadeIn} className="pt-20 px-6 pb-2">
        <Text className="text-fg dark:text-fg-dark text-display font-rounded">Bonjour 👋</Text>
        <Text className="text-muted dark:text-muted-dark text-caption mt-1">
          {dateLabel} · {countLabel}
        </Text>
      </Animated.View>
      <View className="px-6 pt-4 pb-3">
        <Segmented options={VIEW_MODE_OPTIONS} value={viewMode} onChange={setViewMode} />
      </View>
      <FlatList
        data={visibleRest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120, flexGrow: 1 }}
        ItemSeparatorComponent={Separator}
        renderItem={renderCard}
        ListHeaderComponent={
          hero ? (
            <View>
              <HeroCard card={hero} />
              {rest.length > 0 ? (
                <View className="mt-4 mb-3">
                  <Expander
                    count={rest.length}
                    expanded={expanded}
                    onToggle={() => {
                      haptics.tapLight();
                      setExpanded((v) => !v);
                    }}
                  />
                </View>
              ) : null}
            </View>
          ) : null
        }
        ListEmptyComponent={hero ? null : emptyComponent(viewMode)}
      />
      <Fab onPress={() => router.push("/task/new")} />
    </View>
  );
}

function Separator() {
  return <View className="h-3" />;
}

function HeroCard({ card }: { card: TaskCard }) {
  const scheme = useColorScheme();
  const tint = heroTint(card.title, scheme);
  return (
    <View
      style={{ backgroundColor: tint.bg }}
      className="rounded-3xl p-6 gap-5"
    >
      <Pressable
        onPress={() => router.push(`/task/${card.id}`)}
        accessibilityLabel={`Modifier la tâche ${card.title}`}
      >
        <Text
          style={{ color: tint.muted }}
          className="text-micro uppercase tracking-widest"
        >
          Ta prochaine
        </Text>
        <Text
          style={{ color: tint.fg }}
          className="text-display font-rounded mt-2"
          numberOfLines={2}
        >
          {card.title}
        </Text>
        <Text
          style={{ color: tint.muted }}
          className="text-body mt-2"
          numberOfLines={3}
        >
          {card.outcome}
        </Text>
        <Text
          style={{ color: tint.muted }}
          className="text-caption mt-3"
        >
          {card.stepCount} étape{card.stepCount > 1 ? "s" : ""}
        </Text>
      </Pressable>
      <Button
        onPress={() => router.push(`/task/${card.id}`)}
        haptic="medium"
        fullWidth
        accessibilityLabel="Commencer cette tâche"
      >
        Commencer
      </Button>
      <Text
        style={{ color: tint.muted }}
        className="text-caption text-center"
      >
        {"Tu peux t'arrêter après la 1ère étape, c'est déjà bien."}
      </Text>
    </View>
  );
}

function renderCard({ item }: { item: TaskCard }) {
  return (
    <Card onPress={() => router.push(`/task/${item.id}`)} accessibilityLabel={`Tâche ${item.title}`}>
      <View className="flex-row items-center gap-4">
        <Avatar title={item.title} />
        <View className="flex-1">
          <Text className="text-fg dark:text-fg-dark text-title font-rounded" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-muted dark:text-muted-dark text-caption mt-0.5" numberOfLines={1}>
            {item.outcome}
          </Text>
          <Text className="text-muted dark:text-muted-dark text-micro mt-2">
            {item.stepCount} étape{item.stepCount > 1 ? "s" : ""}
          </Text>
        </View>
      </View>
    </Card>
  );
}

function Expander({
  count,
  expanded,
  onToggle,
}: {
  count: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const scheme = useColorScheme();
  const iconColor = scheme === "dark" ? colorsDark.muted : colors.muted;
  const Icon = expanded ? ChevronUp : ChevronDown;
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8}
      className="flex-row items-center justify-center gap-1.5 py-3"
      accessibilityLabel={expanded ? "Replier la liste" : `Voir les ${count} autres tâches`}
    >
      <Text className="text-muted dark:text-muted-dark text-body">
        {expanded ? "Replier" : `+ ${count} autre${count > 1 ? "s" : ""}`}
      </Text>
      <Icon size={16} color={iconColor} strokeWidth={2} />
    </Pressable>
  );
}

function emptyComponent(mode: ViewMode) {
  if (mode === "today") {
    return (
      <EmptyState
        emoji="🌱"
        title="Rien à faire aujourd'hui."
        caption="Profite, respire, ou crée une nouvelle tâche."
      />
    );
  }
  return (
    <EmptyState
      emoji="✨"
      title="Pas encore de tâche."
      caption="Commence par une, on verra."
    />
  );
}

function Fab({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const spring = animation.spring;
  return (
    <Animated.View
      style={[animStyle, shadows.fab, { position: "absolute", bottom: 40, right: 24 }]}
    >
      <Pressable
        onPress={() => {
          haptics.tapMedium();
          onPress();
        }}
        onPressIn={() => (scale.value = withSpring(0.92, spring))}
        onPressOut={() => (scale.value = withSpring(1, spring))}
        accessibilityLabel="Nouvelle tâche"
        className="w-14 h-14 bg-accent dark:bg-accent-dark rounded-full items-center justify-center"
      >
        <Plus size={28} color="#fff" strokeWidth={2.5} />
      </Pressable>
    </Animated.View>
  );
}
