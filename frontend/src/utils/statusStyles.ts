import { RecordStatus } from '../types';

/**
 * Returns the CSS classes for a given record status.
 * @param status The status of the clinical record.
 * @returns A string of Tailwind CSS classes for the status badge.
 */
export const getStatusColor = (status: RecordStatus): string => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Discharged':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
