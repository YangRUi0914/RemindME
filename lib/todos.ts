// Client-side todo storage using localStorage + platform-native reminders

import { scheduleReminder, cancelReminder } from "@/lib/reminderScheduler"

export interface Todo {
  id: number
  title: string
  dueDate: string
  dueTime: string
  completed: boolean
  createdAt: string
}

const STORAGE_KEY = "remindme-todos"

function readTodos(): Todo[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

export function getTodos(): Todo[] {
  return readTodos().sort((a, b) => {
    const dateCmp = a.dueDate.localeCompare(b.dueDate)
    if (dateCmp !== 0) return dateCmp
    return a.dueTime.localeCompare(b.dueTime)
  })
}

export async function addTodo(input: {
  title: string
  dueDate: string
  dueTime?: string
}): Promise<Todo> {
  const title = input.title.trim()
  if (!title) throw new Error("请输入待办名称")
  if (!input.dueDate) throw new Error("请选择日期")

  const todos = readTodos()
  const maxId = todos.reduce((max, t) => Math.max(max, t.id), 0)
  const todo: Todo = {
    id: maxId + 1,
    title,
    dueDate: input.dueDate,
    dueTime: input.dueTime ?? "",
    completed: false,
    createdAt: new Date().toISOString(),
  }
  todos.push(todo)
  writeTodos(todos)

  // 用户选了具体时间 → 平台分治调度系统级提醒
  if (input.dueTime) {
    await scheduleReminder({
      id: todo.id,
      title: todo.title,
      body: todo.title,
      dueDate: input.dueDate,
      dueTime: input.dueTime,
    })
  }

  return todo
}

export function toggleTodo(id: number, completed: boolean): void {
  const todos = readTodos()
  const index = todos.findIndex((t) => t.id === id)
  if (index !== -1) {
    todos[index].completed = completed
    writeTodos(todos)

    if (completed) {
      cancelReminder(id)
    }
  }
}

export function deleteTodo(id: number): void {
  const todos = readTodos()
  writeTodos(todos.filter((t) => t.id !== id))

  cancelReminder(id)
}
