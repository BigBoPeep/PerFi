import type { ReactNode } from "react";
import type { Transaction } from "../../../shared/types/transaction";
import { format } from "date-fns";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../modules/currency";
import Checkbox from "../Checkbox";

interface TransactionRowProps {
  className?: string;
  transaction: Transaction;
  selectMode: boolean;
  selected: boolean;
  onSelectChange: (newValue: boolean) => void;
}

export default function TransactionRow({
  transaction,
  selectMode,
  selected,
  onSelectChange,
  className = "",
}: TransactionRowProps): ReactNode {
  const { settings } = useSettings();

  const datetimeFormat = settings
    ? `${settings.dateFormat} ${settings.timeFormat}`
    : "MM/dd/yyyy HH:mm";

  return (
    <div
      className={`*:not-last:text-center *:even:bg-black/10 *:px-1 
        ${className}`}
    >
      <div className="col-start-1 flex justify-center whitespace-nowrap">
        {selectMode && (
          <Checkbox
            className="w-6 h-6"
            checked={selected}
            onClick={(newValue) => onSelectChange(newValue)}
          />
        )}
        {format(transaction.date, datetimeFormat)}
      </div>
      <div className="col-start-2 line-clamp-1 text-ellipsis">
        {transaction.description}
      </div>
      <div className="col-start-3 line-clamp-1 text-ellipsis">
        {transaction.location}
      </div>
      <div className="col-start-4 w-full text-right">
        {formatCurrency(
          transaction.amount,
          settings ? settings.currency : "USD",
        )}
      </div>
    </div>
  );
}
