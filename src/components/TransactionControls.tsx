import React from "react";
import type { TransactionControlsProps } from "../../shared/types/transaction";
import { ListPlus } from "lucide-react";
import Dropdown from "./Dropdown";

export default function TransactionControls({
  addTransaction,
  deleteTransaction,
}: TransactionControlsProps): React.ReactNode {
  return (
    <div>
      <Dropdown opts={[]} />
    </div>
  );
}
