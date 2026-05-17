import type { Transaction } from "../../../shared/types/transaction";
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
}

export default function Transactions({
  transactions,
  isLoading,
  error,
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
  const { updateTransaction, deleteTransaction, addTransaction } =
    useTransactions();
  const [editMode, setEditMode] = useState(false);
  const [selectedTransactionIDs, setSelectedTransactionIDs] = useState<
    Set<string>
  >(new Set());

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
          <li key={trans._id}>
            {editMode && (
              <Checkbox
                checked={selectedTransactionIDs.has(trans._id)}
                onClick={(newValue) => {
                  if (newValue)
                    setSelectedTransactionIDs(
                      new Set([...selectedTransactionIDs, trans._id]),
                    );
                  else {
                    const newSet = selectedTransactionIDs;
                    newSet.delete(trans._id);
                    setSelectedTransactionIDs(new Set(newSet));
                  }
                }}
              />
            )}
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
      <TransactionControls
        onToggleEdit={(newEditMode) => setEditMode(newEditMode)}
        disabled={transactions.length === 0}
        onDelete={() => {}}
        addTransaction={addTransaction}
      />

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
