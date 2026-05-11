import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../modules/currency";
import type { TransactionsProps } from "../../shared/types/transaction";

export default function Transactions({
  transactions,
  isLoading,
  error,
}: TransactionsProps): React.ReactNode {
  const { settings } = useSettings();

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

  if (transactions.length === 0)
    return (
      <div>
        <>No transactions yet...</>
      </div>
    );

  return (
    <ul>
      {transactions.map((trans) => (
        <li key={trans._id}>
          <span>
            {settings
              ? format(parseISO(trans.date), settings.dateFormat)
              : trans.date}
          </span>
          <span>{trans.description}</span>
          <span>
            {settings
              ? formatCurrency(trans.amount, settings.currency)
              : trans.amount}
          </span>
        </li>
      ))}
    </ul>
  );
}
