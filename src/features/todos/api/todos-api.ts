import { apiClient } from '@/services/api-client';

import type { CreateTodoInput, Todo } from './todos.types';

/** Typed API calls for the todos feature. All requests go through `apiClient`. */
export const getTodos = () => apiClient.get<Todo[]>('/todos');

export const createTodo = (input: CreateTodoInput) => apiClient.post<Todo>('/todos', input);
