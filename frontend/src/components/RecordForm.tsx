import React, { useState } from 'react';
import { RecordStatus, FilterState } from '../types';
import { createRecord, CreateRecordData } from '../services/api';
import FormField from './FormField';

interface RecordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  departments: string[];
  statuses: string[];
  suggestedPatientId: string;
}

const INITIAL_FORM_DATA: CreateRecordData = {
  patientId: '',
  patientName: '',
  dateOfBirth: '',
  diagnosis: '',
  admissionDate: '',
  dischargeDate: null,
  status: 'Active',
  department: '',
};

export default function RecordForm({ isOpen, onClose, onSuccess, departments, statuses, suggestedPatientId }: RecordFormProps) {
  const [formData, setFormData] = useState<CreateRecordData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateRecordData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, patientId: suggestedPatientId }));
    }
  }, [isOpen, suggestedPatientId]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateRecordData, string>> = {};

    if (!formData.patientName) newErrors.patientName = 'Patient Name is required';
    else if (formData.patientName.length < 2) newErrors.patientName = 'Min 2 characters';

    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    else if (new Date(formData.dateOfBirth) >= new Date()) newErrors.dateOfBirth = 'Must be in the past';

    if (!formData.diagnosis) newErrors.diagnosis = 'Diagnosis is required';
    else if (formData.diagnosis.length < 2) newErrors.diagnosis = 'Min 2 characters';

    if (!formData.admissionDate) newErrors.admissionDate = 'Admission Date is required';

    if (formData.dischargeDate && new Date(formData.dischargeDate) < new Date(formData.admissionDate)) {
      newErrors.dischargeDate = 'Must be after or equal to admission date';
    }

    if (!formData.department) newErrors.department = 'Department is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' && name === 'dischargeDate' ? null : value
    }));
    // Clear error when field changes
    if (errors[name as keyof CreateRecordData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await createRecord(formData);
      setFormData(INITIAL_FORM_DATA);
      onSuccess();
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to create record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900">Create New Clinical Record</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormField label="Patient ID" id="patientId">
              <input
                id="patientId"
                name="patientId"
                type="text"
                readOnly
                className="w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm text-gray-500 focus:outline-none cursor-not-allowed font-mono"
                value={formData.patientId}
              />
              <p className="mt-1 text-[10px] text-gray-400">Unique ID is automatically assigned</p>
            </FormField>

            <FormField label="Patient Name" id="patientName" error={errors.patientName} required>
              <input
                id="patientName"
                name="patientName"
                type="text"
                placeholder="John Doe"
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${errors.patientName ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.patientName}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Date of Birth" id="dateOfBirth" error={errors.dateOfBirth} required>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Diagnosis" id="diagnosis" error={errors.diagnosis} required>
              <input
                id="diagnosis"
                name="diagnosis"
                type="text"
                placeholder="Hypertension"
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${errors.diagnosis ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.diagnosis}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Admission Date" id="admissionDate" error={errors.admissionDate} required>
              <input
                id="admissionDate"
                name="admissionDate"
                type="date"
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${errors.admissionDate ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.admissionDate}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Discharge Date" id="dischargeDate" error={errors.dischargeDate}>
              <input
                id="dischargeDate"
                name="dischargeDate"
                type="date"
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${errors.dischargeDate ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.dischargeDate || ''}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Status" id="status" required>
              <select
                id="status"
                name="status"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <FormField label="Department" id="department" error={errors.department} required>
              <input
                id="department"
                name="department"
                list="dept-list"
                placeholder="e.g. Cardiology or new department"
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.department}
                onChange={handleChange}
                autoComplete="off"
              />
              <datalist id="dept-list">
                {departments.filter(d => d !== 'All').map(d => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </FormField>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg shadow transition flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
