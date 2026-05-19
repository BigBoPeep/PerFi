import type React from "react";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export type DropdownOpt = {
  label: string;
  value: string;
};

interface DropdownProps {
  opts: DropdownOpt[];
  selected?: string | undefined;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  emptyListMsg?: string;
  emptySelectionMsg?: string;
}

const sharedTransition = "duration-300 ease-out";

export default function Dropdown({
  opts,
  selected,
  onChange,
  className = "",
  disabled,
  emptyListMsg,
  emptySelectionMsg = "",
}: DropdownProps): React.ReactNode {
  const [open, setOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    opts.find((opt) => opt.value === selected)?.label ??
    selected ??
    emptySelectionMsg;

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
      className={`relative transition-all transform-gpu cursor-pointer
        outline-1 bg-[var(--color-pri)]
        ${open ? "rounded-t-md z-50" : "rounded-md"} ${sharedTransition}
        ${disabled ? "opacity-30" : ""}
        ${className}`}
      ref={dropRef}
      onClick={() => {
        if (!disabled) setOpen(!open);
      }}
    >
      <div className="flex justify-between px-1 py-0.5">
        <p className="grow text-ellipsis">{selectedLabel}</p>
        <ChevronDown className="shrink-0" />
      </div>

      <ul
        className={`absolute overflow-hidden origin-top transition-transform
          bg-inherit w-full rounded-b-md outline
          ${open ? "scale-y-100 z-50" : "scale-y-0 scale-x-95"} ${sharedTransition}`}
      >
        {opts.length > 0 ? (
          opts.map((opt) => (
            <li
              className={`py-0.5 px-1 hover:bg-gray-500/20`}
              key={opt.value}
              onClick={(e) => {
                e.stopPropagation();
                if (onChange) onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))
        ) : (
          <li className="py-0.5 px-1">
            {emptyListMsg ?? "This list is empty..."}
          </li>
        )}
      </ul>
    </div>
  );
}
