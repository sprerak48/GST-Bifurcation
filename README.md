# GST Bifurcation — Amazon Multi-State Orders

Production-ready web application for **Automated GST Bifurcation** for multi-state Amazon B2C orders. Accepts Amazon "All Order Sales Report" CSV uploads, determines CGST+SGST vs IGST per order line, splits Total Tax Amount correctly, and generates state-wise and tax-type summaries.

## Features

- **CSV Upload** — Drag & drop or click to upload Amazon B2C report CSV
- **Automatic Tax Classification** — Intra-state (CGST+SGST) vs Inter-state (IGST)
- **GST Bifurcation Logic** — 50/50 split for CGST/SGST, full amount for IGST
- **State Normalization** — Handles variations (MH, Maharashtra, etc.)
- **Summary Tables** — Origin/Destination pairs, Compliance by state
- **Export** — Detailed line-item and state-wise summary in XLSX or CSV
- **Large Files** — Streaming parser supports 10k–100k+ rows

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express
- **CSV:** csv-parse (streaming)
- **Export:** xlsx (SheetJS)

## Quick Start

### Prerequisites

- Node.js 18+

### Run Locally

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Run both backend and frontend (recommended)
npm run dev
```

- **API:** http://localhost:3001
- **App:** http://localhost:5173

Or run separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Build for Production

```bash
npm run build
npm start
```

Serve the built `client/dist` folder with a static host (e.g. nginx) or use the Express server to serve it.

## Input Data

Use **Amazon B2C Report** CSV with columns:

| Required Column   | Description           |
|-------------------|-----------------------|
| Ship From State   | Origin (warehouse)    |
| Ship To State     | Destination (buyer)   |
| Tax Exclusive Gross | Taxable amount     |
| Total Tax Amount  | Total GST             |

Other columns (Order Id, SKU, etc.) are optional but used when present.

## GST Logic

**Tax Type:**

- **Intra-State:** Origin State == Destination State → CGST + SGST
- **Inter-State:** Origin ≠ Destination → IGST

**Bifurcation:**

| Case          | CGST         | SGST         | IGST           |
|---------------|--------------|--------------|----------------|
| Intra-State   | Total Tax / 2| Total Tax / 2| 0              |
| Inter-State   | 0            | 0            | Total Tax      |

All amounts rounded to 2 decimal places.

## Outputs

1. **Detailed Orders** — Line-level report with bifurcated CGST/SGST/IGST
2. **GST Summary (State Pairs)** — Aggregated by Origin, Destination, Tax Type
3. **Compliance Summary** — Per-state: Total CGST, SGST, IGST, Taxable Value, GST Liability

## Sample Run

1. Upload `AMAZON B2C REPORT.csv` from the project root
2. View processed rows, errors, and skipped count
3. Switch tabs: Detailed Orders | GST Summary | Compliance Summary
4. Filter/sort by state, tax type, SKU
5. Export as XLSX or CSV

## Project Structure

```
GST-AI/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── App.tsx
│   └── ...
├── server/
│   ├── services/
│   │   ├── csvParser.js
│   │   ├── taxCalculator.js
│   │   ├── aggregator.js
│   │   ├── exporter.js
│   │   └── stateNormalizer.js
│   └── index.js
├── AMAZON B2C REPORT.csv
└── README.md
```

## Extensibility

- **Amazon API:** Add a service to fetch reports via Amazon SP-API
- **GSTR-1 Mapping:** Extend aggregator for GSTR-1 B2C table format
- **Tally Integration:** Add Tally-compatible export schema

## License

MIT
