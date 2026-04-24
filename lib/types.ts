export type Step = {
  id: string;
  label: string;
  estimatedMinutes?: number;
  optional?: boolean;
};

export type Recurrence =
  | { kind: "daily" }
  | { kind: "weekly"; weekdays: number[] }
  | { kind: "monthly"; dayOfMonth: number };
