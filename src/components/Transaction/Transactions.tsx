import type {
  Transaction,
  TransactionPatch,
} from "../../../shared/types/transaction";
import type { ReactNode } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useTransactionModal } from "../../hooks/useTransactionModal";
import { useTransactions } from "../../hooks/useTransactions";
import TransactionRow from "./TransactionRow";
import TransactionModal from "./TransactionModal";
import TransactionControls from "./TransactionControls";
import Checkbox from "../Checkbox";

interface TransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  editMode: boolean;
  updateTransaction: (
    id: string,
    updates: TransactionPatch,
  ) => Promise<Transaction>;
  selectTransaction: (id: string, selected: boolean) => void;
  selectedTransactionIDs: Set<string>;
}

export default function Transactions({
  transactions,
  isLoading,
  error,
  editMode,
  updateTransaction,
  selectedTransactionIDs,
  selectTransaction,
}: TransactionsProps): ReactNode {
  const {
    modalState,
    isOpen,
    openModal,
    closeModal,
    setMode,
    handleTransitionEnd,
    updateModalData,
  } = useTransactionModal();

  if (isLoading)
    return (
      <div>
        <>Loading...</>
      </div>
    );

  if (error)
    return (
      <div>
        <>Error: {error}</>
      </div>
    );

  const tList =
    transactions.length === 0 ? (
      <div>No transactions yet...</div>
    ) : (
      <ul>
        {transactions.map((trans) => (
          <li key={trans._id} className="flex">
            <div className="w-6 h-6">
              {editMode && (
                <Checkbox
                  checked={selectedTransactionIDs.has(trans._id)}
                  onClick={(newValue) => selectTransaction(trans._id, newValue)}
                />
              )}
            </div>
            <TransactionRow
              transaction={trans}
              onView={() => openModal(trans, "view")}
            />
          </li>
        ))}
      </ul>
    );

  return (
    <div>
      {tList}

      {modalState &&
        createPortal(
          <TransactionModal
            modalState={modalState}
            isOpen={isOpen}
            onClose={closeModal}
            onSwitchToEdit={() => setMode("edit")}
            onSave={async (updates) => {
              const updated = await updateTransaction(
                modalState.transaction._id,
                updates,
              );
              updateModalData(updated);
              closeModal();
            }}
            onTransitionEnd={handleTransitionEnd}
          />,
          document.documentElement,
        )}
    </div>
  );
}
