"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FlaskConical } from "lucide-react"
import { ThemeSetting } from "@/components/theme-setting"
import { enterDiyMode } from "@/lib/diy"

function getClientTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  try {
    return document.cookie.includes("theme=dark") ? "dark" : "light"
  } catch {
    return "light"
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const [initialTheme] = useState<"light" | "dark">(getClientTheme)

  function handleEnterDiy() {
    enterDiyMode()
    router.push("/")
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-8">
      <header className="mb-10 flex items-center">
        <Link
          href="/"
          aria-label="返回"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="ml-2 text-base font-medium tracking-wide">设置</h1>
      </header>

      <section className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">界面主题</p>
        <ThemeSetting initialTheme={initialTheme} />
      </section>

      <hr className="my-10 border-border" />

      <section className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">实验室</p>
        <button
          type="button"
          onClick={handleEnterDiy}
          className="flex items-center justify-between rounded-2xl border border-border px-5 py-4 text-left text-foreground transition-colors hover:bg-muted"
        >
          <span className="flex items-center gap-3">
            <FlaskConical className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-base">DIY 模式</span>
          </span>
          <span className="text-xs text-muted-foreground">自定义布局 →</span>
        </button>
      </section>
    </main>
  )
}
