import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Build a condensed context string from GST data for the AI
 */
function buildContext(data) {
  if (!data) return 'No data loaded. Please upload an Amazon B2C CSV report first.';

  const parts = [];

  if (data.stats) {
    parts.push(`## Summary\n- Total rows processed: ${data.stats.totalProcessed}`);
    if (data.stats.skippedCount) parts.push(`- Skipped: ${data.stats.skippedCount}`);
    if (data.stats.totalErrors) parts.push(`- Errors: ${data.stats.totalErrors}`);
  }

  if (data.stateComplianceSummary?.length) {
    parts.push('\n## State-wise GST Compliance\n');
    data.stateComplianceSummary.forEach((s) => {
      const cgst = (s.totalCgst ?? 0).toFixed(2);
      const sgst = (s.totalSgst ?? 0).toFixed(2);
      const igst = (s.totalIgst ?? 0).toFixed(2);
      const taxable = (s.totalTaxableValue ?? 0).toFixed(2);
      const total = (s.totalGstLiability ?? 0).toFixed(2);
      parts.push(`- ${s.state}: CGST ${cgst}, SGST ${sgst}, IGST ${igst}, Taxable ${taxable}, Total GST ${total}`);
    });
  }

  if (data.stateCombinationSummary?.length) {
    parts.push('\n## State Pairs (Origin → Destination)');
    const sample = data.stateCombinationSummary.slice(0, 30);
    sample.forEach((s) => {
      const taxable = (s.taxableAmount ?? 0).toFixed(2);
      const gst = (s.totalGst ?? 0).toFixed(2);
      parts.push(`- ${s.originState} → ${s.destinationState}: ${s.taxType}, Taxable ${taxable}, GST ${gst}`);
    });
    if (data.stateCombinationSummary.length > 30) {
      parts.push(`... and ${data.stateCombinationSummary.length - 30} more pairs`);
    }
  }

  if (data.processedRows?.length) {
    const taxTypes = {};
    data.processedRows.forEach((r) => {
      taxTypes[r.taxType] = (taxTypes[r.taxType] || 0) + 1;
    });
    parts.push('\n## Tax Type Distribution');
    Object.entries(taxTypes).forEach(([type, count]) => {
      parts.push(`- ${type}: ${count} orders`);
    });
  }

  return parts.join('\n');
}

const SYSTEM_PROMPT = `You are an expert GST compliance assistant for Indian e-commerce sellers. You help answer questions about Amazon B2C order data, GST bifurcation (CGST, SGST, IGST), state-wise compliance, and tax summaries.

Use ONLY the provided data context to answer. If the question requires data that isn't in the context, say so clearly. Be concise and accurate. Use ₹ for amounts when relevant.`;

/**
 * Ask the AI a question about the GST data
 */
export async function askQuestion(question, dataContext) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Add it to .env file.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const context = buildContext(dataContext);

  const prompt = `${SYSTEM_PROMPT}

## Data Context
${context}

## User Question
${question}

## Your Answer
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error('No response from AI');
  }

  return text.trim();
}
