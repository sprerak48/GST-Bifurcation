import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { processCSV } from './services/csvParser.js';
import { processOrders } from './services/taxCalculator.js';
import { aggregateByStateCombination, aggregateByState } from './services/aggregator.js';
import {
  exportDetailedXlsx,
  exportDetailedCsv,
  exportSummaryXlsx,
  exportSummaryCsv,
  exportStateCombinationXlsx,
  exportStateCombinationCsv,
} from './services/exporter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  },
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await processCSV(req.file.buffer);
    const { processedRows, errors, skippedCount } = result;

    const processed = processOrders(processedRows);
    const stateCombinationSummary = aggregateByStateCombination(processed);
    const stateComplianceSummary = aggregateByState(processed);

    res.json({
      processedRows: processed,
      stateCombinationSummary,
      stateComplianceSummary,
      stats: {
        totalProcessed: processed.length,
        totalErrors: errors.length,
        skippedCount,
        errors: errors.slice(0, 50),
      },
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({
      error: err.message || 'Failed to process CSV',
    });
  }
});

app.post('/api/export/detailed', express.json(), (req, res) => {
  try {
    const { format, data } = req.body;
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    if (format === 'xlsx') {
      const buffer = exportDetailedXlsx(data);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=gst-detailed-report.xlsx');
      res.send(buffer);
    } else {
      const csv = exportDetailedCsv(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=gst-detailed-report.csv');
      res.send(csv);
    }
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: err.message || 'Export failed' });
  }
});

app.post('/api/export/summary', express.json(), (req, res) => {
  try {
    const { format, data } = req.body;
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    if (format === 'xlsx') {
      const buffer = exportSummaryXlsx(data);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=gst-state-summary.xlsx');
      res.send(buffer);
    } else {
      const csv = exportSummaryCsv(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=gst-state-summary.csv');
      res.send(csv);
    }
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: err.message || 'Export failed' });
  }
});

app.post('/api/export/state-pairs', express.json(), (req, res) => {
  try {
    const { format, data } = req.body;
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    if (format === 'xlsx') {
      const buffer = exportStateCombinationXlsx(data);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=gst-state-pairs-summary.xlsx');
      res.send(buffer);
    } else {
      const csv = exportStateCombinationCsv(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=gst-state-pairs-summary.csv');
      res.send(csv);
    }
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: err.message || 'Export failed' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`GST Bifurcation API running at http://localhost:${PORT}`);
});
