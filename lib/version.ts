// RemindME v1.0.1 — 版本检查 + 自动更新分流

import { Capacitor } from "@capacitor/core"

export const APP_VERSION = "1.0.1"

/** 远程版本清单地址（部署后替换为实际 URL） */
const MANIFEST_URL =
  "https://yrgaolan730200.github.io/RemindME/update-manifest.json"

export interface UpdateManifest {
  version: string
  apk_url: string
  release_notes: string
}

function parseVersion(v: string): number[] {
  return v.split(".").map(Number)
}

/** 返回 true 表示 remote > local */
function isNewer(local: string, remote: string): boolean {
  const a = parseVersion(local)
  const b = parseVersion(remote)
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] ?? 0
    const y = b[i] ?? 0
    if (y > x) return true
    if (y < x) return false
  }
  return false
}

export interface UpdateCheckResult {
  hasUpdate: boolean
  manifest: UpdateManifest | null
}

export async function checkForUpdate(): Promise<UpdateCheckResult> {
  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-cache" })
    if (!res.ok) return { hasUpdate: false, manifest: null }
    const manifest: UpdateManifest = await res.json()
    if (isNewer(APP_VERSION, manifest.version)) {
      return { hasUpdate: true, manifest }
    }
    return { hasUpdate: false, manifest }
  } catch {
    // 网络不通或服务器不可达 — 静默跳过
    return { hasUpdate: false, manifest: null }
  }
}

/** 根据平台分流更新操作 */
export function getUpdatePlatform(): "android" | "ios" | "web" {
  try {
    const p = Capacitor.getPlatform()
    if (p === "ios") return "ios"
    if (p === "android") return "android"
    return "web"
  } catch {
    return "web"
  }
}

export function openDownloadUrl(url: string): void {
  if (typeof window !== "undefined") {
    window.open(url, "_blank")
  }
}
