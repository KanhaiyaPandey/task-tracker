import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';

function devLog(message: string, data?: Record<string, unknown>) {
  if (!__DEV__) return;
  if (data) console.log('[mobile][api]', message, data);
  else console.log('[mobile][api]', message);
}

function getDevHost(): string | null {
  const scriptURL = (NativeModules as any)?.SourceCode?.scriptURL;
  if (typeof scriptURL === 'string' && scriptURL.length > 0) {
    try {
      const url = new URL(scriptURL);
      return url.hostname || null;
    } catch {
      const m = scriptURL.match(/https?:\/\/([^/:]+)/i);
      if (m?.[1]) return m[1];
    }
  }

  const exponentConstants = (NativeModules as any)?.ExponentConstants;
  const manifest =
    exponentConstants?.manifest ??
    (typeof exponentConstants?.manifestString === 'string'
      ? (() => {
          try {
            return JSON.parse(exponentConstants.manifestString);
          } catch {
            return null;
          }
        })()
      : null);

  const hostUri = manifest?.hostUri ?? manifest?.debuggerHost ?? null;
  if (typeof hostUri === 'string' && hostUri.length > 0) return hostUri.split(':')[0] ?? null;

  return null;
}

function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) return fromEnv.trim();

  if (__DEV__) {
    const host = getDevHost();
    if (host) {
      // On Android emulator, "localhost" points at the emulator, not your dev machine.
      const resolvedHost = Platform.OS === 'android' && host === 'localhost' ? '10.0.2.2' : host;
      return `http://${resolvedHost}:4000/api`;
    }
  }

  return 'http://localhost:4000/api';
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

if (__DEV__) {
  const baseURL = api.defaults.baseURL;
  devLog('baseURL', { baseURL });
  if (typeof baseURL === 'string' && (baseURL.includes('localhost:4000') || baseURL.includes('127.0.0.1:4000'))) {
    devLog('baseURL:warning', {
      message:
        'If you are using a physical phone, localhost will fail. Set EXPO_PUBLIC_API_URL to your machine IP, e.g. http://10.x.x.x:4000/api',
    });
  }
}

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// Auth
export async function loginRequest(email: string, password: string) {
  const startedAt = Date.now();
  devLog('POST /auth/login:start', { email, passwordPresent: Boolean(password), passwordLength: password.length });
  try {
    const res = await api.post<{ token: string }>('/auth/login', { email, password });
    devLog('POST /auth/login:success', {
      email,
      ms: Date.now() - startedAt,
      tokenReceived: Boolean(res.data?.token),
      tokenLength: res.data?.token?.length,
    });
    return res.data;
  } catch (err: any) {
    devLog('POST /auth/login:error', {
      email,
      ms: Date.now() - startedAt,
      status: err?.response?.status,
      message: err?.response?.data?.message ?? err?.message,
    });
    throw err;
  }
}

export async function registerRequest(name: string, email: string, password: string) {
  const startedAt = Date.now();
  devLog('POST /auth/register:start', {
    name,
    email,
    passwordPresent: Boolean(password),
    passwordLength: password.length,
  });
  try {
    const res = await api.post('/auth/register', { name, email, password });
    devLog('POST /auth/register:success', { name, email, ms: Date.now() - startedAt });
    return res.data;
  } catch (err: any) {
    devLog('POST /auth/register:error', {
      name,
      email,
      ms: Date.now() - startedAt,
      status: err?.response?.status,
      message: err?.response?.data?.message ?? err?.message,
    });
    throw err;
  }
}

// Tasks
export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function fetchTasks() {
  const res = await api.get<Task[]>('/tasks');
  return res.data;
}

export async function createTaskRequest(title: string, description?: string) {
  const res = await api.post<Task>('/tasks', { title, description });
  return res.data;
}

export async function updateTaskRequest(id: string, data: Partial<Pick<Task, 'title' | 'description' | 'completed'>>) {
  const res = await api.patch<Task>(`/tasks/${id}`, data);
  return res.data;
}

export async function deleteTaskRequest(id: string) {
  const res = await api.delete<{ message: string }>(`/tasks/${id}`);
  return res.data;
}
