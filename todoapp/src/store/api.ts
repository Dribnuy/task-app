import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Todo {
  id: number;
  title: string;
  body?: string;
  dateAdded?: string; 
}

export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => "todos?_limit=10",
      providesTags: ["Todos"],
    }),
    addTodo: builder.mutation<Todo, Omit<Todo, "id">>({
      query: (todo) => ({
        url: "todos",
        method: "POST",
        body: todo,
      }),
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todoApi.util.updateQueryData("getTodos", undefined, (draft) => {
            const newTodo = {
              ...todo,
              id:
                draft.length > 0 ? Math.max(...draft.map((t) => t.id)) + 1 : 1,
              dateAdded: new Date().toISOString(), 
            };
            draft.push(newTodo);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          dispatch(todoApi.util.invalidateTags(["Todos"]));
        }
      },
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation } = todoApi;
