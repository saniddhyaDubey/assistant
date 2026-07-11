export type ChecklistItem = { label: string; done: boolean };
export type MitItem = { text: string; done: boolean };

export const DEFAULT_ROUTINE_CHECKLIST: ChecklistItem[] = [
  { label: "Codeforces", done: false },
  { label: "Blog written", done: false },
  { label: "Open source", done: false },
  { label: "Job application", done: false },
  { label: "Study", done: false },
];

export const DEFAULT_DIET_CHECKLIST: ChecklistItem[] = [
  { label: "Morning water", done: false },
  { label: "Breakfast", done: false },
  { label: "Tea", done: false },
  { label: "Lunch", done: false },
  { label: "Evening milk", done: false },
  { label: "Dinner", done: false },
];
