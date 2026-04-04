import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfjs-dist and tesseract.js are loaded dynamically client-side only.
  // No special webpack/turbopack aliases needed.
};

export default nextConfig;
