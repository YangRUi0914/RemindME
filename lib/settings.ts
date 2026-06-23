// RemindME v1.0.1 — 铃声 + 震动偏好管理

export type RingtoneId = "default" | "reflection" | "chimes" | "opening"

export const RINGTONE_OPTIONS: { id: RingtoneId; label: string; desc: string }[] = [
  { id: "default", label: "系统默认", desc: "跟随系统通知音" },
  { id: "reflection", label: "Reflection", desc: "欢快" },
  { id: "chimes", label: "Chimes", desc: "叮当" },
  { id: "opening", label: "Opening", desc: "开场" },
]

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

// ── 震动开关 ──

export function getVibrationEnabled(): boolean {
  return read("vibration_enabled", true)
}

export function setVibrationEnabled(enabled: boolean): void {
  write("vibration_enabled", enabled)
}

// ── 铃声选择 ──

export function getRingtone(): RingtoneId {
  return read<RingtoneId>("ringtone", "default")
}

export function setRingtone(id: RingtoneId): void {
  write("ringtone", id)
}

/** 返回通知插件可用的 sound 值：default → undefined（走系统默认），否则传标识符 */
export function getNotificationSound(): string | undefined {
  const id = getRingtone()
  return id === "default" ? undefined : id
}
