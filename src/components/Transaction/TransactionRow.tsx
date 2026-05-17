import type { ReactNode } from "react";
import type { Transaction } from "../../../shared/types/transaction";
import { format } from "date-fns";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../modules/currency";

interface TransactionRowProps {
  transaction: Transaction;
  onView: () => void;
}

export default function TransactionRow({
  transaction,
  onView,
}: TransactionRowProps): ReactNode {
  const { settings } = useSettings();
  return (
    <div>
      <span>
        {format(
          transaction.date,
          settings ? settings.dateFormat : "MM/dd/yyyy HH:mm",
        )}
      </span>
      <span>{transaction.description}</span>
      <span>{transaction.location}</span>
      <span>
        {formatCurrency(
          transaction.amount,
          settings ? settings.currency : "USD",
        )}
      </span>
    </div>
  );
}
