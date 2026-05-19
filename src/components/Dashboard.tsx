import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { useSettings } from "../context/SettingsContext";
import Transactions from "./Transaction/Transactions";
import AccountControls from "./Account/AccountControls";
import TransactionControls from "./Transaction/TransactionControls";

export default function Dashboard() {
  const {
    transactions,
    balance,
    isLoading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  } = useTransactions();
  const { settings } = useSettings();
  const [editMode, setEditMode] = useState(false);
  const [selectedTransactionIDs, setSelectedTransactionIDs] = useState<
    Set<string>
  >(new Set());

  return (
    <div>
      <AccountControls />
      <TransactionControls
        addTransaction={addTransaction}
        onToggleEdit={(newMode) => {
          if (!newMode) setSelectedTransactionIDs(new Set());
          setEditMode(newMode);
        }}
        onDelete={() => {}}
      />
      <Transactions
        transactions={transactions}
        isLoading={isLoading}
        error={error}
        editMode={editMode}
        updateTransaction={updateTransaction}
        selectedTransactionIDs={selectedTransactionIDs}
        selectTransaction={(id, selected) => {
          const newSet = new Set(selectedTransactionIDs);
          if (selected) newSet.add(id);
          else newSet.delete(id);
          setSelectedTransactionIDs(newSet);
        }}
      />
    </div>
  );
}
