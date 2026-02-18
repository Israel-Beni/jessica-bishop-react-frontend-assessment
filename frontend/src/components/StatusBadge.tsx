import React from 'react';
import { RecordStatus } from '../types';
import { getStatusColor } from '../utils/statusStyles';

interface StatusBadgeProps {
  status: RecordStatus;
  className?: string;
}

function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
