import type { ReactNode } from "react";
import type { Transaction } from "../../../shared/types/transaction";
import { format } from "date-fns";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../modules/currency";
import Checkbox from "../Checkbox";

interface TransactionRowProps {
  className?: string;
  transaction: Transaction;
  onView: () => void;
  selectMode: boolean;
  selected: boolean;
  onSelectChange: (newValue: boolean) => void;
}

export default function TransactionRow({
  transaction,
  onView,
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
      className={`cursor-pointer *:not-last:text-center *:even:bg-black/10 *:px-1 
        hover:bg-black/10 ${className}`}
      onClick={onView}
    >
      <div className="col-start-1 flex justify-center">
        <div className="h-6 w-6">
          {selectMode && (
            <Checkbox
              checked={selected}
              onClick={(newValue) => onSelectChange(newValue)}
            />
          )}
        </div>
        {format(transaction.date, datetimeFormat)}
      </div>
      <div className="col-start-2 line-clamp-1">{transaction.description}</div>
      <div className="col-start-3 line-clamp-1">{transaction.location}</div>
      <div className="col-start-4 w-full text-right">
        {formatCurrency(
          transaction.amount,
          settings ? settings.currency : "USD",
        )}
      </div>
    </div>
  );
}
