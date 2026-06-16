import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ApiError } from '@/services/api-client';

import { createTodo, getTodos } from '../api/todos-api';
import type { Todo } from '../api/todos.types';

/** Central query keys for the todos feature. */
export const todoKeys = {
  all: ['todos'] as const,
};

/** Fetch the todo list. `error` is typed as `ApiError` from the api client. */
export function useTodos() {
  return useQuery<Todo[], ApiError>({
    queryKey: todoKeys.all,
    queryFn: getTodos,
  });
}

/** Create a todo and refresh the list on success. */
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}
