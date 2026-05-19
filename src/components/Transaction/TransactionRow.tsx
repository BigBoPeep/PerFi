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
    <div className="grow grid grid-cols-[max-content,auto,auto,max-content] place-content-between gap-2">
      <span className="col-start-1">
        {format(
          transaction.date,
          settings ? settings.dateFormat : "MM/dd/yyyy HH:mm",
        )}
      </span>
      <span className="col-start-2">{transaction.description}</span>
      <span className="col-start-3">{transaction.location}</span>
      <span className="col-start-4">
        {formatCurrency(
          transaction.amount,
          settings ? settings.currency : "USD",
        )}
      </span>
    </div>
  );
}
