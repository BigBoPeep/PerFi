import { useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { useSettings } from "../context/SettingsContext";
import { useAccounts } from "../context/AccountsContext";
import { formatCurrency } from "../modules/currency";
import Transactions from "./Transaction/Transactions";
import AccountControls from "./Account/AccountControls";
import TransactionControls from "./Transaction/TransactionControls";

export default function Dashboard() {
  const {
    transactions,
    balance,
    isLoading: isTransactionsLoading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  } = useTransactions();
  const { selectedAccount, isLoading: isAccountsLoading } = useAccounts();
  const { settings } = useSettings();
  const [selectMode, setSelectMode] = useState(false);
  const [selectedTransactionIDs, setSelectedTransactionIDs] = useState<
    Set<string>
  >(new Set());

  return (
    <div className="flex flex-col grow">
      <AccountControls />
      {selectedAccount && (
        <>
          <TransactionControls
            addTransaction={addTransaction}
            onToggleEdit={(newMode) => {
              if (!newMode) setSelectedTransactionIDs(new Set());
              setSelectMode(newMode);
            }}
            onDelete={() => {}}
            disabled={isTransactionsLoading || transactions.length < 1}
          />
          <Transactions
            className="grow bg-black/5 p-1 rounded-md"
            transactions={transactions}
            isLoading={isTransactionsLoading}
            error={error}
            selectMode={selectMode}
            updateTransaction={updateTransaction}
            selectedTransactionIDs={selectedTransactionIDs}
            selectTransaction={(id, selected) => {
              const newSet = new Set(selectedTransactionIDs);
              if (selected) newSet.add(id);
              else newSet.delete(id);
              setSelectedTransactionIDs(newSet);
            }}
          />
          <div
            className="w-full max-w-prose place-self-center text-1
            bg-[var(--color-sec)] rounded-t-md p-1 mt-2"
          >
            <div
              className="bg-[var(--color-pri)] px-2 py-1 rounded-md w-fit
                place-self-end"
            >
              {formatCurrency(balance, settings?.currency ?? "USD")}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
