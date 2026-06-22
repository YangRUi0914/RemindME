"use client"

import { useState } from "react"
import { Sun, Moon, Check } from "lucide-react"

const options = [
  { value: "light", label: "浅色主题", icon: Sun },
  { value: "dark", label: "深色主题", icon: Moon },
] as const

export function ThemeSetting({ initialTheme }: { initialTheme: "light" | "dark" }) {
  const [theme, setThemeState] = useState<"light" | "dark">(initialTheme)

  function applyTheme(value: "light" | "dark") {
    setThemeState(value)
    // 立即更新 <html> 的 class，切换无闪烁
    const root = document.documentElement
    if (value === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
    // 用 cookie 持久化（在 v0 预览的沙箱 iframe 中比 localStorage 更可靠）
    document.cookie = `theme=${value}; path=/; max-age=31536000; SameSite=Lax`
  }

  return (
    <div className="flex flex-col gap-3">
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => applyTheme(value)}
            aria-pressed={active}
            className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-base">{label}</span>
            </span>
            {active && <Check className="h-5 w-5" strokeWidth={1.5} />}
          </button>
        )
      })}
    </div>
  )
}
