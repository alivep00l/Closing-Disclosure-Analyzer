"use client";
import { formatCurrency } from "@/lib/format";
import clsx from "clsx";

interface SummaryRowProps {
  label: string;
  value: number;
  highlight?: boolean;  // benefit row — bold + accent
  negative?: boolean;   // force negative display
  dimmed?: boolean;
  large?: boolean;
}

export default function SummaryRow({ label, value, highlight, negative, dimmed, large }: SummaryRowProps) {
  const isNeg = negative || value < 0;
  const absVal = Math.abs(value);

  return (
    <div
      className={clsx(
        "flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-300",
        highlight
          ? "bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-500/15 dark:to-pink-500/10 border border-rose-200 dark:border-rose-500/30 shadow-sm shadow-rose-500/10"
          : "bg-black/5 dark:bg-white/3 border border-black/5 dark:border-white/5",
        large ? "py-3" : ""
      )}
    >
      <span
        className={clsx(
          "text-sm select-none transition-colors",
          highlight ? "font-bold text-[var(--color-text)]" : dimmed ? "text-gray-500" : "text-gray-700 dark:text-gray-300",
          large ? "text-base" : ""
        )}
      >
        {label}
      </span>
      <span
        className={clsx(
          "font-bold tabular-nums text-right transition-colors",
          highlight
            ? "text-rose-600 dark:text-rose-400 text-base"
            : (negative || value < 0)
            ? "text-rose-600 dark:text-rose-400 text-sm"
            : "text-gray-900 dark:text-gray-200 text-sm",
          large ? "text-lg" : ""
        )}
      >
        {value < 0 ? "-" : ""}
        {formatCurrency(absVal)}
      </span>
    </div>
  );
}
