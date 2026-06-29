// RemindME — 铃声资源同步脚本
// 用法：node scripts/sync-native-audio-assets.js  或  npm run sync:audio

const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const PUBLIC_SOUNDS = path.join(ROOT, "public", "sounds")
const ANDROID_ASSETS = path.join(ROOT, "android", "app", "src", "main", "assets")
const IOS_SOUNDS = path.join(ROOT, "ios", "App", "App", "sounds")

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function syncFiles(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`[sync:audio] 源目录不存在: ${srcDir}`)
    return
  }
  ensureDir(destDir)
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".mp3"))
  if (files.length === 0) {
    console.warn(`[sync:audio] 源目录无 mp3 文件: ${srcDir}`)
    return
  }
  for (const file of files) {
    const src = path.join(srcDir, file)
    const dest = path.join(destDir, file)
    fs.copyFileSync(src, dest)
  }
  console.log(`[sync:audio] ${files.length} 个 mp3 文件已同步: ${srcDir} → ${destDir}`)
}

// 1. 确保 public/sounds 目录存在
ensureDir(PUBLIC_SOUNDS)
console.log(`[sync:audio] Web fallback: ${PUBLIC_SOUNDS}`)

// 2. 同步到 Android assets 根目录
syncFiles(PUBLIC_SOUNDS, ANDROID_ASSETS)

// 3. iOS（仅在工程存在时同步）
if (fs.existsSync(path.join(ROOT, "ios", "App", "App"))) {
  syncFiles(PUBLIC_SOUNDS, IOS_SOUNDS)
} else {
  console.warn("[sync:audio] iOS 工程不存在（ios/App/App/ 未找到），跳过 iOS 资源同步。")
  console.warn("[sync:audio] 后续在 macOS 执行 npx cap add ios 后可重新运行本脚本。")
}

console.log("[sync:audio] 完成。")
