"use client";
import CurrencyInput from "./CurrencyInput";
import SummaryRow from "./SummaryRow";
import { useCDStore, usePart2Calcs } from "@/store/cdStore";
import { FieldConfidence } from "@/types/cd";
import { BarChart3 } from "lucide-react";

export default function PartTwoPanel() {
  const { formValues, parsedData, updateField } = useCDStore();
  const calcs = usePart2Calcs(formValues);

  const conf = parsedData.confidence;
  const getConf = (key: string): FieldConfidence | undefined =>
    conf[key]?.confidence as FieldConfidence | undefined;

  return (
    <div className="rounded-2xl bg-[var(--color-card)] border border-black/5 dark:border-white/8 overflow-hidden shadow-xl shadow-black/10 dark:shadow-black/30 transition-colors duration-300">
      {/* Panel Header */}
      <div className="px-6 py-5 border-b border-black/5 dark:border-white/8 bg-gradient-to-r from-rose-50/50 to-transparent dark:from-rose-950/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 dark:border-rose-500/30 flex items-center justify-center transition-colors">
            <BarChart3 size={18} className="text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <h2 className="text-[var(--color-text)] font-bold text-base transition-colors">Part 2 — Savings Depicted by Escrows & Payoff</h2>
            <p className="text-gray-500 text-xs mt-0.5 transition-colors">Escrow & Payoff breakdown</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-1">
        {/* Group 1: Loan / Payoff */}
        <p className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold mb-3">
          Loan & Payoff
        </p>
        <CurrencyInput
          id="loanAmount"
          label="Loan Amount"
          value={formValues.loanAmount}
          onChange={(v) => updateField("loanAmount", v)}
          confidence={getConf("loanAmount")}
        />
        <CurrencyInput
          id="payoffAmount"
          label="Payoff Amount (sum)"
          value={formValues.payoffAmount}
          onChange={(v) => updateField("payoffAmount", v)}
          confidence={getConf("payoffAmount")}
        />
        <CurrencyInput
          id="principalReduction"
          label="Principal Reduction"
          value={formValues.principalReduction}
          onChange={(v) => updateField("principalReduction", v)}
          confidence={getConf("principalReduction")}
        />

        {/* Group 2: Prepaids */}
        <div className="pt-3">
          <p className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold mb-3">
            Prepaids (Section F)
          </p>
          <CurrencyInput
            id="homeownersInsurance"
            label="Homeowners Insurance"
            value={formValues.homeownersInsurance}
            onChange={(v) => updateField("homeownersInsurance", v)}
            confidence={getConf("homeownersInsurance")}
          />
          <CurrencyInput
            id="prepaidInterest"
            label="Prepaid Interest"
            value={formValues.prepaidInterest}
            onChange={(v) => updateField("prepaidInterest", v)}
            confidence={getConf("prepaidInterest")}
          />
        </div>

        {/* Group 3: Escrows / Section G */}
        <div className="pt-3">
          <p className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold mb-3">
            Initial Escrow (Section G)
          </p>
          <CurrencyInput
            id="g01HomeownersInsurance"
            label="01 — Homeowner's Insurance"
            value={formValues.g01HomeownersInsurance}
            onChange={(v) => updateField("g01HomeownersInsurance", v)}
            confidence={getConf("g01HomeownersInsurance")}
          />
          <CurrencyInput
            id="g02MortgageInsurance"
            label="02 — Mortgage Insurance"
            value={formValues.g02MortgageInsurance}
            onChange={(v) => updateField("g02MortgageInsurance", v)}
            confidence={getConf("g02MortgageInsurance")}
          />
          <CurrencyInput
            id="g03PropertyTaxes"
            label="03 — Property Taxes"
            value={formValues.g03PropertyTaxes}
            onChange={(v) => updateField("g03PropertyTaxes", v)}
            confidence={getConf("g03PropertyTaxes")}
          />
          <CurrencyInput
            id="g04CityPropertyTax"
            label="04 — City Property Tax"
            value={formValues.g04CityPropertyTax}
            onChange={(v) => updateField("g04CityPropertyTax", v)}
            confidence={getConf("g04CityPropertyTax")}
          />
          <CurrencyInput
            id="aggregateAdjustment"
            label="Aggregate Adjustment"
            value={formValues.aggregateAdjustment}
            onChange={(v) => updateField("aggregateAdjustment", v)}
            negative
            confidence={getConf("aggregateAdjustment")}
          />
        </div>

        {/* Group 4: Cash to Close */}
        <div className="pt-3">
          <p className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold mb-3">
            Closing
          </p>
          <CurrencyInput
            id="cashToClose"
            label="Cash to Close"
            value={formValues.cashToClose}
            onChange={(v) => updateField("cashToClose", v)}
            confidence={getConf("cashToClose")}
          />
        </div>

        {/* Calculations */}
        <div className="pt-4 pb-2">
          <p className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold mb-3">
            Calculations (Auto-Computed)
          </p>
          <div className="space-y-2">
            <SummaryRow
              label="Excess Payoff (Payoff + Reduction − Loan)"
              value={calcs.excessPayoff}
            />
            <SummaryRow
              label="Prepaid (Insurance + Interest)"
              value={calcs.prepaid}
            />
            <SummaryRow
              label="Escrows (G01–G04 + Adjustment)"
              value={calcs.escrows}
            />
            <SummaryRow
              label="Escrows + Prepaid"
              value={calcs.escrowsPrepaid}
            />
            <SummaryRow
              label="Escrows + Prepaid + Excess Payoff"
              value={calcs.escrowsPrepaidExcess}
            />
            <SummaryRow
              label="✦ Benefits (Final − Cash to Close)"
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
