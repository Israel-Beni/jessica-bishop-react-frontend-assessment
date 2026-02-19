import React, { useState, useEffect } from 'react';
import { Database, X } from 'lucide-react';
import { useClinicalRecordsContext } from '../context/ClinicalRecordContext';
import { useModal } from '../context/ModalContext';
import { useNotification } from '../context/NotificationContext';

export default function RecordForm() {
  const { addRecord, updateExistingRecord, departments, statuses, nextPatientId } = useClinicalRecordsContext();
  const { isOpen, editingRecord, closeModal } = useModal();
  const { showToast } = useNotification();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    dateOfBirth: '',
    admissionDate: '',
    diagnosis: '',
    dischargeDate: '',
    status: 'Active',
    department: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset / populate form whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setApiError(null);
      setErrors({});
      if (editingRecord) {
        setFormData({
          patientId: editingRecord.patientId,
          patientName: editingRecord.patientName,
          dateOfBirth: editingRecord.dateOfBirth,
          admissionDate: editingRecord.admissionDate,
          diagnosis: editingRecord.diagnosis,
          dischargeDate: editingRecord.dischargeDate ?? '',
          status: editingRecord.status,
          department: editingRecord.department,
        });
      } else {
        setFormData({
          patientId: nextPatientId,
          patientName: '',
          dateOfBirth: '',
          admissionDate: new Date().toISOString().split('T')[0],
          diagnosis: '',
          dischargeDate: '',
          status: 'Active',
          department: departments[0] ?? '',
        });
      }
    }
  }, [isOpen, editingRecord, nextPatientId, departments]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.patientId.trim()) newErrors.patientId = 'Patient ID is required';
    else if (!/^P\d{3,}$/.test(formData.patientId.trim())) newErrors.patientId = 'Format must be P### (e.g. P007)';
    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.admissionDate) newErrors.admissionDate = 'Admission date is required';
    if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (formData.dischargeDate && formData.admissionDate && formData.dischargeDate < formData.admissionDate) {
      newErrors.dischargeDate = 'Discharge date must be after admission date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    const payload = {
      patientId: formData.patientId.trim(),
      patientName: formData.patientName.trim(),
      dateOfBirth: formData.dateOfBirth,
      admissionDate: formData.admissionDate,
      diagnosis: formData.diagnosis.trim(),
      dischargeDate: formData.dischargeDate || null,
      status: formData.status as any,
      department: formData.department.trim(),
    };

    try {
      if (editingRecord) {
        await updateExistingRecord(editingRecord.id, payload);
        showToast('Record updated successfully');
      } else {
        await addRecord(payload);
        showToast('Patient admitted successfully');
      }
      closeModal();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'An unexpected error occurred. Please try again.';
      setApiError(message);
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    if (apiError) setApiError(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-emerald-950/25 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className="bg-white border border-emerald-100 rounded-2xl shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] w-full max-w-2xl animate-fade-in flex flex-col max-h-[90vh]">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-950 leading-none">
                {editingRecord ? 'Update Record' : 'New Admission'}
              </h2>
              <p className="text-xs text-emerald-900/40 font-medium mt-1 uppercase tracking-widest">
                {editingRecord ? `Editing ${editingRecord.patientId}` : 'Register a new patient'}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-emerald-900/30 hover:text-emerald-950 hover:bg-emerald-50 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-8 py-6 flex flex-col gap-5" noValidate>

          {/* API-level error banner */}
          {apiError && (
            <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl px-4 py-3 text-sm font-medium">
              <span className="mt-0.5 shrink-0">⚠</span>
              <span>{apiError}</span>
            </div>
          )}

          {/* Row 1: Patient ID + Patient Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Patient ID" error={errors.patientId} hint="Format: P007">
              <input
                name="patientId"
                placeholder="P007"
                readOnly
                className={inputClass(!!errors.patientId, true)}
                value={formData.patientId}
                onChange={handleChange}

              />
            </Field>
            <Field label="Patient Name" error={errors.patientName}>
              <input
                name="patientName"
                placeholder="Alice Johnson"
                className={inputClass(!!errors.patientName)}
                value={formData.patientName}
                onChange={handleChange}
              />
            </Field>
          </div>

          {/* Row 2: DOB + Admission Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date of Birth" error={errors.dateOfBirth}>
              <input
                name="dateOfBirth"
                type="date"
                className={inputClass(!!errors.dateOfBirth)}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </Field>
            <Field label="Admission Date" error={errors.admissionDate}>
              <input
                name="admissionDate"
                type="date"
                className={inputClass(!!errors.admissionDate)}
                value={formData.admissionDate}
                onChange={handleChange}
              />
            </Field>
          </div>

          {/* Row 3: Diagnosis (full width) */}
          <Field label="Diagnosis" error={errors.diagnosis}>
            <input
              name="diagnosis"
              placeholder="e.g. Myocardial Infarction"
              className={inputClass(!!errors.diagnosis)}
              value={formData.diagnosis}
              onChange={handleChange}
            />
          </Field>

          {/* Row 4: Discharge Date (optional) */}
          <Field label="Discharge Date" error={errors.dischargeDate} hint="Optional">
            <input
              name="dischargeDate"
              type="date"
              className={inputClass(!!errors.dischargeDate)}
              value={formData.dischargeDate}
              onChange={handleChange}
            />
          </Field>

          {/* Row 5: Status + Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Status" error={errors.status}>
              <select
                name="status"
                className={inputClass(false)}
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Department" error={errors.department}>
              <input
                name="department"
                list="dept-list"
                placeholder="e.g. Cardiology"
                className={inputClass(!!errors.department)}
                value={formData.department}
                onChange={handleChange}
              />
              <datalist id="dept-list">
                {departments.map(d => <option key={d} value={d} />)}
              </datalist>
            </Field>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-emerald-50 mt-1">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 py-3 text-sm font-bold text-emerald-900/50 hover:text-emerald-950 rounded-xl border border-emerald-100 hover:bg-emerald-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-emerald-200/60 transition-all"
            >
              {isSubmitting
                ? 'Saving…'
                : editingRecord ? 'Update Record' : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────

function inputClass(hasError: boolean, readOnly = false) {
  const base = 'w-full rounded-xl px-4 py-3 text-sm font-bold outline-none transition-all border';
  const state = hasError
    ? 'border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500'
    : readOnly
      ? 'border-emerald-100/50 bg-emerald-50/50 text-emerald-900/50 cursor-default'
      : 'border-emerald-100 bg-white text-emerald-950 hover:border-emerald-200 focus:border-emerald-500 shadow-sm placeholder:text-emerald-900/20';
  return `${base} ${state}`;
}

function Field({
  label, hint, error, children,
}: {
  label: string; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-[10px] uppercase tracking-widest font-black text-emerald-900/40">{label}</label>
        {hint && !error && <span className="text-[10px] text-emerald-900/30 font-medium">{hint}</span>}
        {error && <span className="text-[10px] text-rose-500 font-bold">{error}</span>}
      </div>
      {children}
    </div>
  );
}
