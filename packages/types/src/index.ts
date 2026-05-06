export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type UserPublic = {
  id: string;
  email: string;
};

