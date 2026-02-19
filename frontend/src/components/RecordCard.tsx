import { Edit, Trash2, Calendar, Stethoscope, Building2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { ClinicalRecord } from '../types';
import { formatDate } from '../utils/dateFormatter';

interface RecordCardProps {
  record: ClinicalRecord;
  onEdit: (record: ClinicalRecord) => void;
  onDelete: (id: number) => void;
}

export default function RecordCard({ record, onEdit, onDelete }: RecordCardProps) {
  return (
    <div className="glass p-6 rounded-[32px] border border-white/40 shadow-xl group hover:scale-[1.02] transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="font-mono text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 uppercase tracking-tighter">
            {record.patientId}
          </span>
          <h3 className="text-xl font-black text-emerald-950 mt-2 tracking-tight">{record.patientName}</h3>
          <p className="text-emerald-900/40 text-xs font-bold uppercase tracking-widest mt-0.5">DOB: {formatDate(record.dateOfBirth)}</p>
        </div>
        <StatusBadge status={record.status} />
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="flex items-center p-3 glass-dark rounded-2xl bg-white/30 border border-emerald-50/50">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3 shadow-sm">
            <Stethoscope className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-emerald-900/30 text-[10px] font-black uppercase tracking-widest">Diagnosis</p>
            <p className="text-emerald-950 font-bold text-sm truncate">{record.diagnosis}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center p-3 glass-dark rounded-2xl bg-white/30 border border-emerald-50/50">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-2.5 shadow-sm shrink-0">
              <Building2 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="min-w-0">
              <p className="text-emerald-900/30 text-[9px] font-black uppercase tracking-widest truncate">Dept</p>
              <p className="text-emerald-950 font-bold text-xs truncate">{record.department}</p>
            </div>
          </div>
          <div className="flex items-center p-3 glass-dark rounded-2xl bg-white/30 border border-emerald-50/50">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-2.5 shadow-sm shrink-0">
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-emerald-900/30 text-[9px] font-black uppercase tracking-widest truncate">Admitted</p>
              <p className="text-emerald-950 font-bold text-xs truncate">{formatDate(record.admissionDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 border-t border-emerald-100/30 pt-4">
        <button
          onClick={() => onEdit(record)}
          className="flex-1 flex items-center justify-center py-3 px-4 glass rounded-2xl text-emerald-700 font-black text-xs hover:bg-emerald-50 transition-all border border-emerald-100"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Registry
        </button>
        <button
          onClick={() => onDelete(record.id)}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center glass rounded-2xl text-rose-500 hover:bg-rose-50 transition-all border border-rose-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


