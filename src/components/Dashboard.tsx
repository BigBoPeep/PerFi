import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../modules/currency";
import Transactions from "./Transactions";
import TransactionControls from "./TransactionControls";

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
  } = useTransactions(selectedAccountID);
  const { settings } = useSettings();

  return (
    <div>
      Dashboard
      <TransactionControls />
      <Transactions
        transactions={transactions}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
