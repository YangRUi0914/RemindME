// RemindME v1.0.1 — 铃声 + 震动偏好管理

export type RingtoneId =
  | "default"
  | "alarm"
  | "arpeggioencoreinfinitum"
  | "beacon"
  | "blues"
  | "bulletin"
  | "bytheseaside"
  | "circuit"

export const RINGTONE_OPTIONS: { id: RingtoneId; label: string; desc: string }[] = [
  { id: "default", label: "系统默认", desc: "跟随系统通知音" },
  { id: "alarm", label: "经典闹钟", desc: "持续响铃" },
  { id: "arpeggioencoreinfinitum", label: "无限琶音", desc: "悠扬旋律" },
  { id: "beacon", label: "灯塔闪烁", desc: "清脆节奏" },
  { id: "blues", label: "忧郁布鲁斯", desc: "深沉低音" },
  { id: "bulletin", label: "简短公告", desc: "简洁提示音" },
  { id: "bytheseaside", label: "在海滨边", desc: "清新海风" },
  { id: "circuit", label: "科幻电路", desc: "电子脉冲" },
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
  return read<RingtoneId>("selected_sound", "default")
}

export function setRingtone(id: RingtoneId): void {
  write("selected_sound", id)
}

/** 返回通知插件可用的 sound 值：default → undefined，否则传「标识符.mp3」（iOS / Android 统一后缀） */
export function getNotificationSound(): string | undefined {
  const id = getRingtone()
  return id === "default" ? undefined : id + ".mp3"
}

/** 返回当前铃声对应的 Android 通知渠道 ID（动态时间戳破除系统静音缓存） */
export function getChannelId(): string {
  return "channel_" + getRingtone() + "_" + Date.now()
}

