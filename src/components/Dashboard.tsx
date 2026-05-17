import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../modules/currency";
import Transactions from "./Transaction/Transactions";
import TransactionControls from "./Transaction/TransactionControls";

export default function Dashboard() {
  const [selectedAccountID, setSelectedAccountID] = useState<
    string | undefined
  >();
  const {
    transactions,
    balance,
    isLoading,
    error,
    addTransaction,
    deleteTransaction,
  } = useTransactions();
  const { settings } = useSettings();

  return (
    <div>
      <Transactions
        transactions={transactions}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
