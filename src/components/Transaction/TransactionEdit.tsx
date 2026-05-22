import type { ReactNode } from "react";
import type {
  Transaction,
  TransactionPatch,
} from "../../../shared/types/transaction";
import { useAccounts } from "../../context/AccountsContext";
import { useRef } from "react";
import { SquareX, Save } from "lucide-react";
import { format } from "date-fns";

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
        id="modalDate"
        ref={dateInput}
        defaultValue={format(transaction.date, "yyyy-MM-dd'T'HH:mm:ss")}
      />
      <input
        type="text"
        name="location"
        id="modalLocation"
        ref={locationInput}
        defaultValue={transaction.location ?? ""}
      />
      <textarea
        name="description"
        id="modalDescription"
        ref={descriptionInput}
        defaultValue={transaction.description ?? ""}
      />
      <input
        type="number"
        name="amount"
        id="modalAmount"
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
