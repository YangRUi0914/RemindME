// RemindME — 铃声试听 hook（原生优先，Web fallback）

"use client"

import { useRef, useCallback, useEffect } from "react"
import { Capacitor } from "@capacitor/core"
import { NativeAudio } from "@capacitor-community/native-audio"

export function useSoundPreview() {
  const preloadedRef = useRef<Set<string>>(new Set())
  const webAudioRef = useRef<HTMLAudioElement | null>(null)
  const currentAssetIdRef = useRef<string | null>(null)

  // ── Native：预加载单个铃声 ──
  const preloadNative = useCallback(async (soundId: string) => {
    if (preloadedRef.current.has(soundId)) return
    const assetId = `ringtone_${soundId}`
    try {
      await NativeAudio.preload({
        assetId,
        assetPath: `${soundId}.mp3`,
        audioChannelNum: 1,
        isUrl: false,
      })
      preloadedRef.current.add(soundId)
    } catch (e) {
      console.error(
        `[NativeAudio] preload 失败 — soundId: ${soundId}, assetPath: ${soundId}.mp3`,
        e,
      )
    }
  }, [])

  // ── Native：停止上一个，播放新的 ──
  const playNative = useCallback(
    async (soundId: string) => {
      const assetId = `ringtone_${soundId}`

      // 停止上一个正在播放的
      if (currentAssetIdRef.current && currentAssetIdRef.current !== assetId) {
        try {
          await NativeAudio.stop({ assetId: currentAssetIdRef.current })
        } catch {
          // 忽略 stop 错误，可能已经停止
        }
      }

      // 预加载（已加载则跳过）
      await preloadNative(soundId)

      // 播放
      await NativeAudio.play({ assetId })
      currentAssetIdRef.current = assetId
    },
    [preloadNative],
  )

  // ── Web：HTMLAudioElement 降级 ──
  const playWeb = useCallback((soundId: string) => {
    if (webAudioRef.current) {
      webAudioRef.current.pause()
      webAudioRef.current.currentTime = 0
      webAudioRef.current = null
    }
    const audio = new Audio(`/sounds/${soundId}.mp3`)
    webAudioRef.current = audio
    audio.play().catch((e) => {
      console.error(`[Web] Audio 播放失败 — soundId: ${soundId}`, e)
    })
    audio.addEventListener("ended", () => {
      if (webAudioRef.current === audio) {
        webAudioRef.current = null
      }
    })
  }, [])

  // ── 统一入口 ──
  const previewSound = useCallback(
    async (soundId: string) => {
      if (soundId === "default") return
      if (Capacitor.isNativePlatform()) {
        await playNative(soundId)
      } else {
        playWeb(soundId)
      }
    },
    [playNative, playWeb],
  )

  // ── 停止当前试听 ──
  const stopPreview = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      if (currentAssetIdRef.current) {
        try {
          await NativeAudio.stop({ assetId: currentAssetIdRef.current })
        } catch {
          // 忽略
        }
        currentAssetIdRef.current = null
      }
    } else {
      if (webAudioRef.current) {
        webAudioRef.current.pause()
        webAudioRef.current.currentTime = 0
        webAudioRef.current = null
      }
    }
  }, [])

  // ── 组件卸载清理 ──
  useEffect(() => {
    return () => {
      if (Capacitor.isNativePlatform()) {
        if (currentAssetIdRef.current) {
          NativeAudio.stop({ assetId: currentAssetIdRef.current }).catch(() => {})
        }
        for (const soundId of preloadedRef.current) {
          NativeAudio.unload({ assetId: `ringtone_${soundId}` }).catch(() => {})
        }
        preloadedRef.current.clear()
      } else {
        if (webAudioRef.current) {
          webAudioRef.current.pause()
          webAudioRef.current = null
        }
      }
    }
  }, [])

  return { previewSound, stopPreview }
}
