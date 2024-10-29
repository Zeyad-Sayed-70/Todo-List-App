import { Todo } from "@/types";
import { create } from "zustand";

export interface TodosState {
  todosData: Todo[];
  updateTodosData: (id: number, data: Todo) => void;
  setTodosData: (todos: Todo[]) => void;
  insetTodoData: (todo: Todo) => void;
  deleteTodoData: (id: number) => void;
}

export const useTodos = create<TodosState>((set) => ({
  todosData: [],
  setTodosData: (todos: Todo[]) => {
    set({ todosData: todos });
  },
  updateTodosData: (id: number, newTodo: Todo) => {
    set((state) => {
      const newTodos = state.todosData.map((todo) => {
        if (todo.id === id) {
          return newTodo;
        }
        return todo;
      });
      return { todosData: newTodos };
    });
  },
  insetTodoData: (todo: Todo) => {
    set((state) => {
      const newTodos = [...state.todosData, todo];
      return { todosData: newTodos };
    });
  },
  deleteTodoData: (id: number) => {
    set((state) => {
      const newTodos = state.todosData.filter((todo) => todo.id !== id);
      return { todosData: newTodos };
    });
  },
}));
