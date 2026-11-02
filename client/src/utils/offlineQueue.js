import { api } from '../services/api';
import { dataUrlToFile, fileToDataUrl } from './media';

// Reports made while offline are kept in IndexedDB and sent when the connection returns.
const DB = 'nagrivanta';
const STORE = 'outbox';

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const out = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(out?.result ?? out);
    t.onerror = () => reject(t.error);
  });
}

export async function queueReport(fields, files, idempotencyKey = crypto.randomUUID()) {
  const media = await Promise.all(files.map(async (f) => ({ field: f.field, name: f.file.name, data: await fileToDataUrl(f.file) })));
  await tx('readwrite', (s) => s.add({ fields, media, idempotencyKey, queuedAt: Date.now() }));
  window.dispatchEvent(new Event('outbox:changed'));
}

export const queuedCount = () => tx('readonly', (s) => s.count()).catch(() => 0);
export const listQueued = () => tx('readonly', (s) => s.getAll()).catch(() => []);

export async function removeQueued(id) {
  await tx('readwrite', (s) => s.delete(id));
  window.dispatchEvent(new Event('outbox:changed'));
}

export async function retryQueued(id) {
  const items = await listQueued();
  const item = items.find((entry) => entry.id === id);
  if (item) await tx('readwrite', (s) => s.put({ ...item, failed: false, lastError: undefined, failedAt: undefined }));
  return flushQueue();
}

let syncing = false;
export async function flushQueue() {
  if (syncing || !navigator.onLine) return 0;
  syncing = true;
  let sent = 0;
  try {
    const items = await tx('readonly', (s) => s.getAll());
    for (const item of items || []) {
      if (item.failed) continue;
      if (!item.idempotencyKey) {
        item.idempotencyKey = crypto.randomUUID();
        await tx('readwrite', (s) => s.put(item));
      }
      const fd = new FormData();
      Object.entries(item.fields).forEach(([k, v]) => v !== '' && v != null && fd.append(k, v));
      for (const m of item.media) fd.append(m.field, await dataUrlToFile(m.data, m.name));
      try {
        await api('/complaints', { method: 'POST', body: fd, headers: { 'Idempotency-Key': item.idempotencyKey } });
        await tx('readwrite', (s) => s.delete(item.id));
        sent += 1;
      } catch (err) {
        if (err.status === 0 || err.status === 401 || err.status === 429 || err.status >= 500) break;
        // Keep rejected submissions for the citizen to review; never erase a report silently.
        await tx('readwrite', (s) => s.put({ ...item, failed: true, lastError: err.message, failedAt: Date.now() }));
      }
    }
  } finally {
    syncing = false;
    window.dispatchEvent(new Event('outbox:changed'));
  }
  return sent;
}
