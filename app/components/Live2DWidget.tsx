'use client';

import { useEffect, useRef } from 'react';

export default function Live2DWidget() {
  const desktopCanvasRef = useRef<HTMLCanvasElement>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement>(null);

  // 绘制占位内容的通用函数
  const drawPlaceholder = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // 直接绘制文字，背景色由 CSS 的 bg-white/80 提供
      ctx.fillStyle = '#666';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Live2D角色', canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillText('待做', canvas.width / 2, canvas.height / 2 + 10);
    }
  };

  useEffect(() => {
    // 为桌面端和移动端画布绘制占位内容
    drawPlaceholder(desktopCanvasRef.current);
    drawPlaceholder(mobileCanvasRef.current);

    // TODO: 后续添加鼠标追踪功能
    const handleMouseMove = (e: MouseEvent) => {
      // 鼠标追踪逻辑将在这里实现
      console.log('Mouse position:', e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* 桌面端 - 固定在左下角 */}
      <div className="hidden md:block fixed left-4 bottom-4 z-10">
        <canvas
          ref={desktopCanvasRef}
          width={200}
          height={250}
          className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 transition-transform duration-200 hover:scale-105 cursor-pointer dark:bg-gray-800/80 dark:border-gray-600"
        />
        <div className="text-xs text-gray-500 text-center mt-2 dark:text-gray-400">
          Live2D 角色
        </div>
      </div>

      {/* 移动端 - 集成到移动端布局中 */}
      <div className="md:hidden flex items-center">
        <canvas
          ref={mobileCanvasRef}
          width={160}
          height={200}
          className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-200 transition-transform duration-200 hover:scale-105 cursor-pointer dark:bg-gray-800/70 dark:border-gray-600"
        />
      </div>
    </>
  );
}