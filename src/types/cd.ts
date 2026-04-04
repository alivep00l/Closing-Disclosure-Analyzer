// src/types/cd.ts
import { z } from "zod";

export enum FieldConfidence {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
  MISSING = "missing",
}

export interface FieldMeta {
  confidence: FieldConfidence;
  rawExtracted?: string;
  source?: string;
}

export interface ParsedCDData {
  // Part 1 — Cost Savings
  sectionA: number;
  sectionB: number;
  sectionC: number;
  sectionE: number;
  lendersCredit: number;

  // Part 2 — Escrows & Payoff
  loanAmount: number;
  payoffAmount: number;
  principalReduction: number;
  homeownersInsurance: number;
  prepaidInterest: number;
  g01HomeownersInsurance: number;
  g02MortgageInsurance: number;
  g03PropertyTaxes: number;
  g04CityPropertyTax: number;
  aggregateAdjustment: number;
  cashToClose: number;

  // Field confidence map
  confidence: Record<string, FieldMeta>;
}

export const CDFormSchema = z.object({
  sectionA: z.number().min(0),
  sectionB: z.number().min(0),
  sectionC: z.number().min(0),
  sectionE: z.number().min(0),
  lendersCredit: z.number(),
  loanAmount: z.number().min(0),
  payoffAmount: z.number().min(0),
  principalReduction: z.number().min(0),
  homeownersInsurance: z.number().min(0),
  prepaidInterest: z.number().min(0),
  g01HomeownersInsurance: z.number().min(0),
  g02MortgageInsurance: z.number().min(0),
  g03PropertyTaxes: z.number().min(0),
  g04CityPropertyTax: z.number().min(0),
  aggregateAdjustment: z.number(),
  cashToClose: z.number(),
});

export type CDFormValues = z.infer<typeof CDFormSchema>;

export const defaultCDData: ParsedCDData = {
  sectionA: 0,
  sectionB: 0,
  sectionC: 0,
  sectionE: 0,
  lendersCredit: 0,
  loanAmount: 0,
  payoffAmount: 0,
  principalReduction: 0,
  homeownersInsurance: 0,
  prepaidInterest: 0,
  g01HomeownersInsurance: 0,
  g02MortgageInsurance: 0,
  g03PropertyTaxes: 0,
  g04CityPropertyTax: 0,
  aggregateAdjustment: 0,
  cashToClose: 0,
  confidence: {},
};
