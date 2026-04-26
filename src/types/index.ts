export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseFetchOptions {
  timeout?: number;
}

export interface UseFetchReturn<T> extends ApiResponse<T> {
  refetch: () => void;
}