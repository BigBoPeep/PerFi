import type React from "react";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export type DropdownOpt = {
  label: string;
  value: string;
};

interface DropdownProps {
  opts: DropdownOpt[];
  selected: string;
  onChange?: (value: string) => void;
  className?: string;
}

const sharedTransition = "duration-300 ease-out";

export default function Dropdown({
  opts,
  selected,
  onChange,
  className = "",
}: DropdownProps): React.ReactNode {
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    opts.find((opt) => opt.value === selected)?.label ?? selected;

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
    <div
      className={`relative bg-amber-200 transition-all transform-gpu
        cursor-pointer
        ${open ? "rounded-t-md" : "rounded-md"} ${sharedTransition}
        ${className}`}
      ref={dropRef}
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between px-1 py-0.5">
        <p className="grow text-ellipsis">{selectedLabel}</p>
        <ChevronDown className="shrink-0" />
      </div>

      <ul
        className={`absolute overflow-hidden origin-top transition-transform
          bg-inherit w-full rounded-b-md
          ${open ? "scale-y-100" : "scale-y-0 scale-x-95"} ${sharedTransition}`}
      >
        {opts.map((opt) => (
          <li
            className={`py-0.5 px-1 hover:bg-gray-500/20 ${open ? "z-50" : ""}`}
            key={opt.value}
            onClick={(e) => {
              e.stopPropagation();
              if (onChange) onChange(opt.value);
              setOpen(false);
            }}
          >
            {opt.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
