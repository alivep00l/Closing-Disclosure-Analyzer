# Closing Disclosure (CD) Dashboard

A production-grade financial tool designed to parse, analyze, and visualize Closing Disclosure documents. This application provides real-time insights into loan costs, lender credits, and total benefits with a high-contrast, professional interface.

## 🚀 Live Demo

Check out the deployed project here:  
👉 [https://your-deployment-link.com](https://closing-disclosure-analyzer.vercel.app/)

## 🚀 Key Features

- **Automated PDF Parsing**: Generalized extraction engine capable of handling diverse lender layouts.
- **Context-Bounded Extraction**: Precise scanning of Section J (Lender Credits) and Section G (Adjustments) without data "bleeding" between sections.
- **Natural Sign Handling**: Respects numerical signs exactly as they appear in documents, identifying savings and adjustments automatically.
- **Flexible Data Entry**: Supports manual sign toggling and decimal entry with real-time UI updates.
- **Premium UI/UX**: High-contrast light mode with vibrant financial highlighting and micro-animations.

## 📊 Financial Logic: Negative Values & Benefits

The application handles "benefits" (Lender Credits and Aggregate Adjustments) using a natural numeric system:

- **Parsing**: The extraction engine identifies signs from PDF text (e.g., `-$500` or `($500)`). These are stored as natural negative floats.
- **UI Display**: 
    - Benefit-related fields are hardcoded to display in **Red** (`text-rose-600`) for easy identification in the summary.
    - Mathematical signs are preserved: Positive values show as `$X.XX`, and negative values show as `-$X.XX`.
- **Calculations**: The "Total Benefits" card in the header automatically aggregates these values (Total Loan Costs + Lender Credits + Adjustments) to provide a final savings/cost posture.

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **PDF Processing**: `pdfjs-dist` (Client-side)
- **OCR Fallback**: `tesseract.js`
- **Validation**: Zod

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Create a production build:
```bash
npm run build
```

