import type { Metadata } from "next";
import WallpaperWall from "../components/WallpaperWall";

export const metadata: Metadata = {
  title: "壁纸收藏",
  description: "阿鲲の壁纸收藏 - 精选高清壁纸，包括二次元、风景、自然等多种风格",
  openGraph: {
    title: "阿鲲 の小窝 - 壁纸收藏馆",
    description: "精选高清壁纸收藏，包括二次元、风景、自然等多种风格",
    url: '/wallpapersWall',
  },
};

export default function WallpapersPage() {
  return (
    <div className="px-6 pt-24 md:pt-10 pb-10">
      <div className="max-w-6xl mx-auto">
        <WallpaperWall />
      </div>
    </div>
  );
}