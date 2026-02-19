export const VALID_DEPARTMENTS = [
  "Cardiology",
  "Endocrinology",
  "General Surgery",
  "Pulmonology"
] as const;

export type ValidDepartment = typeof VALID_DEPARTMENTS[number];
