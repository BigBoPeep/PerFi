import type { ReactNode } from "react";
import type {
  Transaction,
  TransactionPatch,
} from "../../../shared/types/transaction";
import { useAccounts } from "../../context/AccountsContext";
import { useRef } from "react";
import { SquareX, Save } from "lucide-react";

interface TransactionEditProps {
  transaction: Transaction;
  onSave: (updates: TransactionPatch) => Promise<void>;
  onCancel: () => void;
}

export default function TransactionEdit({
  transaction,
  onSave,
  onCancel,
}: TransactionEditProps) {
  const { selectedAccount } = useAccounts();
  const dateInput = useRef<HTMLInputElement>(null);
  const locationInput = useRef<HTMLInputElement>(null);
  const descriptionInput = useRef<HTMLTextAreaElement>(null);
  const amountInput = useRef<HTMLInputElement>(null);

  return (
    <div>
      <section>{selectedAccount?.name}</section>
      <input
        type="datetime-local"
        name="date"
        id="date"
        ref={dateInput}
        defaultValue={transaction.date}
      />
      <input
        type="text"
        name="location"
        id="location"
        ref={locationInput}
        defaultValue={transaction.location ?? ""}
      />
      <textarea
        name="description"
        id="description"
        ref={descriptionInput}
        defaultValue={transaction.description ?? ""}
      />
      <input
        type="number"
        name=""
        id=""
        step={0.01}
        ref={amountInput}
        defaultValue={transaction.amount}
      />
      <button>
        <Save />
      </button>
    </div>
  );
}
