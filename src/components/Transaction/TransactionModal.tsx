import type { ReactNode } from "react";
import type {
  TransactionModalState,
  TransactionModalMode,
} from "../../hooks/useTransactionModal";
import type { TransactionPatch } from "../../../shared/types/transaction";
import TransactionView from "./TransactionView";
import TransactionEdit from "./TransactionEdit";
import { SquareX } from "lucide-react";

const sharedTransition = "duration-300";

interface TransactionModalProps {
  modalState: TransactionModalState;
  isOpen: boolean;
  onClose: () => void;
  onSwitchToEdit: () => void;
  onSave: (updates: TransactionPatch) => Promise<void>;
  onTransitionEnd: () => void;
}

export default function TransactionModal({
  modalState,
  isOpen,
  onClose,
  onSwitchToEdit,
  onSave,
  onTransitionEnd,
}: TransactionModalProps): ReactNode {
  const { transaction, mode } = modalState;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-100">
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity
          ${isOpen ? "opacity-100" : "opacity-0"} ${sharedTransition}`}
        onClick={onClose}
        onTransitionEnd={onTransitionEnd}
      />

      <div
        className={`relative z-10 w-full max-w-lg rounded-md bg-[var(--color-sec)] p-2 shadow-lg
          transition-transform
          ${isOpen ? "translate-y-0 scale-100" : "-translate-y-full scale-x-0"}`}
      >
        <div className="bg-[var(--color-pri)]">
          <div>
            <h3>{`${mode === "edit" ? "Edit " : ""}Transaction`}</h3>
            <button onClick={onClose}>
              <SquareX />
            </button>
          </div>

          {mode === "view" ? (
            <TransactionView
              onEdit={onSwitchToEdit}
              transaction={transaction}
            />
          ) : (
            <TransactionEdit
              transaction={transaction}
              onCancel={onClose}
              onSave={onSave}
            />
          )}
        </div>
      </div>
    </div>
  );
}
