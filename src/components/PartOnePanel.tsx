"use client";
import CurrencyInput from "./CurrencyInput";
import SummaryRow from "./SummaryRow";
import { useCDStore, usePart1Calcs } from "@/store/cdStore";
import { FieldConfidence } from "@/types/cd";
import { DollarSign } from "lucide-react";

export default function PartOnePanel() {
  const { formValues, parsedData, updateField } = useCDStore();
  const calcs = usePart1Calcs(formValues);

  const conf = parsedData.confidence;
  const getConf = (key: string): FieldConfidence | undefined =>
    conf[key]?.confidence as FieldConfidence | undefined;

  return (
    <div className="rounded-2xl bg-[var(--color-card)] border border-black/5 dark:border-white/8 overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30 transition-colors duration-300">
      {/* Panel Header */}
      <div className="px-6 py-5 border-b border-black/5 dark:border-white/8 bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-950/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center transition-colors">
            <DollarSign size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-[var(--color-text)] font-bold text-base transition-colors">Part 1 — Savings Depicted by Cost</h2>
            <p className="text-gray-500 text-xs mt-0.5 transition-colors">How Benefits are received</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-1">
        {/* Editable Inputs */}
        <p className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold mb-3">
          Loan Cost Inputs
        </p>

        <CurrencyInput
          id="sectionA"
          label="Section A — Origination Charges"
          value={formValues.sectionA}
          onChange={(v) => updateField("sectionA", v)}
          confidence={getConf("sectionA")}
        />
        <CurrencyInput
          id="sectionB"
          label="Section B — Services (Did Not Shop)"
          value={formValues.sectionB}
          onChange={(v) => updateField("sectionB", v)}
          confidence={getConf("sectionB")}
        />
        <CurrencyInput
          id="sectionC"
          label="Section C — Services (Did Shop)"
          value={formValues.sectionC}
          onChange={(v) => updateField("sectionC", v)}
          confidence={getConf("sectionC")}
        />
        <CurrencyInput
          id="sectionE"
          label="Section E — Taxes & Gov. Fees"
          value={formValues.sectionE}
          onChange={(v) => updateField("sectionE", v)}
          confidence={getConf("sectionE")}
        />
        <CurrencyInput
          id="lendersCredit"
          label="Lender's Credit (Section J)"
          value={formValues.lendersCredit}
          onChange={(v) => updateField("lendersCredit", v)}
          negative
          confidence={getConf("lendersCredit")}
        />

        {/* Divider */}
        <div className="pt-4 pb-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold mb-3">
            Calculations (Auto-Computed)
          </p>
          <div className="space-y-2">
            <SummaryRow
              label="Section D (A + B + C)"
              value={calcs.sectionD}
            />
            <SummaryRow
              label="Total Cost of Loan (D + E)"
              value={calcs.totalCostOfLoan}
            />
            <SummaryRow
              label="✦ Benefits (Total Cost + Lender's Credit)"
              value={calcs.benefits}
              highlight
              large
            />
          </div>
        </div>
      </div>
    </div>
  );
}
