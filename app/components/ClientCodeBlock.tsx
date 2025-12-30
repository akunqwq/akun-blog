"use client";

import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";

interface ClientCodeBlockProps {
  children: string;
  className?: string;
}

export default function ClientCodeBlock({ children, className }: ClientCodeBlockProps) {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 组件挂载后才启用主题检测
  useEffect(() => {
    setMounted(true);
    setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    async function runHighlight() {
      const highlighter = await createHighlighter({
        themes: ["vitesse-dark", "github-light"],
        langs: [
          "javascript", "typescript", "json", "css",
          "html", "bash", "python", "cpp", "java", "markdown",
           "vue", "tsx", "jsx" 
        ],
      });

      let lang = className?.replace("language-", "") || "text";
      // 添加映射支持简写
      if (lang === "js") lang = "javascript";
      if (lang === "ts") lang = "typescript";
      if (lang === "md") lang = "markdown"; 
      if (lang === "vue") lang = "html";
      if (lang === "tsx") lang = "typescript";
      if (lang === "jsx") lang = "javascript";

      const generated = highlighter.codeToHtml(children, {
        lang,
        theme: isDark ? "vitesse-dark" : "github-light",
      });

      setHtml(generated);
    }

      runHighlight();
  }, [children, className, isDark, mounted]);

  // 语言标签
  const langLabel = (className || "").replace("language-", "").toUpperCase();

  // 复制功能
  const copyCode = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative my-6 rounded-lg overflow-hidden border border-gray-700">

      {/* 顶部工具栏 */}
      <div className={`flex items-center justify-between px-3 py-2 text-xs border-b ${mounted && isDark ? 'bg-[#1a1a2e] border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>

        {/* 左：语言标签 */}
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-gray-800/50 text-white">
          {langLabel || "CODE"}
        </span>

        {/* 右：复制按钮 */}
        <button
          onClick={copyCode}
          className={`px-2 py-0.5 rounded text-[10px] hover:opacity-80 transition-opacity ${copied ? 'text-green-400' : ''}`}
        >
          {copied ? "✓" : "复制"}
        </button>
      </div>

      {/* 代码高亮区域 */}
      <div
        className="text-sm shiki"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
