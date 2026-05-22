import type { ReactNode } from "react";
import { useState, useEffect, useRef } from "react";
import { useAccounts } from "../../context/AccountsContext";
import { useToast } from "../../context/ToastContext";
import Dropdown from "../Dropdown";
import LoadingSpinner from "../LoadingSpinner";
import {
  CheckLine,
  RotateCcw,
  SquareX,
  SquarePlus,
  PencilLine,
} from "lucide-react";

interface AccountControlsProps {
  className?: string;
}

export default function AccountControls({
  className,
}: AccountControlsProps): ReactNode {
  const {
    accounts,
    selectedAccount,
    selectAccount,
    selectedAccountID,
    addAccount,
    editAccount,
  } = useAccounts();
  const { addToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formEditMode, setFormEditMode] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const inpName = useRef<HTMLInputElement>(null);
  const inpType = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!formOpen) {
      setFormEditMode(false);
      return;
    }
    if (formEditMode) {
      if (inpName.current) inpName.current.value = selectedAccount?.name ?? "";
      if (inpType.current) inpType.current.value = selectedAccount?.type ?? "";
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setFormOpen(false);
        handleReset();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [formOpen]);

  const handleSubmit = async () => {
    if (inpName.current && inpType.current) {
      if (inpName.current.value.length < 3) {
        addToast("Account Name must be at least 3 characters", "warning");
        return;
      }
      if (inpType.current.value.length < 3) {
        addToast("Account Type must be at least 3 characters", "warning");
        return;
      }
      if (formEditMode) {
        if (!selectedAccount) {
          addToast("No Account selected", "error");
          return;
        }
        try {
          setSubmitting(true);
          await editAccount(selectedAccount._id, {
            name: inpName.current.value,
            type: inpType.current.value,
          });
          setFormOpen(false);
        } catch (err: any) {
          addToast(err.msg || err.message || err);
        } finally {
          setSubmitting(false);
        }
      } else
        try {
          setSubmitting(true);
          await addAccount({
            name: inpName.current.value,
            type: inpType.current.value,
          });
          setFormOpen(false);
        } catch (err: any) {
          addToast(err.msg || err.message || err);
        } finally {
          setSubmitting(false);
        }
    } else {
      addToast("Internal Error. Please reload and try again.", "error");
    }
  };

  const handleReset = () => {
    if (inpName.current && inpType.current)
      if (formEditMode) {
        inpName.current.value = selectedAccount?.name ?? "";
        inpType.current.value = selectedAccount?.type ?? "";
      } else {
        inpName.current.value = "";
        inpType.current.value = "";
      }
  };

  return (
    <div
      className={`relative w-full max-w-prose place-self-center mt-2 bg-[var(--color-sec)] 
        p-2 flex gap-2 z-1 transition-all transform-gpu duration-300 ease-in
        ${formOpen ? "rounded-t-md" : "rounded-md"} ${className}`}
    >
      <button
        onClick={() => {
          if (!formOpen) handleReset();
          setFormOpen(!formOpen);
        }}
      >
        {formOpen ? <SquareX /> : <SquarePlus />}
      </button>

      <button
        className={`${formEditMode ? "disabled:opacity-100" : ""}`}
        disabled={!selectedAccount || formOpen}
        onClick={() => {
          setFormEditMode(true);
          setFormOpen(true);
        }}
      >
        <PencilLine className={`${formEditMode ? "animate-pulse" : ""}`} />
      </button>

      <Dropdown
        className="grow"
        opts={accounts.map((acct) => {
          return { label: acct.name, value: acct._id };
        })}
        selected={selectedAccountID}
        emptyListMsg="No Accounts..."
        emptySelectionMsg="Select an Account"
        onChange={(accountID) => {
          if (formOpen) setFormOpen(false);
          selectAccount(accountID);
        }}
      />

      <div
        className={`absolute w-full left-0 top-full bg-inherit flex flex-col p-2 gap-2
          transition-transform duration-300 ease-in origin-top rounded-b-md
          ${formOpen ? "scale-100 z-50" : "scale-y-0"}`}
        ref={formRef}
      >
        <input
          type="text"
          name="accountName"
          id="accountName"
          placeholder="Account Name"
          ref={inpName}
        />

        <div className="flex w-full">
          <input
            className="w-1/2"
            type="text"
            name="accountType"
            id="accountType"
            placeholder="Account Type"
            ref={inpType}
          />
          <div className="flex grow justify-evenly">
            <button onClick={handleReset} disabled={submitting}>
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
