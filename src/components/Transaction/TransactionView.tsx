import type { ReactNode } from "react";
import type { Transaction } from "../../../shared/types/transaction";
import { useAccounts } from "../../context/AccountsContext";
import { format } from "date-fns";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../modules/currency";
import { PencilLine } from "lucide-react";

interface TransactionViewProps {
  transaction: Transaction;
  onEdit: () => void;
}

export default function TransactionView({
  transaction,
  onEdit,
}: TransactionViewProps): ReactNode {
  const { settings } = useSettings();
  const { selectedAccount } = useAccounts();

  const date = format(
    transaction.date,
    settings ? settings.dateFormat : "MM/dd/yyyy HH:mm",
  );

  const location = transaction.location ?? <span>Undefined Location</span>;

  const description = transaction.description ?? (
    <span>Undefined Description</span>
  );

  const amount = formatCurrency(
    transaction.amount,
    settings ? settings.currency : "USD",
  );

  return (
    <div>
      <section>{selectedAccount?.name}</section>
      <section>{date}</section>
      <section>{location}</section>
      <section>{description}</section>
      <section>{amount}</section>
      <button onClick={onEdit}>
        <PencilLine />
      </button>
    </div>
  );
}
