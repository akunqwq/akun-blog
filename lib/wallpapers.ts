import wallpapers from '@/data/wallpapers.json'

export interface Wallpaper {
  id: string
  title: string
  url: string
  thumbnail: string
  tags: string[]
  author?: string
  source?: string
  sourceUrl?: string
  uploadedAt?: string
  fileSize?: string
  resolution?: string
}

export function getAllWallpapers(): Wallpaper[] {
  return wallpapers as Wallpaper[]
}



// 根据ID获取壁纸
export function getWallpaperById(id: string): Wallpaper | undefined {
  if (!id || typeof id !== 'string') {
    return undefined
  }
  const allWallpapers = getAllWallpapers()
  return allWallpapers.find(wallpaper => wallpaper.id === id)
}



// 根据标签搜索壁纸
export function searchWallpapersByTag(tag: string): Wallpaper[] {
  if (!tag || typeof tag !== 'string') {
    return []
  }
  const allWallpapers = getAllWallpapers()
  const searchTerm = tag.toLowerCase().trim()
  return allWallpapers.filter(wallpaper => 
    wallpaper.tags.some(t => t.toLowerCase().includes(searchTerm))
  )
}