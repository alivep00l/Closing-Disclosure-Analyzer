"use client";
import { useCallback, useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useCDStore } from "@/store/cdStore";
import { parseClosingDisclosure } from "@/lib/parserService";
import clsx from "clsx";

export default function UploadZone() {
  const { setAppState, setParsedData, setFileName, setParseProgress } = useCDStore();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".pdf")) {
        setError("Please upload a valid .pdf file.");
        return;
      }
      setError(null);
      setSelectedFile(file);
      setFileName(file.name);
      setAppState("parsing");

      const data = await parseClosingDisclosure(file, (msg) => setParseProgress(msg));
      setParsedData(data);
      setAppState("dashboard");
    },
    [setAppState, setFileName, setParsedData, setParseProgress]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] px-4 transition-colors duration-300">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-rose-200/40 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="mb-10 text-center z-10">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white shadow-sm border border-rose-100 text-rose-600 text-xs font-semibold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          Closing Disclosure Analyzer
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
          CD Benefit{" "}
          <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            Summary
          </span>
        </h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto font-medium">
          Upload your Closing Disclosure PDF to automatically extract financial data and calculate your loan benefits instantly.
        </p>
      </div>

      {/* Drop Zone */}
      <label
        htmlFor="pdf-upload"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={clsx(
          "relative w-full max-w-2xl h-80 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group bg-white shadow-xl shadow-rose-100/50 z-10",
          dragging
            ? "border-rose-400 bg-rose-50/50 scale-[1.02] shadow-2xl shadow-rose-200"
            : selectedFile
            ? "border-emerald-400 bg-emerald-50"
            : "border-gray-200 hover:border-rose-300 hover:bg-gray-50"
        )}
      >
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={onInputChange}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-4 z-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-100">
              <CheckCircle size={32} className="text-emerald-500" />
            </div>
            <div className="text-center">
              <p className="text-gray-900 text-lg font-bold">{selectedFile.name}</p>
              <p className="text-gray-500 text-sm mt-1 font-medium">
                {(selectedFile.size / 1024).toFixed(1)} KB · Ready to process
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 z-10">
            <div className={clsx(
              "w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-sm",
              dragging
                ? "bg-rose-100 border border-rose-200 scale-110 shadow-rose-200"
                : "bg-gray-50 border border-gray-100 group-hover:bg-rose-50 group-hover:border-rose-200 group-hover:scale-105 group-hover:shadow-rose-100"
            )}>
              <Upload size={40} className={clsx("transition-colors duration-500", dragging ? "text-rose-500" : "text-gray-400 group-hover:text-rose-500")} />
            </div>
            <div className="text-center">
              <p className="text-gray-800 font-bold text-xl mb-1">
                {dragging ? "Release to upload" : "Drag & drop your PDF here"}
              </p>
              <p className="text-gray-500 font-medium">or click to browse from your computer</p>
            </div>
            <div className="mt-2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-500 font-semibold">
              <FileText size={14} />
              Accepts .pdf files only
            </div>
          </div>
        )}
      </label>

      {error && (
        <div className="mt-6 flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm max-w-2xl w-full shadow-sm z-10 font-medium">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Feature pills */}
      <div className="mt-12 flex flex-wrap justify-center gap-3 z-10 max-w-3xl">
        {[
          { label: "PDF Text Extraction", icon: "📄" },
          { label: "OCR Fallback", icon: "🔍" },
          { label: "Real-time Calculations", icon: "⚡" },
          { label: "Session Persistence", icon: "💾" },
        ].map((feat) => (
          <div
            key={feat.label}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-sm text-gray-600 font-semibold hover:border-rose-200 hover:text-rose-600 transition-colors"
          >
            <span>{feat.icon}</span>
            {feat.label}
          </div>
        ))}
      </div>
    </div>
  );
}
