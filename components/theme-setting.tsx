"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Check } from "lucide-react"

const options = [
  { value: "light", label: "浅色主题", icon: Sun },
  { value: "dark", label: "深色主题", icon: Moon },
] as const

export function ThemeSetting() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      {options.map(({ value, label, icon: Icon }) => {
        const active = mounted && theme === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
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
