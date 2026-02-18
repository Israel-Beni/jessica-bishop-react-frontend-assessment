export type RecordStatus = 'Active' | 'Discharged' | 'Pending' | 'Cancelled';

export interface ClinicalRecord {
  id: number;
  patientId: string;
  patientName: string;
  dateOfBirth: string;
  diagnosis: string;
  admissionDate: string;
  dischargeDate: string | null;
  status: RecordStatus;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface RecordsResponse {
  data: ClinicalRecord[];
  pagination: PaginationInfo;
  filters: FilterState;
}

export interface FilterState {
  status: string;
  department: string;
  search: string;
}
