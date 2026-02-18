import { RecordsResponse, ClinicalRecord } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export interface FetchRecordsParams {
  search?: string;
  status?: string;
  department?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type CreateRecordData = Omit<ClinicalRecord, 'id' | 'createdAt' | 'updatedAt'>;

export const fetchRecords = async (params: FetchRecordsParams = {}): Promise<RecordsResponse> => {
  const query = new URLSearchParams();

  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.department && params.department !== 'All') query.append('department', params.department);
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);

  const response = await fetch(`${API_BASE_URL}/records?${query.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch records');
  }

  return response.json();
};

export const createRecord = async (data: CreateRecordData): Promise<ClinicalRecord> => {
  const response = await fetch(`${API_BASE_URL}/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create record');
  }

  return response.json();
};

export const fetchDepartments = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/departments`);
  if (!response.ok) throw new Error('Failed to fetch departments');
  return response.json();
};

export const fetchStatuses = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/statuses`);
  if (!response.ok) throw new Error('Failed to fetch statuses');
  return response.json();
};
