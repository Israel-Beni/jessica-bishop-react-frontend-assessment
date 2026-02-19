import { RecordStatus } from '../types';

/**
 * Returns the CSS classes for a given record status.
 * @param status The status of the clinical record.
 * @returns A string of Tailwind CSS classes for the status badge.
 */
export const getStatusColor = (status: RecordStatus): string => {
  switch (status) {
    case 'Active':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm shadow-emerald-100/50';
    case 'Discharged':
      return 'bg-teal-100 text-teal-800 border-teal-200 shadow-sm shadow-teal-100/50';
    case 'Pending':
      return 'bg-amber-100 text-amber-800 border-amber-200 shadow-sm shadow-amber-100/50';
    case 'Cancelled':
      return 'bg-rose-100 text-rose-800 border-rose-200 shadow-sm shadow-rose-100/50';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};
