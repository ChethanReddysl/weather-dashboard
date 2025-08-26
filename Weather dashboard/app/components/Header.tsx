'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { WiDaySunny } from 'react-icons/wi'
import { Moon, Sun } from 'lucide-react'

type HeaderProps = {
  children: React.ReactNode
}

export default function Header({ children }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <WiDaySunny className="text-yellow-500 text-3xl" />
          <h1 className="text-2xl font-bold text-foreground">Weather Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

