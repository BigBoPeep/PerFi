import type { ReactNode } from "react";
import { Square, X } from "lucide-react";

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
    <div className="" onClick={() => onClick(!checked)}>
      <div className="relative">
        <Square className="absolute inset-0" />
        <X
          className={`absolute inset-0 ${checked ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      {label && <div>{label}</div>}
    </div>
  );
}
