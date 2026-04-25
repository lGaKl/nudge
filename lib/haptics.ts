import * as Haptics from "expo-haptics";

export function tapLight(): void {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function tapMedium(): void {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function success(): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function warning(): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
