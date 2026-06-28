// RemindME — 平台分治提醒调度（Android AlarmManager / iOS LocalNotifications / Web noop）

import { Capacitor } from "@capacitor/core"
import { LocalNotifications } from "@capacitor/local-notifications"
import { getNotificationSound, getRingtone } from "@/lib/settings"

// Android 原生插件接口（由 ReminderAlarmPlugin.java 暴露）
interface ReminderAlarmNative {
  scheduleReminderAlarm(opts: {
    id: number
    title: string
    body: string
    fireAt: number
    soundName: string
  }): Promise<{ scheduled: boolean; id: number }>
  cancelReminderAlarm(opts: { id: number }): Promise<{ cancelled: boolean }>
  stopRinging(): Promise<void>
  canScheduleExactAlarms(): Promise<{ canSchedule: boolean }>
  openExactAlarmSettings(): Promise<void>
}

function getNativePlugin(): ReminderAlarmNative | null {
  try {
    return (Capacitor as any).getPlatform() !== "web"
      ? (window as any).Capacitor?.getPlatform() !== undefined
        ? {
            scheduleReminderAlarm: (o: any) =>
              (window as any).Capacitor.Plugins.ReminderAlarm.scheduleReminderAlarm(o),
            cancelReminderAlarm: (o: any) =>
              (window as any).Capacitor.Plugins.ReminderAlarm.cancelReminderAlarm(o),
            stopRinging: () =>
              (window as any).Capacitor.Plugins.ReminderAlarm.stopRinging(),
            canScheduleExactAlarms: () =>
              (window as any).Capacitor.Plugins.ReminderAlarm.canScheduleExactAlarms(),
            openExactAlarmSettings: () =>
              (window as any).Capacitor.Plugins.ReminderAlarm.openExactAlarmSettings(),
          }
        : null
      : null
  } catch {
    return null
  }
}

export interface ReminderParams {
  id: number
  title: string
  body: string
  dueDate: string
  dueTime: string
}

function parseFireAt(dueDate: string, dueTime: string): number {
  const [y, m, d] = dueDate.split("-").map(Number)
  const [hh, mm] = dueTime.split(":").map(Number)
  return new Date(y, m - 1, d, hh, mm, 0).getTime()
}

function getRawSoundName(): string {
  const ringtone = getRingtone()
  // default → "alarm" as fallback raw resource
  return ringtone === "default" ? "alarm" : ringtone
}

/** 调度提醒 — Android / iOS 自动分流 */
export async function scheduleReminder(params: ReminderParams): Promise<void> {
  const platform = Capacitor.getPlatform()
  const fireAt = parseFireAt(params.dueDate, params.dueTime)

  // Android: 使用原生 AlarmManager 插件
  if (platform === "android") {
    const plugin = getNativePlugin()
    if (plugin) {
      const soundName = getRawSoundName()
      await plugin.scheduleReminderAlarm({
        id: params.id,
        title: "RemindME",
        body: params.title,
        fireAt,
        soundName,
      })
      return
    }
    // Fallback: 插件不可用时继续用 LocalNotifications
  }

  // iOS: 使用 LocalNotifications 调度
  if (platform === "ios") {
    const sound = getNotificationSound()
    await LocalNotifications.requestPermissions()
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "RemindME",
          body: params.title,
          id: params.id,
          schedule: { at: new Date(fireAt) },
          ...(sound ? { sound } : {}),
        },
      ],
    })
    return
  }

  // Web: no-op
}

/** 取消提醒 */
export async function cancelReminder(id: number): Promise<void> {
  const platform = Capacitor.getPlatform()

  if (platform === "android") {
    const plugin = getNativePlugin()
    if (plugin) {
      await plugin.cancelReminderAlarm({ id })
      return
    }
  }

  // iOS / Web fallback
  await LocalNotifications.cancel({ notifications: [{ id }] }).catch(() => {})
}

/** 停止当前响铃 */
export async function stopCurrentRinging(): Promise<void> {
  const platform = Capacitor.getPlatform()
  if (platform === "android") {
    const plugin = getNativePlugin()
    if (plugin) {
      await plugin.stopRinging()
    }
  }
}

/** 检查 exact alarm 权限 */
export async function checkExactAlarmPermission(): Promise<boolean> {
  const platform = Capacitor.getPlatform()
  if (platform !== "android") return true
  const plugin = getNativePlugin()
  if (!plugin) return true
  try {
    const result = await plugin.canScheduleExactAlarms()
    return result.canSchedule
  } catch {
    return true
  }
}

/** 跳转系统 exact alarm 设置 */
export async function openExactAlarmSettings(): Promise<void> {
  const plugin = getNativePlugin()
  if (plugin) {
    await plugin.openExactAlarmSettings()
  }
}
