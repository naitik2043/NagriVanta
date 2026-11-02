import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, appendImage } from './api';

// Offline outbox: reports that could not reach the server are stored here and retried later.
// Photos are referenced by their local file URI, which stays valid in the app's cache.
const KEY = 'outbox';
const listeners = new Set();
export const onOutboxChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

const read = async () => {
  const items = JSON.parse((await AsyncStorage.getItem(KEY)) || '[]');
  let changed = false;
  const migrated = items.map((item) => {
    if (item.id && item.idempotencyKey) return item;
    changed = true;
    return {
      ...item,
      id: item.id || `${item.queuedAt || Date.now()}-${Math.random().toString(36).slice(2)}`,
      idempotencyKey: item.idempotencyKey || `${item.queuedAt || Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
  });
  if (changed) await AsyncStorage.setItem(KEY, JSON.stringify(migrated));
  return migrated;
};
const write = async (items) => { await AsyncStorage.setItem(KEY, JSON.stringify(items)); listeners.forEach((fn) => fn(items.length)); };

export async function queueReport(fields, photos, idempotencyKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`) {
  await write([...(await read()), { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, fields, photos: photos.map(({ uri, mimeType, fileName }) => ({ uri, mimeType, fileName })), idempotencyKey, queuedAt: Date.now() }]);
}

export const queuedCount = async () => (await read()).length;
export const listQueued = read;
export const removeQueued = async (id) => write((await read()).filter((item) => item.id !== id));
export async function retryQueued(id) {
  await write((await read()).map((item) => item.id === id ? { ...item, failed: false, lastError: undefined, failedAt: undefined } : item));
  return flushOutbox();
}

let busy = false;
export async function flushOutbox() {
  if (busy) return 0;
  busy = true;
  let sent = 0;
  try {
    const items = await read();
    const left = [];
    for (const [i, item] of items.entries()) {
      if (item.failed) { left.push(item); continue; }
      try {
        const fd = new FormData();
        Object.entries(item.fields).forEach(([k, v]) => v !== '' && v != null && fd.append(k, String(v)));
        for (const [j, p] of item.photos.entries()) await appendImage(fd, 'images', p, j);
        await api('/complaints', { method: 'POST', body: fd, headers: { 'Idempotency-Key': item.idempotencyKey } });
        sent += 1;
      } catch (err) {
        if (err.network || err.status === 401 || err.status === 429 || err.status >= 500) { left.push(...items.slice(i)); break; }
        // Preserve rejected reports so the citizen can review and correct them later.
        left.push({ ...item, failed: true, lastError: err.message, failedAt: Date.now() });
      }
    }
    await write(left);
  } finally {
    busy = false;
  }
  return sent;
}
