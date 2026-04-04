// src/lib/parserService.ts
"use client";

import { ParsedCDData, FieldConfidence, defaultCDData } from "@/types/cd";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseAmount(raw: string): number {
  if (!raw) return 0;
  // Convert "(1,000.00)" to "-1,000.00" and remove characters
  const cleaned = raw.replace(/[$,\s]/g, "").replace(/^\((.*)\)$/, "-$1").replace(/\(/g, "-");
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

function extractCurrencies(searchRange: string): { raw: string, value: number }[] {
  // Matches: 1) $X,XXX.XX -> 2) X,XXX.XX -> 3) X.XX
  // Supports leading '-' and parentheses '(' as delimiters
  const regex = /(?:(?:^|\s|[-|\(])\$\s*)(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)|(?:^|\s|[-|\(])(\d{1,3}(?:,\d{3})+(?:\.\d{2})?)|(?:^|\s|[-|\(|\b])(\d+\.\d{2})(?!\d)/g;
  const matches = [...searchRange.matchAll(regex)];
  return matches.map(m => {
    const raw = m[0].trim();
    const valstr = m[1] || m[2] || m[3];
    return { raw, value: parseAmount(raw) };
  });
}

function getSearchRange(lines: string[], startIndex: number, maxLines: number): string {
  let range = lines[startIndex];
  const stopPattern = /^\s*(?:[A-Z]\.|[0-9]{2}\s|Section|Total|Closing|Calculat|Page\s*\d|Cash|Lender|Payoff|Principal)/i;
  
  for (let i = 1; i < maxLines; i++) {
    const nextIdx = startIndex + i;
    if (nextIdx >= lines.length) break;
    const nextLine = lines[nextIdx];
    // If the next line strongly indicates a new item/section, stop block expansion
    if (stopPattern.test(nextLine)) break;
    range += " " + nextLine;
  }
  return range;
}

function findAmount(text: string, patterns: string[], searchLines: number = 2): { value: number; raw: string; confidence: FieldConfidence } {
  const lines = text.split("\n");
  for (const pattern of patterns) {
    const re = new RegExp(pattern, "i");
    for (let i = 0; i < lines.length; i++) {
        if (re.test(lines[i])) {
            const searchRange = getSearchRange(lines, i, searchLines);
            const matches = extractCurrencies(searchRange);
            if (matches.length > 0) {
               const lastMatch = matches[matches.length - 1];
               return { value: lastMatch.value, raw: lastMatch.raw, confidence: FieldConfidence.HIGH };
            }
        }
    }
  }
  return { value: 0, raw: "", confidence: FieldConfidence.MISSING };
}

function sumAmountsByPattern(text: string, pattern: string, searchLines: number = 2): { value: number; raw: string; confidence: FieldConfidence } {
  const lines = text.split("\n");
  const re = new RegExp(pattern, "i");
  let total = 0;
  let rawStr = "";
  let hits = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (re.test(lines[i])) {
       const searchRange = getSearchRange(lines, i, searchLines);
       const matches = extractCurrencies(searchRange);
       
       if (matches.length > 0) {
           const lastMatch = matches[matches.length - 1];
           total += lastMatch.value;
           rawStr += (rawStr ? " + " : "") + lastMatch.raw;
           hits++;
       }
    }
  }
  
  return { 
    value: total, 
    raw: rawStr, 
    confidence: hits > 0 ? FieldConfidence.MEDIUM : FieldConfidence.MISSING 
  };
}

// ─── PDF Text Extraction ──────────────────────────────────────────────────────

async function extractPDFText(file: File, onProgress: (msg: string) => void): Promise<string> {
  onProgress("Loading PDF engine…");
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  onProgress("Loading document pages…");
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(`Extracting page ${i} of ${pdf.numPages}…`);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: unknown) => {
        const i = item as { str?: string; hasEOL?: boolean };
        return (i.str ?? "") + (i.hasEOL ? "\n" : " ");
      })
      .join("");
    fullText += `\n--- PAGE ${i} ---\n${pageText}`;
  }
  return fullText;
}

// ─── OCR Fallback ─────────────────────────────────────────────────────────────

async function extractOCRText(file: File, onProgress: (msg: string) => void): Promise<string> {
  onProgress("Starting OCR engine (fallback)…");
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  onProgress("OCR: processing document…");
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "image/png" });
  const { data } = await worker.recognize(blob);
  await worker.terminate();
  return data.text;
}

// ─── Keyword Mapping ──────────────────────────────────────────────────────────

function mapFields(text: string): ParsedCDData {
  const confidence: ParsedCDData["confidence"] = {};

  // Section A — Origination Charges
  const secA = findAmount(text, [
    "A\\.\\s*Origination Charges",
    "Section A",
    "Origination Charges",
  ], 3);
  confidence["sectionA"] = { confidence: secA.confidence, rawExtracted: secA.raw, source: "Loan Costs" };

  // Section B — Services Borrower Did Not Shop For
  const secB = findAmount(text, [
    "B\\.\\s*Services Borrower Did Not Shop",
    "Section B",
    "Did Not Shop",
    "Borrower Did Not Shop",
  ], 3);
  confidence["sectionB"] = { confidence: secB.confidence, rawExtracted: secB.raw, source: "Loan Costs" };

  // Section C — Services Borrower Did Shop For
  const secC = findAmount(text, [
    "C\\.\\s*Services Borrower Did Shop",
    "Section C",
    "Did Shop For",
    "Borrower Did Shop",
  ], 3);
  confidence["sectionC"] = { confidence: secC.confidence, rawExtracted: secC.raw, source: "Loan Costs" };

  // Section E — Taxes and Other Government Fees
  const secE = findAmount(text, [
    "E\\.\\s*Taxes and Other",
    "Section E",
    "Other Government Fees",
    "Taxes and Other Government",
  ], 3);
  confidence["sectionE"] = { confidence: secE.confidence, rawExtracted: secE.raw, source: "Other Costs" };

  // Lender's Credit (Section J negative)
  const lc = findAmount(text, [
    "^\\s*(?:\\d{2}\\s*)?Lender Credits",
    "Section J.*?Lender Credits",
    "Lender Credit",
    "J. TOTAL CLOSING COSTS"
  ], 3);
  // Always stored as negative
  const lendersCredit = lc.value;
  confidence["lendersCredit"] = { confidence: lc.confidence, rawExtracted: lc.raw, source: "Section J" };

  // Loan Amount — Page 1
  const la = findAmount(text, [
    "Loan Amount",
    "Principal Amount",
    "Amount of Loan",
  ]);
  confidence["loanAmount"] = { confidence: la.confidence, rawExtracted: la.raw, source: "Page 1" };

  // Payoff — sum all "Payoff to…" lines from Page 3
  const payoff = sumAmountsByPattern(text, "Payoff\\s+(?:to|of|Account)", 2);
  confidence["payoffAmount"] = { confidence: payoff.confidence, source: "Page 3 Payoffs" };

  // Principal Reduction
  const pr = findAmount(text, [
    "Principal Reduction",
    "Principal Balance",
    "Reduction to Principal",
  ], 2);
  confidence["principalReduction"] = { confidence: pr.confidence, rawExtracted: pr.raw };

  // Homeowners Insurance (Prepaid F)
  const hi = findAmount(text, [
    "Homeowner(?:'s|s)?\\s+Insurance\\s+(?:Premium|mo\\.)",
    "Hazard\\s+Insurance",
  ], 3);
  confidence["homeownersInsurance"] = { confidence: hi.confidence, rawExtracted: hi.raw, source: "Section F" };

  // Prepaid Interest
  const pi = findAmount(text, [
    "Prepaid Interest",
    "Per Diem Interest",
    "Interim Interest",
  ]);
  confidence["prepaidInterest"] = { confidence: pi.confidence, rawExtracted: pi.raw, source: "Section F" };

  // G01 – Homeowner's Insurance (escrow)
  const g01 = findAmount(text, [
    "Homeowner(?:'s|s)?\\s+Insurance.*?(?:per month|mo\\.)",
    "G\\..*?Homeowner",
    "Initial Escrow.*?Homeowner",
    "Homeowner.*?Escrow",
  ], 3);
  confidence["g01HomeownersInsurance"] = { confidence: g01.confidence, rawExtracted: g01.raw, source: "Section G" };

  // G02 – Mortgage Insurance
  const g02 = findAmount(text, [
    "02.*?Mortgage Insurance",
    "03.*?Mortgage Insurance",
    "Mortgage Insurance.*?per month",
    "PMI",
    "MIP",
  ], 3);
  confidence["g02MortgageInsurance"] = { confidence: g02.confidence, rawExtracted: g02.raw, source: "Section G" };

  // G03 – Property Taxes
  const g03 = findAmount(text, [
    "03.*?Property Taxes",
    "04.*?Property Taxes",
    "Property Taxes.*?per month",
    "Property Taxes.*?Escrow",
    "County.*?Tax.*?Escrow",
  ], 3);
  confidence["g03PropertyTaxes"] = { confidence: g03.confidence, rawExtracted: g03.raw, source: "Section G" };

  // G04 – City Property Tax
  const g04 = findAmount(text, [
    "04.*?City.*?Tax",
    "G\\..*?City.*?Tax",
    "City.*?Property.*?Tax",
    "Municipal.*?Tax.*?Escrow",
  ]);
  confidence["g04CityPropertyTax"] = { confidence: g04.confidence, rawExtracted: g04.raw, source: "Section G" };

  // Aggregate Adjustment (always negative)
  const agg = findAmount(text, [
    "Aggregate Adjustment",
    "Aggregate Escrow",
  ], 3);
  const aggregateAdjustment = agg.value;
  confidence["aggregateAdjustment"] = { confidence: agg.confidence, rawExtracted: agg.raw, source: "Section G" };

  // Cash to Close
  const ctc = findAmount(text, [
    "Cash to Close",
    "Cash Due at Closing",
    "Cash Due from Borrower",
    "Cash\\s+to\\s+Close",
  ], 3);
  confidence["cashToClose"] = { confidence: ctc.confidence, rawExtracted: ctc.raw, source: "Page 1" };

  return {
    sectionA: secA.value,
    sectionB: secB.value,
    sectionC: secC.value,
    sectionE: secE.value,
    lendersCredit,
    loanAmount: la.value,
    payoffAmount: payoff.value,
    principalReduction: pr.value,
    homeownersInsurance: hi.value,
    prepaidInterest: pi.value,
    g01HomeownersInsurance: g01.value,
    g02MortgageInsurance: g02.value,
    g03PropertyTaxes: g03.value,
    g04CityPropertyTax: g04.value,
    aggregateAdjustment,
    cashToClose: ctc.value,
    confidence,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function parseClosingDisclosure(
  file: File,
  onProgress: (msg: string) => void
): Promise<ParsedCDData> {
  try {
    let text = await extractPDFText(file, onProgress);

    // Detect empty / scanned PDF
    const wordCount = text.replace(/\s+/g, " ").trim().split(" ").length;
    if (wordCount < 50) {
      onProgress("Text layer sparse — activating OCR…");
      text = await extractOCRText(file, onProgress);
    }

    onProgress("Mapping fields to form…");
    const data = mapFields(text);
    onProgress("Done!");
    return data;
  } catch {
    onProgress("Error during parsing — returning defaults…");
    return { ...defaultCDData };
  }
}
