import { describe, expect, it } from "vitest";
import { getTasksForDate, isTaskForDate, parseRecurrence, type ScheduledTask } from "./schedule";
import type { Recurrence } from "./types";

function mk(overrides: Partial<ScheduledTask> = {}): ScheduledTask {
  return {
    recurrenceJson: null,
    scheduledAt: null,
    archivedAt: null,
    ...overrides,
  };
}

function rec(r: Recurrence): string {
  return JSON.stringify(r);
}

const friday = new Date(2026, 3, 24);
const thursday = new Date(2026, 3, 23);

describe("isTaskForDate", () => {
  describe("one-shot sans scheduledAt (inbox)", () => {
    it("reste visible tous les jours", () => {
      expect(isTaskForDate(mk(), friday)).toBe(true);
      expect(isTaskForDate(mk(), thursday)).toBe(true);
    });
  });

  describe("one-shot avec scheduledAt", () => {
    it("visible le jour dit", () => {
      expect(isTaskForDate(mk({ scheduledAt: friday }), friday)).toBe(true);
    });
    it("invisible un autre jour", () => {
      expect(isTaskForDate(mk({ scheduledAt: thursday }), friday)).toBe(false);
    });
    it("compare le jour calendaire, ignore l'heure", () => {
      const fridayEvening = new Date(2026, 3, 24, 22, 30);
      const fridayMorning = new Date(2026, 3, 24, 8, 0);
      expect(isTaskForDate(mk({ scheduledAt: fridayEvening }), fridayMorning)).toBe(true);
    });
  });

  describe("archivée", () => {
    it("jamais visible, peu importe le reste", () => {
      expect(isTaskForDate(mk({ archivedAt: friday }), friday)).toBe(false);
      expect(
        isTaskForDate(mk({ archivedAt: friday, recurrenceJson: rec({ kind: "daily" }) }), friday),
      ).toBe(false);
    });
  });

  describe("récurrence daily", () => {
    it("visible tous les jours", () => {
      const t = mk({ recurrenceJson: rec({ kind: "daily" }) });
      expect(isTaskForDate(t, friday)).toBe(true);
      expect(isTaskForDate(t, thursday)).toBe(true);
    });
  });

  describe("récurrence weekly", () => {
    it("visible quand le jour de la semaine est dans la liste (vendredi = 5)", () => {
      const t = mk({ recurrenceJson: rec({ kind: "weekly", weekdays: [1, 3, 5] }) });
      expect(isTaskForDate(t, friday)).toBe(true);
    });
    it("invisible quand le jour n'est pas dans la liste (jeudi = 4)", () => {
      const t = mk({ recurrenceJson: rec({ kind: "weekly", weekdays: [1, 3, 5] }) });
      expect(isTaskForDate(t, thursday)).toBe(false);
    });
    it("invisible si aucun jour sélectionné", () => {
      const t = mk({ recurrenceJson: rec({ kind: "weekly", weekdays: [] }) });
      expect(isTaskForDate(t, friday)).toBe(false);
    });
  });

  describe("récurrence monthly", () => {
    it("visible quand le jour du mois est dans la liste", () => {
      const t = mk({ recurrenceJson: rec({ kind: "monthly", daysOfMonth: [1, 15, 24] }) });
      expect(isTaskForDate(t, friday)).toBe(true);
    });
    it("invisible quand le jour du mois n'est pas dans la liste", () => {
      const t = mk({ recurrenceJson: rec({ kind: "monthly", daysOfMonth: [1, 15] }) });
      expect(isTaskForDate(t, friday)).toBe(false);
    });
    it("invisible si aucun jour sélectionné", () => {
      const t = mk({ recurrenceJson: rec({ kind: "monthly", daysOfMonth: [] }) });
      expect(isTaskForDate(t, friday)).toBe(false);
    });
    it("gère une seule date comme une liste d'un élément", () => {
      const t = mk({ recurrenceJson: rec({ kind: "monthly", daysOfMonth: [24] }) });
      expect(isTaskForDate(t, friday)).toBe(true);
    });
    it("lit un format legacy {dayOfMonth: N} en fallback", () => {
      const legacy = JSON.stringify({ kind: "monthly", dayOfMonth: 24 });
      const t = mk({ recurrenceJson: legacy });
      expect(isTaskForDate(t, friday)).toBe(true);
    });
  });
});

describe("parseRecurrence", () => {
  it("null quand recurrenceJson est null", () => {
    expect(parseRecurrence(null)).toBeNull();
  });
  it("parse un daily", () => {
    expect(parseRecurrence(rec({ kind: "daily" }))).toEqual({ kind: "daily" });
  });
  it("parse un weekly avec weekdays", () => {
    expect(parseRecurrence(rec({ kind: "weekly", weekdays: [1, 3] }))).toEqual({
      kind: "weekly",
      weekdays: [1, 3],
    });
  });
  it("parse un monthly avec daysOfMonth", () => {
    expect(parseRecurrence(rec({ kind: "monthly", daysOfMonth: [1, 15] }))).toEqual({
      kind: "monthly",
      daysOfMonth: [1, 15],
    });
  });
  it("migre un legacy {dayOfMonth: N} vers {daysOfMonth: [N]}", () => {
    const legacy = JSON.stringify({ kind: "monthly", dayOfMonth: 7 });
    expect(parseRecurrence(legacy)).toEqual({ kind: "monthly", daysOfMonth: [7] });
  });
});

describe("getTasksForDate", () => {
  it("combine tous les filtres", () => {
    const tasks: ScheduledTask[] = [
      mk(),
      mk({ archivedAt: friday }),
      mk({ scheduledAt: thursday }),
      mk({ recurrenceJson: rec({ kind: "daily" }) }),
      mk({ recurrenceJson: rec({ kind: "weekly", weekdays: [0] }) }),
    ];
    const result = getTasksForDate(tasks, friday);
    expect(result).toHaveLength(2);
  });
});
