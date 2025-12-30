import fs from "fs"
import fetch from "node-fetch"
import { loadImage } from "canvas"

async function getFileSize(url: string) {
  try {
    // 1. 尝试 Range 请求
    const resRange = await fetch(url, {
      method: "GET",
      headers: { Range: "bytes=0-2048" }
    })

    const size = resRange.headers.get("content-length")
    if (size) {
      return (Number(size) / (1024 * 1024)).toFixed(2) + " MB"
    }

    // 2. fallback：完整 GET
    const resFull = await fetch(url)
    const buffer = await resFull.arrayBuffer()
    return (buffer.byteLength / (1024 * 1024)).toFixed(2) + " MB"

  } catch (e) {
    console.log("❌ 获取文件大小失败：", url)
    return "未知"
  }
}

async function getResolution(url: string) {
  try {
    const img = await loadImage(url)
    return `${img.width}×${img.height}`
  } catch (err) {
    console.error(`❌ 获取分辨率失败：${url}`, err)
    return "未知"
  }
}

async function updateWallpapers() {
  const path = "./data/wallpapers.json"
  const wallpapers = JSON.parse(fs.readFileSync(path, "utf8"))

  for (const w of wallpapers) {
    console.log(`\n🔍 正在处理：${w.id} - ${w.title}`)

    w.fileSize = await getFileSize(w.url)
    console.log(`📦 文件大小：${w.fileSize}`)

    w.resolution = await getResolution(w.url)
    console.log(`🖼️   分辨率：${w.resolution}`)
  }

  fs.writeFileSync(path, JSON.stringify(wallpapers, null, 2))
  console.log("\n🎉 所有壁纸元数据更新完成！")
}

updateWallpapers()