import { ClinicalRecord } from '../types';
import StatusBadge from './StatusBadge';
import { Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';

interface RecordTableProps {
  records: ClinicalRecord[];
  sort: { field: string; order: 'asc' | 'desc' };
  onSort: (field: string) => void;
  onEdit: (record: ClinicalRecord) => void;
  onDelete: (id: number) => void;
}

export default function RecordTable({ records, sort, onSort, onEdit, onDelete }: RecordTableProps) {
  return (
    <div className="glass rounded-[40px] overflow-hidden border border-white/40 shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-500/10 border-b border-emerald-100/30">
              <SortHeader label="Patient ID" sortKey="patientId" currentSort={sort} onSort={onSort} />
              <SortHeader label="Name" sortKey="patientName" currentSort={sort} onSort={onSort} />
              <SortHeader label="Admission" sortKey="admissionDate" currentSort={sort} onSort={onSort} />
              <SortHeader label="Status" sortKey="status" currentSort={sort} onSort={onSort} />
              <SortHeader label="Department" sortKey="department" currentSort={sort} onSort={onSort} />
              <th className="px-8 py-6 text-xs font-black text-emerald-950 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-100/20">
            {records.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-emerald-500/[0.03] transition-colors group"
              >
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className="font-mono text-xs font-black text-emerald-600 bg-emerald-100/50 px-3 py-1.5 rounded-xl border border-emerald-200/50">
                    {record.patientId}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="font-bold text-emerald-950 text-lg tracking-tight">{record.patientName}</div>
                  <div className="text-xs text-emerald-900/40 font-bold uppercase tracking-wider mt-0.5">{record.diagnosis}</div>
                </td>
                <td className="px-8 py-6 text-sm text-emerald-900/60 font-black font-mono">
                  {formatDate(record.admissionDate)}
                </td>
                <td className="px-8 py-6">
                  <StatusBadge status={record.status} />
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-black text-teal-700 bg-teal-100/50 px-4 py-1.5 rounded-full border border-teal-200/30">
                    {record.department}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => onEdit(record)}
                      className="p-3 text-emerald-600 hover:bg-emerald-100 rounded-2xl transition-all shadow-sm hover:shadow-emerald-100"
                      title="Edit Record"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="p-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all shadow-sm hover:shadow-rose-100"
                      title="Delete Record"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const SortHeader = ({ label, sortKey, currentSort, onSort }: any) => {
  const isActive = currentSort.field === sortKey;

  return (
    <th
      className="px-6 py-5 text-xs font-extra-bold text-emerald-900 uppercase tracking-widest cursor-pointer hover:bg-emerald-500/5 transition-colors group/header"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center">
        {label}
        <div className={`ml-2 transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover/header:opacity-50'}`}>
          {currentSort.order === 'asc' ? '↑' : '↓'}
        </div>
      </div>
    </th>
  );
};
