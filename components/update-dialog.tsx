// RemindME v1.0.1 — 版本更新弹窗（Android / iOS / Web 分流）

"use client"

import { X, Download, Smartphone } from "lucide-react"
import { getUpdatePlatform, openDownloadUrl } from "@/lib/version"

interface Props {
  version: string
  releaseNotes: string
  apkUrl: string
  onClose: () => void
}

export function UpdateDialog({ version, releaseNotes, apkUrl, onClose }: Props) {
  const platform = getUpdatePlatform()

  function handleAction() {
    if (platform === "ios") {
      onClose()
      return
    }
    openDownloadUrl(apkUrl)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-12 sm:items-center sm:pb-0">
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-background p-8 shadow-2xl">
        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <h2 className="text-lg font-medium tracking-wide">发现新版本</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          RemindME <span className="font-medium text-foreground">v{version}</span> 已发布
        </p>

        {releaseNotes && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{releaseNotes}</p>
        )}

        <hr className="my-5 border-border" />

        {platform === "ios" ? (
          /* iOS TestFlight 提示 */
          <div className="flex flex-col items-center gap-3">
            <Smartphone className="h-8 w-8 text-muted-foreground" strokeWidth={1} />
            <p className="text-center text-sm leading-relaxed text-muted-foreground">
              iOS 版本正在 TestFlight 内部测试中，
              <br />
              请联系作者获取最新测试包
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-full border border-border px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
            >
              我知道了
            </button>
          </div>
        ) : (
          /* Android / Web — 下载 APK */
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleAction}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              <Download className="h-4 w-4" strokeWidth={1.5} />
              {platform === "android" ? "下载 Android APK" : "前往下载页面"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              以后再说
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
