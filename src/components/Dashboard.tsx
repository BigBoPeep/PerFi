import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../modules/currency";
import Transactions from "./Transactions";

export default function Dashboard() {
  const [selectedAccountID, setSelectedAccountID] = useState<
    string | undefined
  >();
  const { transactions, balance, isLoading, error, addTransaction } =
    useTransactions(selectedAccountID);
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
