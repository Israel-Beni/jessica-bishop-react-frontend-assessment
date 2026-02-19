import React, { useCallback } from 'react';
import { FilterState, ClinicalRecord } from '../types';
import { useClinicalRecordsContext } from '../context/ClinicalRecordContext';
import { useModal } from '../context/ModalContext';
import { useDelete } from '../context/DeleteContext';
import { useNotification } from '../context/NotificationContext';
import RecordTable from './RecordTable';
import RecordCard from './RecordCard';
import SearchFilter from './SearchFilter';
import { ChevronLeft, ChevronRight, PlusCircle, AlertCircle } from 'lucide-react';
import Loader from './Loader';

export default function RecordList() {
  const {
    records,
    pagination,
    loading,
    error,
    isWakingUp,
    departments,
    statuses,
    setFilters,
    sort,
    setSort,
    page,
    setPage,
    refresh,
  } = useClinicalRecordsContext();

  const { openModal } = useModal();
  const { confirmDelete } = useDelete();
  const { showToast } = useNotification();

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleSort = (field: string) => {
    setSort({
      field,
      order: sort.field === field && sort.order === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleEdit = (record: ClinicalRecord) => {
    openModal(record);
  };

  const openCreateForm = () => {
    openModal();
  };

  const handleDeleteRequest = (record: ClinicalRecord) => {
    confirmDelete(record.id, `${record.patientName} (${record.patientId})`);
  };

  return (
    <>
      <div className="relative animate-fade-in">
        {isWakingUp && (
          <div className="mb-8 p-6 glass border-emerald-100/50 flex items-center rounded-[32px] animate-pulse">
            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center mr-4">
              <AlertCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-emerald-950 font-black tracking-tight">System Initializing</p>
              <p className="text-emerald-900/40 text-sm font-bold">The clinical database is waking up. Standard protocol delayed...</p>
            </div>
          </div>
        )}


        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
          <div className="w-full lg:max-w-2xl">
            <SearchFilter
              onFilterChange={handleFilterChange}
              departments={departments}
              statuses={statuses}
            />
          </div>
          <button
            onClick={openCreateForm}
            className="w-full lg:w-auto flex items-center justify-center px-10 py-5 bg-emerald-600 text-white rounded-[24px] font-black text-sm hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all transform hover:translate-y-[-2px] active:translate-y-[0px] group"
          >
            <PlusCircle className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-500" />
            New Patient
          </button>
        </div>


        {loading && !records.length ? (
          <div className="py-20">
            <Loader
              message="Secure Registry Sync"
              subMessage="Establishing encrypted link to clinical database..."
            />
          </div>
        ) : error ? (
          <div className="glass p-16 rounded-[48px] text-center border-rose-100">
            <div className="w-24 h-24 bg-rose-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-12 h-12 text-rose-500" />
            </div>
            <h3 className="text-3xl font-black text-emerald-950 mb-4 tracking-tight">Connection Alert</h3>
            <p className="text-rose-700/60 font-bold mb-10 max-w-md mx-auto">{error}</p>
            <button
              onClick={refresh}
              className="px-10 py-4 bg-white border border-rose-100 text-rose-600 font-black rounded-2xl hover:bg-rose-50 transition-all shadow-sm"
            >
              Force Re-synchronization
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-6 pl-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse" />
              <span className="text-emerald-950 font-black tracking-tight">
                {pagination?.total || 0} Clinical Profiles Identified
              </span>
            </div>

            <div className="mb-12">
              <div className="hidden lg:block">
                <RecordTable
                  records={records}
                  onEdit={handleEdit}
                  onDelete={(id) => { const r = records.find(rec => rec.id === id); if (r) handleDeleteRequest(r); }}
                  sort={sort}
                  onSort={handleSort}
                />
              </div>
              <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                {records.map(record => (
                  <RecordCard key={record.id} record={record} onEdit={handleEdit} onDelete={(id) => { const r = records.find(rec => rec.id === id); if (r) handleDeleteRequest(r); }} />
                ))}
              </div>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-14 h-14 glass rounded-2xl flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed hover:bg-emerald-50 transition-all text-emerald-600 border border-emerald-100/50"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <ChevronLeft className="w-7 h-7" />
                </button>

                <div className="flex items-center space-x-2">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-14 h-14 rounded-2xl font-black text-sm transition-all border ${page === i + 1
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-200'
                        : 'glass text-emerald-950/40 border-emerald-100/30 hover:bg-emerald-50/50'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="w-14 h-14 glass rounded-2xl flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed hover:bg-emerald-50 transition-all text-emerald-600 border border-emerald-100/50"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </>
  );
}