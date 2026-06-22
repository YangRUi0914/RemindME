import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cookies } from "next/headers"
import { ThemeSetting } from "@/components/theme-setting"

export default async function SettingsPage() {
  const initialTheme = (await cookies()).get("theme")?.value === "dark" ? "dark" : "light"

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
    </main>
  )
}
