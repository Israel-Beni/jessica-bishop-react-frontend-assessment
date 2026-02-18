import React from 'react';
import { ClinicalRecord } from '../types';
import StatusBadge from './StatusBadge';

interface RecordTableProps {
  records: ClinicalRecord[];
}

export default function RecordTable({ records }: RecordTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discharge</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">{record.patientName}</span>
                  <span className="text-xs text-gray-500">{record.patientId} • DOB: {record.dateOfBirth}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {record.diagnosis}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {record.admissionDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {record.dischargeDate || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={record.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {record.department}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


