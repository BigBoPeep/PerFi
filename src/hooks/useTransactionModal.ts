import { useState, useCallback } from "react";
import type { Transaction } from "../../shared/types/transaction";

export type TransactionModalMode = "view" | "edit";

export interface TransactionModalState {
  transaction: Transaction;
  mode: TransactionModalMode;
}

interface UseTransactionModalResult {
  modalState: TransactionModalState | null;
  isOpen: boolean;
  openModal: (transaction: Transaction, mode: TransactionModalMode) => void;
  closeModal: () => void;
  setMode: (mode: TransactionModalMode) => void;
  updateModalData: (updated: Transaction) => void;
  handleTransitionEnd: () => void;
}

export const useTransactionModal = (): UseTransactionModalResult => {
  const [modalState, setModalState] = useState<TransactionModalState | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(
    (transaction: Transaction, mode: TransactionModalMode) => {
      setModalState({ transaction, mode });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsOpen(true));
      });
    },
    [],
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const setMode = useCallback((mode: TransactionModalMode) => {
    setModalState((prev) => (prev ? { ...prev, mode } : null));
  }, []);

  const handleTransitionEnd = useCallback(() => {
    if (!isOpen) setModalState(null);
  }, [isOpen]);

  const updateModalData = useCallback((updated: Transaction) => {
    setModalState((prev) => (prev ? { ...prev, transaction: updated } : null));
  }, []);

  return {
    modalState,
    isOpen,
    openModal,
    closeModal,
    setMode,
    updateModalData,
    handleTransitionEnd,
  };
};
