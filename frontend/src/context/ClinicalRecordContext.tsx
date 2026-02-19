import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ClinicalRecord, PaginationInfo, FilterState } from '../types';
import { fetchRecords, fetchDepartments, fetchStatuses, deleteRecord, createRecord, updateRecord, CreateRecordData, fetchRecordsStats, RecordsStats } from '../services/api';

interface ClinicalRecordContextType {
  records: ClinicalRecord[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  isWakingUp: boolean;
  departments: string[];
  statuses: string[];
  nextPatientId: string;
  filters: FilterState;
  sort: { field: string; order: 'asc' | 'desc' };
  page: number;
  stats: RecordsStats | null;
  setFilters: (f: FilterState) => void;
  setSort: (s: { field: string; order: 'asc' | 'desc' }) => void;
  setPage: (p: number | ((prev: number) => number)) => void;
  refresh: () => void;
  addRecord: (data: CreateRecordData) => Promise<void>;
  updateExistingRecord: (id: number, data: Partial<CreateRecordData>) => Promise<void>;
  removeRecord: (id: number) => Promise<void>;
}

const ClinicalRecordContext = createContext<ClinicalRecordContextType | undefined>(undefined);

export const ClinicalRecordProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [nextPatientId, setNextPatientId] = useState<string>('P001');
  const [stats, setStats] = useState<RecordsStats | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'All',
    department: 'All',
  });
  const [sort, setSort] = useState<{ field: string; order: 'asc' | 'desc' }>({
    field: 'id',
    order: 'desc',
  });
  const [page, setPage] = useState(1);

  const loadInitialData = useCallback(async () => {
    const warmingTimer = setTimeout(() => setIsWakingUp(true), 3000);
    try {
      const [deptData, statusData] = await Promise.all([
        fetchDepartments(),
        fetchStatuses(),
      ]);
      const allDepts = Array.from(new Set([...deptData]))
        .filter(d => d && d.length >= 2)
        .sort();

      setDepartments(allDepts);
      setStatuses(statusData);
      setIsWakingUp(false);
    } catch (err) {
      console.error('Failed to load initial metadata:', err);
    } finally {
      clearTimeout(warmingTimer);
    }
  }, []);

  const calculateNextId = useCallback(async () => {
    try {
      const response = await fetchRecords({
        sortBy: 'patientId',
        sortOrder: 'desc',
        limit: 1,
      });

      if (response.data.length > 0) {
        const lastId = response.data[0].patientId;
        const match = lastId.match(/^P(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          const nextNum = num + 1;
          setNextPatientId(`P${nextNum.toString().padStart(3, '0')}`);
        }
      } else {
        setNextPatientId('P001');
      }
    } catch (err) {
      console.error('Failed to calculate next Patient ID:', err);
    }
  }, []);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    const warmingTimer = setTimeout(() => setIsWakingUp(true), 3000);
    try {
      const [recordsResponse, statsResponse] = await Promise.all([
        fetchRecords({
          search: filters.search,
          status: filters.status,
          department: filters.department,
          page: page,
          sortBy: sort.field,
          sortOrder: sort.order,
        }),
        fetchRecordsStats()
      ]);

      setRecords(recordsResponse.data);
      setPagination(recordsResponse.pagination);
      setStats(statsResponse);
      setIsWakingUp(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsWakingUp(false);
    } finally {
      setLoading(false);
      clearTimeout(warmingTimer);
    }
  }, [filters, page, sort]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    calculateNextId();
  }, [calculateNextId]);

  const updateFilters = useCallback((f: FilterState) => {
    setFilters(f);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    loadRecords();
    calculateNextId();
  }, [loadRecords, calculateNextId]);

  const addRecord = async (data: CreateRecordData) => {
    await createRecord(data);
    refresh();
  };

  const updateExistingRecord = async (id: number, data: Partial<CreateRecordData>) => {
    await updateRecord(id, data);
    refresh();
  };

  const removeRecord = async (id: number) => {
    await deleteRecord(id);
    refresh();
  };

  return (
    <ClinicalRecordContext.Provider value={{
      records,
      pagination,
      loading,
      error,
      isWakingUp,
      departments,
      statuses,
      nextPatientId,
      filters,
      sort,
      page,
      stats,
      setFilters: updateFilters,
      setSort,
      setPage,
      refresh,
      addRecord,
      updateExistingRecord,
      removeRecord
    }}>
      {children}
    </ClinicalRecordContext.Provider>
  );
};

export const useClinicalRecordsContext = () => {
  const context = useContext(ClinicalRecordContext);
  if (context === undefined) {
    throw new Error('useClinicalRecordsContext must be used within a ClinicalRecordProvider');
  }
  return context;
};
