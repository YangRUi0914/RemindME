"use client"

import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toggleTodo, deleteTodo } from "@/lib/todos"
import type { Todo } from "@/lib/todos"

export function TodoItem({ todo, onUpdate }: { todo: Todo; onUpdate: () => void }) {
  const time = todo.dueTime ? todo.dueTime.slice(0, 5) : ""

  function handleToggle() {
    toggleTodo(todo.id, !todo.completed)
    onUpdate()
  }

  function handleDelete() {
    deleteTodo(todo.id)
    onUpdate()
  }

  return (
    <li
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted/60",
      )}
    >
      <span className="w-11 shrink-0 text-xs tabular-nums text-muted-foreground">{time}</span>

      <button
        type="button"
        aria-label={todo.completed ? "标记为未完成" : "完成待办"}
        onClick={handleToggle}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          todo.completed
            ? "border-foreground bg-foreground text-background"
            : "border-foreground text-transparent hover:bg-foreground/10",
        )}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>

      <p className={cn("min-w-0 flex-1 truncate text-sm", todo.completed && "text-muted-foreground line-through")}>
        {todo.title}
      </p>

      <button
        type="button"
        aria-label="删除"
        onClick={handleDelete}
        className="shrink-0 rounded-full p-1 text-muted-foreground/40 opacity-0 transition-all hover:text-foreground group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </li>
  )
}
