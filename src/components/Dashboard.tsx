"use client";
import PartOnePanel from "./PartOnePanel";
import PartTwoPanel from "./PartTwoPanel";
import { useCDStore, usePart1Calcs, usePart2Calcs } from "@/store/cdStore";
import { formatCurrency } from "@/lib/format";
import { FileText, RefreshCw, TrendingUp } from "lucide-react";
import { useRef } from "react";

export default function Dashboard() {
  const { fileName, formValues, reset } = useCDStore();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const p1 = usePart1Calcs(formValues);
  const p2 = usePart2Calcs(formValues);
  const totalBenefits = p1.benefits + p2.benefits;



  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-300">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/8 bg-[var(--color-bg)]/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 dark:border-rose-500/30 flex items-center justify-center shrink-0 transition-colors">
              <FileText size={15} className="text-rose-500 dark:text-rose-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[var(--color-text)] font-bold text-sm leading-none transition-colors">CD Benefit Summary</h1>
              {fileName && (
                <p className="text-gray-500 text-xs mt-0.5 truncate max-w-[200px] sm:max-w-xs transition-colors">
                  {fileName}
                </p>
              )}
            </div>
          </div>

          {/* Total Benefits Banner */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 transition-colors">
            <TrendingUp size={16} className="text-rose-500 dark:text-rose-400 shrink-0" />
            <div>
              <p className="text-rose-500/80 dark:text-rose-400/70 text-[10px] uppercase tracking-widest font-semibold transition-colors">Total Benefits</p>
              <p className="text-rose-500 dark:text-rose-400 font-bold text-base leading-none transition-colors">
                {formatCurrency(totalBenefits)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-gray-300 transition-all duration-200 group"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              New Upload
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main ref={dashboardRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Mobile total benefits banner */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 transition-colors">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-rose-600 dark:text-rose-400" />
            <span className="text-rose-600/80 dark:text-rose-400/70 text-xs font-semibold uppercase tracking-widest">Total Benefits</span>
          </div>
          <span className="text-rose-600 dark:text-rose-400 font-bold text-lg">{formatCurrency(totalBenefits)}</span>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PartOnePanel />
          <PartTwoPanel />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-xs transition-colors">
          Data auto-extracted from Closing Disclosure · All values editable · Calculations update in real-time
        </div>
      </main>
    </div>
  );
}
