export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full 
      bg-white/20 backdrop-blur-xl 
      shadow-lg border-t border-white/30 z-[70]
      text-center text-sm text-gray-300 py-3
      dark:bg-gray-900/60 dark:border-gray-700 dark:text-gray-400">
      © {new Date().getFullYear()}  阿鲲 の小窝
    </footer>
  );
}
