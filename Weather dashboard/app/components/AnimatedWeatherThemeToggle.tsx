'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sun, Cloud, CloudRain } from 'lucide-react'

type AnimatedWeatherThemeToggleProps = {
  theme: 'default' | 'animated'
  onThemeChange: (theme: 'default' | 'animated') => void
}

export default function AnimatedWeatherThemeToggle({ theme, onThemeChange }: AnimatedWeatherThemeToggleProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative w-10 h-10 rounded-full overflow-hidden"
      onClick={() => onThemeChange(theme === 'default' ? 'animated' : 'default')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'default' ? <Sun className="h-5 w-5" /> : <CloudRain className="h-5 w-5" />}
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-6 h-6">
          <motion.div
            className="absolute inset-0"
            animate={{
              rotate: isHovered ? 360 : 0,
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sun className="h-6 w-6 text-yellow-500" />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            animate={{
              y: isHovered ? [0, -10, 0] : 0,
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cloud className="h-6 w-6 text-gray-400" />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            animate={{
              y: isHovered ? [0, 10, 0] : 0,
            }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <CloudRain className="h-6 w-6 text-blue-500" />
          </motion.div>
        </div>
      </motion.div>
    </Button>
  )
}

