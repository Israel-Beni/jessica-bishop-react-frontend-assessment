import React from 'react';
import { ClinicalRecord } from '../types';
import StatusBadge from './StatusBadge';

interface RecordCardProps {
  record: ClinicalRecord;
}


export default function RecordCard({ record }: RecordCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{record.patientName}</h3>
          <p className="text-sm text-gray-500">{record.patientId} • DOB: {record.dateOfBirth}</p>
        </div>
        <StatusBadge status={record.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs uppercase font-semibold">Diagnosis</p>
          <p className="text-gray-800">{record.diagnosis}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase font-semibold">Department</p>
          <p className="text-gray-800">{record.department}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase font-semibold">Admission</p>
          <p className="text-gray-800">{record.admissionDate}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase font-semibold">Discharge</p>
          <p className="text-gray-800">{record.dischargeDate || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};


