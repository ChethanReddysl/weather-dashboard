'use client'

import { Button } from '@/components/ui/button'
import { Cloud, Sun, Snowflake } from 'lucide-react'

type WeatherThemeToggleProps = {
  theme: 'default' | 'dynamic'
  onThemeChange: (theme: 'default' | 'dynamic') => void
}

export default function WeatherThemeToggle({ theme, onThemeChange }: WeatherThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onThemeChange(theme === 'default' ? 'dynamic' : 'default')}
      title={`Switch to ${theme === 'default' ? 'dynamic' : 'default'} weather theme`}
    >
      {theme === 'default' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      ) : (
        <div className="relative h-[1.2rem] w-[1.2rem]">
          <Cloud className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <Snowflake className="absolute h-[0.8rem] w-[0.8rem] left-[0.4rem] top-[0.4rem] rotate-0 scale-100 transition-all" />
        </div>
      )}
      <span className="sr-only">Toggle weather theme</span>
    </Button>
  )
}

