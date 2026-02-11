import type { UploadResponse } from './types';

const API_BASE = '/api';

export async function uploadCSV(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Upload failed');
  }

  return res.json();
}

async function handleExportResponse(res: Response): Promise<Blob> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Export failed');
  }
  return res.blob();
}

export async function exportDetailed(format: 'xlsx' | 'csv', data: unknown[]): Promise<Blob> {
  const res = await fetch(`${API_BASE}/export/detailed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format, data }),
  });
  return handleExportResponse(res);
}

export async function exportSummary(format: 'xlsx' | 'csv', data: unknown[]): Promise<Blob> {
  const res = await fetch(`${API_BASE}/export/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format, data }),
  });
  return handleExportResponse(res);
}

export async function exportStatePairs(format: 'xlsx' | 'csv', data: unknown[]): Promise<Blob> {
  const res = await fetch(`${API_BASE}/export/state-pairs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format, data }),
  });
  return handleExportResponse(res);
}
