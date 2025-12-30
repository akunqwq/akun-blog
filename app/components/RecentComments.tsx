"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';

interface Comment {
  id: number;
  user_name: string;
  avatar: string;
  date: string;
  text: string;
  created_at?: string;
}

function timeAgo(dateString: string) {
  try {
    const d = new Date(dateString).getTime();
    const now = Date.now();
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));

    return diff === 0 ? "今天" : `${diff} 天前`;
  } catch (error) {
    return "未知时间";
  }
}

export default function RecentComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ user_name: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // 从 Supabase 加载评论
  useEffect(() => {
    fetchComments();
  }, []);

  // ESC键关闭弹窗
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showForm) {
        setShowForm(false);
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showForm]);

  const fetchComments = async () => {
    try {
      setError(null);
      
      if (!supabase) {
        setError('数据库连接未配置');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        setError('获取评论失败');
        return;
      }

      setComments(data || []);
      setHasLoadedOnce(true);
    } catch (err) {
      setError('加载评论出错');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.user_name.trim() || !newComment.text.trim()) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!supabase) {
        setError('数据库连接未配置');
        return;
      }

      const commentData = {
        user_name: newComment.user_name.trim(),
        avatar: "",
        text: newComment.text.trim(),
        date: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('comments')
        .insert([commentData])
        .select()
        .single();

      if (error) {
        setError('提交评论失败，请重试');
        return;
      }

      // 更新本地状态
      setComments([data, ...comments]);
      
      // 重置表单
      setNewComment({ user_name: '', text: '' });
      setShowForm(false);
    } catch (err) {
      setError('提交评论出错，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 桌面端居中表单 */}
      {showForm && (
        <div
          className="hidden md:flex fixed inset-0 bg-black/50 items-center justify-center z-[90]"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">写留言</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="你的昵称"
                value={newComment.user_name}
                onChange={(e) => setNewComment({...newComment, user_name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-pink-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-pink-500"
                required
                title="你的昵称"
              />
              <textarea
                placeholder="写下你的留言..."
                value={newComment.text}
                onChange={(e) => setNewComment({...newComment, text: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-pink-300 h-32 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-pink-500"
                required
                title="留下你宝贵的意见~"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-300 text-white py-3 rounded-lg text-base font-medium hover:bg-pink-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-pink-500 dark:hover:bg-pink-600"
              >
                {isSubmitting ? '提交中...' : '提交留言'}
              </button>
            </form>
          </div>
        </div>
      )}

      <aside
        className={`
          bg-white/70 backdrop-blur-md
          p-3 md:p-6 rounded-3xl
          w-56 md:w-80
          fixed bottom-28 md:bottom-34
          ${isCollapsed ? '-left-48 md:left-4 md:right-8 md:left-auto' : 'left-4 md:left-8 md:right-8 md:left-auto'}
          z-[60]
          hover:shadow-lg
          transition-all duration-300
          dark:bg-gray-800/70 dark:border dark:border-gray-700
        `}
      >
        {/* 移动端收起按钮 - 在右侧 */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="md:hidden absolute -right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-white transition-colors dark:bg-gray-700/80 dark:hover:bg-gray-600"
          title={isCollapsed ? "展开留言板" : "收起留言板"}
        >
          <svg 
            className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base md:text-lg font-bold text-center dark:text-gray-100">留言板</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`${isCollapsed ? 'md:inline hidden' : ''} text-pink-300 hover:text-pink-500 text-xs md:text-sm font-medium dark:text-pink-400`}
          >
            {showForm ? '取消' : '写留言'}
          </button>
        </div>

        {/* 移动端表单 */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-4 p-3 bg-gray-50 rounded-lg space-y-3 md:hidden dark:bg-gray-700">
            <input
              type="text"
              placeholder="你的昵称"
              value={newComment.user_name}
              onChange={(e) => setNewComment({...newComment, user_name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
              required
              title="你的昵称"
            />
            <textarea
              placeholder="写下你的留言..."
              value={newComment.text}
              onChange={(e) => setNewComment({...newComment, text: e.target.value})}
              className="w-full px-3 py-2 border border-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 h-20 resize-none dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
              required
              title="留下你宝贵的意见~"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-300 text-white py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed dark:bg-pink-500 dark:hover:bg-pink-600"
            >
              {isSubmitting ? '提交中...' : '提交留言'}
            </button>
          </form>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm dark:bg-red-950/30 dark:border-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        {/* 评论列表 */}
        <div className="space-y-3 md:space-y-5 max-h-80 md:max-h-96 overflow-y-auto">
          {isLoading ? (
            // 骨架屏，根据实际情况调整数量
            <>
              {(() => {
                // 首次加载显示1个，后续加载显示当前评论数量或最多3个
                const skeletonCount = hasLoadedOnce ? Math.min(comments.length || 1, 3) : 1;
                return Array.from({ length: skeletonCount }, (_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12 animate-pulse"></div>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                ));
              })()}
            </>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
              <span className="md:inline hidden">暂无留言，快留下宝贵的意见反馈吧！</span>
              <span className="md:hidden">暂无留言</span>
            </div>
          ) : (
            <>
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  {/* 头像 */}
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    {c.avatar ? (
                      <Image
                        src={c.avatar}
                        width={40}
                        height={40}
                        alt={c.user_name}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white dark:text-gray-200 text-sm font-medium">
                        {c.user_name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* 内容区域 */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                      <span className="font-medium">{c.user_name}</span>
                      <span className="text-gray-400 dark:text-gray-500">{timeAgo(c.date)}</span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-200 text-sm mt-1 line-clamp-2">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </aside>
    </>
  );
}