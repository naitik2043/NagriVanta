import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

let token = null;
// shortcut: token kept in AsyncStorage; switch to expo-secure-store for a production build.
export const loadToken = async () => { token = await AsyncStorage.getItem('token'); return token; };
export const setToken = async (t) => { token = t; t ? await AsyncStorage.setItem('token', t) : await AsyncStorage.removeItem('token'); };

export async function api(path, { method = 'GET', body, query, headers: extraHeaders = {} } = {}) {
  const qs = query ? `?${new URLSearchParams(Object.entries(query).filter(([, v]) => v !== '' && v != null))}` : '';
  const headers = { ...extraHeaders };
  if (method === 'POST' && path === '/complaints' && !headers['Idempotency-Key']) headers['Idempotency-Key'] = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const idempotencyKey = headers['Idempotency-Key'];
  if (token) headers.Authorization = `Bearer ${token}`;
  const isForm = body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';
  let res;
  try {
    res = await fetch(`${API_URL}/api/v1${path}${qs}`, { method, headers, body: isForm ? body : body && JSON.stringify(body) });
  } catch {
    const e = new Error(`Cannot reach the server at ${API_URL}. Check your connection (and that EXPO_PUBLIC_API_URL is your computer's LAN IP in development).`);
    e.network = true;
    e.idempotencyKey = idempotencyKey;
    throw e;
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    const details = json.error?.details?.map((d) => `${d.field}: ${d.message}`).join('\n');
    const error = new Error([json.error?.message || 'Request failed', details].filter(Boolean).join('\n'));
    error.status = res.status;
    error.code = json.error?.code;
    error.idempotencyKey = idempotencyKey;
    throw error;
  }
  return { data: json.data, meta: json.meta };
}

// React Native FormData takes {uri,name,type}; the web build needs a real Blob.
export async function appendImage(fd, field, asset, i) {
  const type = asset.mimeType || 'image/jpeg';
  const name = asset.fileName || `photo-${i}.${type.split('/')[1] || 'jpg'}`;
  if (Platform.OS === 'web') fd.append(field, await (await fetch(asset.uri)).blob(), name);
  else fd.append(field, { uri: asset.uri, name, type });
}

export const imageUrl = (p) => (p?.startsWith('http') ? p : `${API_URL}${p}`);
