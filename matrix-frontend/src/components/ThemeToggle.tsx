import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  // 实现 Ctrl+Shift+T 快捷键切换主题
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [theme, setTheme])

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-md p-2 hover:bg-accent transition-colors"
      title="切换主题 (Ctrl+Shift+T)"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">切换主题</span>
    </button>
  )
}
