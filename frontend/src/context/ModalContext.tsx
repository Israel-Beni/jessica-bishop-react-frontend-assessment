import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ClinicalRecord } from '../types';

interface ModalContextType {
  isOpen: boolean;
  editingRecord: ClinicalRecord | null;
  openModal: (record?: ClinicalRecord | null) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ClinicalRecord | null>(null);

  const openModal = (record?: ClinicalRecord | null) => {
    setEditingRecord(record ?? null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingRecord(null);
  };

  return (
    <ModalContext.Provider value={{ isOpen, editingRecord, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
