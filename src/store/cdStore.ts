// src/store/cdStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ParsedCDData, defaultCDData } from "@/types/cd";

export type AppState = "upload" | "parsing" | "dashboard";

interface CDState {
  appState: AppState;
  parsedData: ParsedCDData;
  formValues: ParsedCDData;
  fileName: string | null;
  parseProgress: string;
  useOCR: boolean;

  setAppState: (state: AppState) => void;
  setParsedData: (data: ParsedCDData) => void;
  updateField: (field: keyof ParsedCDData, value: number) => void;
  setFileName: (name: string | null) => void;
  setParseProgress: (msg: string) => void;
  setUseOCR: (val: boolean) => void;
  reset: () => void;
}

export const useCDStore = create<CDState>()(
  persist(
    (set) => ({
      appState: "upload",
      parsedData: defaultCDData,
      formValues: defaultCDData,
      fileName: null,
      parseProgress: "",
      useOCR: false,

      setAppState: (state) => set({ appState: state }),
      setParsedData: (data) => set({ parsedData: data, formValues: data }),
      updateField: (field, value) =>
        set((s) => ({
          formValues: { ...s.formValues, [field]: value },
        })),
      setFileName: (name) => set({ fileName: name }),
      setParseProgress: (msg) => set({ parseProgress: msg }),
      setUseOCR: (val) => set({ useOCR: val }),
      reset: () =>
        set({
          appState: "upload",
          parsedData: defaultCDData,
          formValues: defaultCDData,
          fileName: null,
          parseProgress: "",
          useOCR: false,
        }),
    }),
    {
      name: "cd-dashboard-session",
      partialize: (state) => ({
        formValues: state.formValues,
        fileName: state.fileName,
        appState: state.appState === "parsing" ? "upload" : state.appState,
      }),
    }
  )
);

// ── Derived selectors ──────────────────────────────────────────────────────────

export function usePart1Calcs(v: ParsedCDData) {
  const sectionD = v.sectionA + v.sectionB + v.sectionC;
  const totalCostOfLoan = sectionD + v.sectionE;
  const benefits = totalCostOfLoan + v.lendersCredit; // lendersCredit is negative
  return { sectionD, totalCostOfLoan, benefits };
}

export function usePart2Calcs(v: ParsedCDData) {
  const excessPayoff = v.payoffAmount + v.principalReduction - v.loanAmount;
  const prepaid = v.homeownersInsurance + v.prepaidInterest;
  const escrows =
    v.g01HomeownersInsurance +
    v.g02MortgageInsurance +
    v.g03PropertyTaxes +
    v.g04CityPropertyTax +
    v.aggregateAdjustment; // aggregateAdjustment is negative
  const escrowsPrepaid = escrows + prepaid;
  const escrowsPrepaidExcess = escrowsPrepaid + excessPayoff;
  const benefits = escrowsPrepaidExcess - v.cashToClose;
  return { excessPayoff, prepaid, escrows, escrowsPrepaid, escrowsPrepaidExcess, benefits };
}
