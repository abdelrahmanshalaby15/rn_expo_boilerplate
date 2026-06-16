/** Shape of a todo returned by the API (e.g. a JSONPlaceholder-style `/todos`). */
export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

/** Payload for creating a todo. */
export type CreateTodoInput = {
  title: string;
  completed?: boolean;
};
