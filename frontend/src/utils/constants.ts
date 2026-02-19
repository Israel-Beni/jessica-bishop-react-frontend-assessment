export const VALID_DEPARTMENTS = [
  "Cardiology",
  "Endocrinology",
  "General Surgery",
  "Pulmonology"
] as const;

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export type ValidDepartment = typeof VALID_DEPARTMENTS[number];
