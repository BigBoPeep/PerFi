import { useState, useEffect, useRef } from "react";
import type { LocalSettings } from "../../../shared/types/settings";
import type {
  NewTransaction,
  Transaction,
} from "../../../shared/types/transaction";
import type { ReactNode } from "react";
import type { TransactionModalMode } from "../../hooks/useTransactionModal";
import {
  ListPlus,
  PencilLine,
  PencilOff,
  Trash2,
  SquareX,
  CheckLine,
  RotateCcw,
} from "lucide-react";
import Dropdown from "../Dropdown";
import {
  TRANSACTION_SORT_FIELD_OPTS as SORT_FIELD_OPTS,
  TRANSACTION_SORT_ORDER_OPTS as SORT_ORDER_OPTS,
} from "../../app.config";
import { useLocalSettings } from "../../context/LocalSettingsContext";
import { useAccounts } from "../../context/AccountsContext";
import { isValidAmount } from "../../modules/currency";
import { useToast } from "../../context/ToastContext";
import LoadingSpinner from "../LoadingSpinner";

export interface TransactionControlsProps {
  disabled?: boolean;
  onToggleEdit: (editMode: boolean) => void;
  onDelete: () => void;
  addTransaction: (data: NewTransaction) => Promise<Transaction>;
}

export default function TransactionControls({
  disabled,
  onToggleEdit,
  onDelete,
  addTransaction,
}: TransactionControlsProps): ReactNode {
  const { localSettings, updateLocalSettings } = useLocalSettings();
  const { selectedAccount } = useAccounts();
  const [editMode, setEditMode] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inpLocation = useRef<HTMLInputElement>(null);
  const inpDescription = useRef<HTMLTextAreaElement>(null);
  const inpDate = useRef<HTMLInputElement>(null);
  const inpAmount = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  useEffect(() => {
    onToggleEdit(editMode);
  }, [editMode]);

  const handleReset = () => {
    if (inpAmount.current) inpAmount.current.value = "0";
    if (inpDate.current) inpDate.current.value = "";
    if (inpDescription.current) inpDescription.current.value = "";
    if (inpLocation.current) inpLocation.current.value = "";
  };

  const handleSubmit = async () => {
    if (!selectedAccount) {
      addToast("No Account selected", "error");
      return;
    }

    const amtCheck = isValidAmount(inpAmount.current?.value ?? "");
    if (amtCheck) {
      addToast(amtCheck, "warning");
      return;
    }

    try {
      setSubmitting(true);
      await addTransaction({
        accountID: selectedAccount._id,
        amount: parseFloat(inpAmount.current?.value ?? ""),
        date: inpDate.current?.value.trim(),
        description: inpDescription.current?.value.trim(),
        location: inpLocation.current?.value.trim(),
      });
      handleReset();
      setAddOpen(false);
    } catch (err: any) {
      addToast(err.msg ?? err.message ?? err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="relative p-3 bg-[var(--color-sec)] w-full max-w-prose place-self-center
        rounded-sm my-2"
    >
      {editMode ? (
        <div className="flex justify-evenly">
          <button onClick={() => setEditMode(false)}>
            <PencilOff />
          </button>
          <button onClick={onDelete} disabled={disabled}>
            <Trash2 />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setAddOpen(!addOpen);
              handleReset();
            }}
          >
            {addOpen ? <SquareX /> : <ListPlus />}
          </button>
          <button
            onClick={() => {
              setEditMode(!editMode);
            }}
            disabled={disabled}
          >
            <PencilLine />
          </button>
          <Dropdown
            className="w-full"
            opts={SORT_FIELD_OPTS}
            selected={localSettings.sortField}
            onChange={(value) =>
              updateLocalSettings({
                sortField: value as LocalSettings["sortField"],
              })
            }
            disabled={disabled}
          />
          <Dropdown
            className="w-full"
            opts={SORT_ORDER_OPTS}
            selected={localSettings.sortOrder}
            onChange={(value) =>
              updateLocalSettings({
                sortOrder: value as LocalSettings["sortOrder"],
              })
            }
            disabled={disabled}
          />
        </div>
      )}

      <div
        className={`absolute bg-inherit p-2 grid grid-rows-3 grid-cols-2 gap-2
          w-full origin-top left-0 top-full
          transition-transform duration-300 ease-in
          ${addOpen ? "scale-100" : "scale-y-0"}`}
      >
        <div className="row-start-1 row-span-2 flex flex-col justify-between">
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Location"
            ref={inpLocation}
          />
          <input type="datetime-local" name="date" id="date" ref={inpDate} />
        </div>

        <div className="row-start-1 row-span-2 col-start-2">
          <textarea
            className="w-full h-full resize-none"
            name="description"
            id="description"
            placeholder="Description"
            ref={inpDescription}
          />
        </div>

        <div className="row-start-3 col-span-2 flex">
          <input
            className="w-1/2"
            type="number"
            step={0.01}
            name="amount"
            id="amount"
            placeholder="Amount"
            ref={inpAmount}
          />
          <div className="grow flex justify-evenly items-center">
            <button onClick={handleReset}>
              <RotateCcw />
            </button>
            <button
              onClick={() => {
                if (!submitting) handleSubmit();
              }}
            >
              {submitting ? (
                <div className="h-6 w-6 flex justify-center items-center">
                  <LoadingSpinner />
                </div>
              ) : (
                <CheckLine />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
