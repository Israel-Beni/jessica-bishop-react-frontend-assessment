import { useState, useEffect, useCallback } from 'react';
import { ClinicalRecord, PaginationInfo, FilterState } from '../types';
import { fetchRecords, fetchDepartments, fetchStatuses } from '../services/api';

export const useClinicalRecords = () => {
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'All',
    department: 'All',
  });

  const loadInitialData = useCallback(async () => {
    try {
      const [deptData, statusData] = await Promise.all([
        fetchDepartments(),
        fetchStatuses(),
      ]);
      setDepartments(deptData);
      setStatuses(statusData);
    } catch (err) {
      console.error('Failed to load initial metadata:', err);
    }
  }, []);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRecords({
        search: filters.search,
        status: filters.status,
        department: filters.department,
      });
      setRecords(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  return {
    records,
    pagination,
    loading,
    error,
    departments,
    statuses,
    filters,
    setFilters,
    refresh: loadRecords
  };
};
