"use client";
import { FileText } from "lucide-react";

interface LoadingOverlayProps {
  message: string;
}

export default function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0F19]/90 backdrop-blur-md">
      {/* Animated rings */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-indigo-400/40 animate-ping [animation-delay:0.3s]" />
        <div className="absolute inset-4 rounded-full border-2 border-indigo-300/50 animate-ping [animation-delay:0.6s]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
            <FileText size={24} className="text-indigo-400 animate-pulse" />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mb-2">Analyzing Document</h2>
      <p className="text-sm text-gray-400 max-w-xs text-center animate-pulse">{message}</p>

      {/* Progress bar */}
      <div className="mt-6 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="loading-bar" />
      </div>
    </div>
  );
}
