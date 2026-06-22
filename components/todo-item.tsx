"use client"

import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toggleTodo, deleteTodo } from "@/lib/todos"
import type { Todo } from "@/lib/todos"

export function TodoItem({ todo, onUpdate }: { todo: Todo; onUpdate: () => void }) {
  const time = todo.dueTime.slice(0, 5)

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
        aria-label={todo.completed ? "标记为未完成" : "标记为已完成"}
        onClick={handleToggle}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          todo.completed
            ? "border-foreground bg-foreground text-background"
            : "border-muted-foreground/50 text-transparent",
        )}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
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
