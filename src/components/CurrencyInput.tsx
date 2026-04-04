"use client";
import { useState, useRef } from "react";
import { parseCurrencyInput, formatCurrency } from "@/lib/format";
import { FieldConfidence } from "@/types/cd";
import clsx from "clsx";

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  negative?: boolean; // force negative display prefix
  confidence?: FieldConfidence;
  id: string;
}

const confidenceColors: Record<FieldConfidence, string> = {
  [FieldConfidence.HIGH]: "text-emerald-400",
  [FieldConfidence.MEDIUM]: "text-amber-400",
  [FieldConfidence.LOW]: "text-rose-400",
  [FieldConfidence.MISSING]: "text-gray-500",
};

const confidenceBg: Record<FieldConfidence, string> = {
  [FieldConfidence.HIGH]: "bg-emerald-500/10 border-emerald-500/30",
  [FieldConfidence.MEDIUM]: "bg-amber-500/10 border-amber-500/30",
  [FieldConfidence.LOW]: "bg-rose-500/10 border-rose-500/30",
  [FieldConfidence.MISSING]: "bg-transparent border-white/10",
};

export default function CurrencyInput({ label, value, onChange, negative, confidence, id }: CurrencyInputProps) {
  const [focused, setFocused] = useState(false);
  const [localValue, setLocalValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = focused
    ? localValue
    : formatCurrency(Math.abs(value)).replace("$", "");

  const isNegColor = (negative || value < 0);

  return (
    <div className="group flex items-center gap-3 py-2.5 border-b border-black/5 dark:border-white/5 last:border-0 transition-all">
      <label htmlFor={id} className="flex-1 text-sm text-gray-700 dark:text-gray-300 font-medium select-none cursor-pointer transition-colors">
        {label}
        {confidence && (
          <span className={clsx("ml-2 text-[10px] font-bold uppercase tracking-widest transition-colors", confidenceColors[confidence])}>
            {confidence === FieldConfidence.HIGH ? "●" : confidence === FieldConfidence.MEDIUM ? "◑" : confidence === FieldConfidence.MISSING ? "○" : "◔"}
          </span>
        )}
      </label>
      <div
        className={clsx(
          "relative flex items-center rounded-lg border px-3 py-1.5 transition-all duration-200",
          focused
            ? "border-indigo-500/70 bg-indigo-500/5 ring-1 ring-indigo-500/30"
            : confidence
            ? confidenceBg[confidence]
            : "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5",
          "hover:border-indigo-400/40"
        )}
      >
        <span className={clsx("text-sm font-semibold mr-0.5 transition-colors", isNegColor ? "text-rose-500 dark:text-rose-400" : "text-gray-900 dark:text-gray-200")}>
          {value < 0 ? "-$" : "$"}
        </span>
        <input
          id={id}
          ref={inputRef}
          type="text"
          inputMode="text"
          value={displayValue}
          onFocus={() => {
            setFocused(true);
            setLocalValue(String(value === 0 ? "" : value));
          }}
          onBlur={(e) => {
            setFocused(false);
            const parsed = parseCurrencyInput(e.target.value);
            onChange(parsed);
          }}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^-0-9.]/g, "");
            setLocalValue(raw);
            
            // Real-time sync to store ONLY if it's a valid complete number
            if (raw && raw !== "-" && raw !== ".") {
              const parsed = parseCurrencyInput(raw);
              if (!isNaN(parsed)) {
                onChange(parsed);
              }
            }
          }}
          className="w-28 bg-transparent text-right text-sm font-semibold outline-none text-[var(--color-text)] placeholder-gray-400 dark:placeholder-gray-600 transition-colors"
          placeholder="0.00"
        />
      </div>
    </div>
  );
}
