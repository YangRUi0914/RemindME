"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Plus, Clock, Settings, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getTodos } from "@/lib/todos"
import type { Todo } from "@/lib/todos"
import {
  type BlockKey,
  BLOCK_LABELS,
  getDiyTitle,
  setDiyTitle,
  getDiyBlocks,
  moveBlock,
  isDiyMode,
  exitDiyMode,
} from "@/lib/diy"

// ═══════════════════════════════════════════════
// 区块渲染函数
// ═══════════════════════════════════════════════

function TitleBlock({ editing, title, onChange }: { editing: boolean; title: string; onChange: (v: string) => void }) {
  if (editing) {
    return (
      <input
        value={title}
        onChange={(e) => onChange(e.target.value)}
        placeholder="输入自定义标题…"
        autoComplete="off"
        className="text-pretty text-center text-2xl font-medium leading-relaxed tracking-wide sm:text-3xl bg-transparent border-b border-dashed border-muted-foreground/30 outline-none w-full pb-1 placeholder:text-muted-foreground/20"
      />
    )
  }
  return (
    <h1 className="text-pretty text-center text-2xl font-medium leading-relaxed tracking-wide sm:text-3xl">
      {title}
    </h1>
  )
}

function TodoListBlock() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    setTodos(getTodos().filter((t) => !t.completed))
  }, [])

  if (todos.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground/40">
        暂无待办
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2 w-full max-w-xs mx-auto">
      {todos.slice(0, 5).map((t) => (
        <li key={t.id} className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-10 shrink-0 text-xs tabular-nums text-muted-foreground/50">
            {t.dueTime ? t.dueTime.slice(0, 5) : "—"}
          </span>
          <span className="truncate">{t.title}</span>
        </li>
      ))}
      {todos.length > 5 && (
        <p className="text-xs text-muted-foreground/30 mt-1 text-center">
          还有 {todos.length - 5} 条待办…
        </p>
      )}
    </ul>
  )
}

function ButtonsBlock() {
  return (
    <div className="flex w-full items-center justify-center gap-10 sm:gap-14">
      <Link
        href="/add"
        aria-label="添加待办"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
      >
        <Plus className="h-6 w-6" strokeWidth={1.5} />
      </Link>

      <Link
        href="/history"
        aria-label="历史待办"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
      >
        <Clock className="h-6 w-6" strokeWidth={1.5} />
      </Link>

      <Link
        href="/settings"
        aria-label="设置"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
      >
        <Settings className="h-6 w-6" strokeWidth={1.5} />
      </Link>
    </div>
  )
}

// ═══════════════════════════════════════════════
// 主页面
// ═══════════════════════════════════════════════

export default function HomePage() {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState("到时候记得提醒我！")
  const [blocks, setBlocks] = useState<BlockKey[]>(["title", "todolist", "buttons"])

  useEffect(() => {
    setBlocks(getDiyBlocks())
    setTitle(getDiyTitle())
    setEditing(isDiyMode())
  }, [])

  const handleTitleChange = useCallback((v: string) => setTitle(v), [])

  function handleMove(index: number, dir: "up" | "down") {
    setBlocks((prev) => moveBlock(prev, index, dir))
  }

  function handleSave() {
    setDiyTitle(title)
    exitDiyMode()
    setEditing(false)
  }

  const blockRenderers: Record<BlockKey, () => React.ReactNode> = {
    title: () => <TitleBlock editing={editing} title={title} onChange={handleTitleChange} />,
    todolist: () => <TodoListBlock />,
    buttons: () => <ButtonsBlock />,
  }

  return (
    <main
      className={cn(
        "flex min-h-dvh flex-col items-center justify-center px-6 pb-8",
        editing && "gap-6 justify-start",
      )}
      style={{
        paddingTop: editing
          ? "calc(env(safe-area-inset-top, 32px) + 6rem)"
          : "calc(env(safe-area-inset-top, 32px) + 2rem)",
      }}
    >
      {/* DIY 模式顶栏 */}
      {editing && (
        <div
          className="fixed inset-x-0 z-10 mx-auto flex max-w-md items-center justify-between px-6 py-4"
          style={{ top: "calc(env(safe-area-inset-top, 24px) + 0.5rem)" }}
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground/50">
            DIY 实验室
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            退出并保存
          </button>
        </div>
      )}

      {blocks.map((key, i) => {
        const render = blockRenderers[key]
        const isFirst = i === 0
        const isLast = i === blocks.length - 1

        return (
          <div
            key={key}
            className={cn(
              "relative flex flex-col items-center w-full",
              editing && "rounded-2xl border border-dashed border-muted-foreground/15 py-6 px-4",
            )}
          >
            {/* 排序箭头 */}
            {editing && (
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                <button
                  type="button"
                  disabled={isFirst}
                  aria-label={`${BLOCK_LABELS[key]} 上移`}
                  onClick={() => handleMove(i, "up")}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded transition-colors",
                    isFirst
                      ? "text-muted-foreground/15 cursor-default"
                      : "text-muted-foreground/40 hover:text-foreground",
                  )}
                >
                  <ChevronUp className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  disabled={isLast}
                  aria-label={`${BLOCK_LABELS[key]} 下移`}
                  onClick={() => handleMove(i, "down")}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded transition-colors",
                    isLast
                      ? "text-muted-foreground/15 cursor-default"
                      : "text-muted-foreground/40 hover:text-foreground",
                  )}
                >
                  <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            )}

            {/* 区块标签（仅编辑模式） */}
            {editing && (
              <span className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground/30">
                {BLOCK_LABELS[key]}
              </span>
            )}

            {render()}
          </div>
        )
      })}
    </main>
  )
}
