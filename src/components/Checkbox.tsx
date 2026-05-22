import type { ReactNode } from "react";
import { Square, X } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  label?: string | undefined;
  onClick: (newValue: boolean) => void;
  className?: string;
}

export default function Checkbox({
  checked,
  label,
  onClick,
  className,
}: CheckboxProps): ReactNode {
  return (
    <div
      className={`${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(!checked);
      }}
    >
      <div className="relative w-full h-full">
        <Square className="absolute inset-0 w-full h-full" />
        <X
          className={`absolute inset-0 w-full h-full ${checked ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      {label && <div>{label}</div>}
    </div>
  );
}
