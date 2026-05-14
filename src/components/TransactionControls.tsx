import React, { useState } from "react";
import type { TransactionControlsProps } from "../../shared/types/transaction";
import type { LocalSettings } from "../../shared/types/settings";
import { ListPlus } from "lucide-react";
import Dropdown from "./Dropdown";
import {
  TRANSACTION_SORT_FIELD_OPTS as SORT_FIELD_OPTS,
  TRANSACTION_SORT_ORDER_OPTS as SORT_ORDER_OPTS,
} from "../app.config";
import { useLocalSettings } from "../context/LocalSettingsContext";

export default function TransactionControls({
  addTransaction,
  deleteTransaction,
}: TransactionControlsProps): React.ReactNode {
  const { localSettings, updateLocalSettings } = useLocalSettings();
  return (
    <div className="flex gap-2 p-2 bg-black/10">
      <button>
        <ListPlus />
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
      />
    </div>
  );
}
