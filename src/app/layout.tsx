import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CD Benefit Summary | Closing Disclosure Analyzer",
  description:
    "Upload your Closing Disclosure PDF to automatically extract financial data and calculate your total loan benefits and savings.",
  keywords: ["closing disclosure", "mortgage", "loan benefits", "CD analyzer", "refinance savings"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-inter antialiased bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}
