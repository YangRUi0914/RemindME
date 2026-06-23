// RemindME v1.0.1 — 启动时自动检查更新

"use client"

import { useEffect, useState } from "react"
import { checkForUpdate, type UpdateManifest } from "@/lib/version"
import { UpdateDialog } from "@/components/update-dialog"

export function UpdateChecker() {
  const [manifest, setManifest] = useState<UpdateManifest | null>(null)

  useEffect(() => {
    let cancelled = false
    checkForUpdate().then((result) => {
      if (!cancelled && result.hasUpdate && result.manifest) {
        setManifest(result.manifest)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!manifest) return null

  return (
    <UpdateDialog
      version={manifest.version}
      releaseNotes={manifest.release_notes}
      apkUrl={manifest.apk_url}
      onClose={() => setManifest(null)}
    />
  )
}
