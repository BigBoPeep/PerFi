import type React from "react";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export type DropdownOpt = {
  label: string;
  value: string;
};

interface DropdownProps {
  opts: DropdownOpt[];
  selected: DropdownOpt;
  onChange?: (value: string) => void;
}

export default function Dropdown({
  opts,
  selected,
  onChange,
}: DropdownProps): React.ReactNode {
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropRef}>
      <div className="flex justify-between">
        <p className="grow text-ellipsis">
          {selected?.label || "No Selection"}
        </p>
        <ChevronDown className="shrink-0" />
      </div>

      <ul className="absolute">
        {opts.map((opt) => (
          <li key={opt.value}>{opt.label}</li>
        ))}
      </ul>
    </div>
  );
}
