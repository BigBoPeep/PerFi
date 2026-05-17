import type { ReactNode } from "react";
import { SquareRoundCorner, X } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  label?: string | undefined;
  onClick: (newValue: boolean) => void;
}

export default function Checkbox({
  checked,
  label,
  onClick,
}: CheckboxProps): ReactNode {
  return (
    <div onClick={() => onClick(!checked)}>
      <div className="relative">
        <SquareRoundCorner className="absolute inset-0" />
        <X className={`absolute inset-0 ${checked ? "" : ""}`} />
      </div>
      {label && <div>{label}</div>}
    </div>
  );
}
