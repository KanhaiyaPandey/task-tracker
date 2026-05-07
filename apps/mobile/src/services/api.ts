import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  const res = await api.post<{ token: string }>('/auth/login', { email, password });
  return res.data;
}

export async function registerRequest(name: string, email: string, password: string) {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
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
