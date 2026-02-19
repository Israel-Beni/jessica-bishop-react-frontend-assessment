import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export default function FormField({ label, id, error, children, required }: FormFieldProps) {
  return (
    <div className="mb-2">
      <label htmlFor={id} className="block text-xs font-extra-bold text-emerald-900/50 uppercase tracking-widest mb-2 ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-2 text-xs text-rose-600 font-bold ml-1 animate-fade-in">{error}</p>}
    </div>
  );
}
