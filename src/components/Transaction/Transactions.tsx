import type {
  Transaction,
  TransactionPatch,
} from "../../../shared/types/transaction";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTransactionModal } from "../../hooks/useTransactionModal";
import TransactionRow from "./TransactionRow";
import TransactionModal from "./TransactionModal";

interface TransactionsProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  selectMode: boolean;
  updateTransaction: (
    id: string,
    updates: TransactionPatch,
  ) => Promise<Transaction>;
  selectTransaction: (id: string, selected: boolean) => void;
  selectedTransactionIDs: Set<string>;
  className?: string;
}

export default function Transactions({
  transactions,
  isLoading,
  error,
  selectMode,
  updateTransaction,
  selectedTransactionIDs,
  selectTransaction,
  className = "",
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

  const tList =
    transactions.length === 0 ? (
      <div>No transactions yet...</div>
    ) : (
      <ul className="grid grid-cols-[max-content,1fr,1fr,max-content] gap-1">
        <li
          className="grid grid-cols-subgrid col-start-1 col-span-4
            *:w-full *:text-center"
        >
          <span className="col-start-1">Date</span>
          <span className="col-start-2">Desc</span>
          <span className="col-start-3">Location</span>
          <span className="col-start-4">Amount</span>
        </li>
        {transactions.map((trans) => (
          <li
            key={trans._id}
            className="col-start-1 col-span-4 grid grid-cols-subgrid"
          >
            <TransactionRow
              className="col-start-1 col-span-4 grid grid-cols-subgrid"
              transaction={trans}
              onView={() => openModal(trans, "view")}
              selectMode={selectMode}
              selected={selectedTransactionIDs.has(trans._id)}
              onSelectChange={(newValue) =>
                selectTransaction(trans._id, newValue)
              }
            />
          </li>
        ))}
      </ul>
    );

  const content = isLoading ? "Loading..." : error ? error : tList;

  return (
    <div
      className={`w-full max-w-7xl place-self-center flex flex-col ${className}`}
    >
      {content}

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
