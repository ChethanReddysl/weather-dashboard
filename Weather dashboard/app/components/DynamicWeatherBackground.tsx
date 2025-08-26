'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react'

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'thunderstorm'

type DynamicWeatherBackgroundProps = {
  weatherType: WeatherType
  temperature: number
  theme: 'default' | 'dynamic'
}

export default function DynamicWeatherBackground({ weatherType, temperature, theme }: DynamicWeatherBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; speed: number; size: number }>>([])
  const [fallingElements, setFallingElements] = useState<Array<{ id: number; x: number; y: number; speed: number; size: number; angle: number }>>([])
  const animationRef = useRef<number>()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      const particleCount = 50
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speed: Math.random() * 1 + 0.5,
          size: Math.random() * 3 + 1,
        })
      }
      setParticles(newParticles)
    }

    const generateFallingElements = () => {
      const newElements = []
      const elementCount = weatherType === 'rainy' ? 200 : 100
      for (let i = 0; i < elementCount; i++) {
        newElements.push({
          id: Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          speed: Math.random() * 2 + 1,
          size: weatherType === 'rainy' ? Math.random() * 2 + 1 : Math.random() * 5 + 2,
          angle: Math.random() * Math.PI * 2,
        })
      }
      setFallingElements(newElements)
    }

    generateParticles()
    generateFallingElements()

    window.addEventListener('resize', generateParticles)
    window.addEventListener('resize', generateFallingElements)

    return () => {
      window.removeEventListener('resize', generateParticles)
      window.removeEventListener('resize', generateFallingElements)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [weatherType])

  useEffect(() => {
    const animate = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          y: (particle.y + particle.speed) % window.innerHeight,
        }))
      )

      setFallingElements((prevElements) =>
        prevElements.map((element) => ({
          ...element,
          y: (element.y + element.speed) % window.innerHeight,
          x: weatherType === 'snowy' ? (element.x + Math.sin(element.angle) * 0.5) % window.innerWidth : element.x,
          angle: weatherType === 'snowy' ? element.angle + 0.01 : element.angle,
        }))
      )

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [weatherType])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const drawThunderbolt = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.lineWidth = 2
      ctx.beginPath()
      let x = Math.random() * canvas.width
      let y = 0
      ctx.moveTo(x, y)
      while (y < canvas.height) {
        x += (Math.random() - 0.5) * 50
        y += Math.random() * 20 + 10
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (weatherType === 'thunderstorm' && Math.random() < 0.1) {
        drawThunderbolt()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [weatherType])

  const getBackgroundColor = () => {
    const getTemperatureColor = () => {
      if (temperature < 0) return 'from-blue-900 to-blue-700'
      if (temperature < 10) return 'from-blue-700 to-blue-500'
      if (temperature < 20) return 'from-green-500 to-blue-400'
      if (temperature < 30) return 'from-yellow-400 to-orange-300'
      return 'from-red-500 to-orange-400'
    }

    switch (weatherType) {
      case 'sunny':
        return `bg-gradient-to-b ${getTemperatureColor()} dark:from-blue-900 dark:to-blue-700`
      case 'cloudy':
        return `bg-gradient-to-b from-gray-300 to-gray-600 dark:from-gray-700 dark:to-gray-900`
      case 'rainy':
        return `bg-gradient-to-b from-blue-700 to-gray-800 dark:from-blue-900 dark:to-gray-900`
      case 'snowy':
        return `bg-gradient-to-b from-blue-100 to-blue-300 dark:from-blue-800 dark:to-blue-600`
      case 'thunderstorm':
        return `bg-gradient-to-b from-gray-700 to-gray-900 dark:from-gray-900 dark:to-black`
      default:
        return `bg-gradient-to-b ${getTemperatureColor()} dark:from-blue-900 dark:to-blue-700`
    }
  }

  const getFallingElementStyle = () => {
    switch (weatherType) {
      case 'rainy':
        return 'bg-blue-400 rounded-full'
      case 'snowy':
        return 'bg-white rounded-full'
      case 'thunderstorm':
        return 'bg-yellow-400 rounded-full'
      default:
        return 'hidden'
    }
  }

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden transition-colors duration-500 ${getBackgroundColor()}`}>
      <AnimatePresence>
        {theme === 'dynamic' && (
          <>
            {fallingElements.map((element) => (
              <motion.div
                key={element.id}
                className={`absolute ${getFallingElementStyle()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: element.y, x: element.x }}
                exit={{ opacity: 0, y: window.innerHeight + 10 }}
                transition={{ duration: element.speed, ease: 'linear', repeat: Infinity }}
                style={{
                  width: `${element.size}px`,
                  height: weatherType === 'rainy' ? `${element.size * 4}px` : `${element.size}px`,
                }}
              />
            ))}
          </>
        )}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-white"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              x: particle.x,
              y: particle.y,
              fontSize: `${particle.size}rem`,
            }}
          >
            {weatherType === 'sunny' && <Sun />}
            {weatherType === 'cloudy' && <Cloud />}
            {weatherType === 'rainy' && <CloudRain />}
            {weatherType === 'snowy' && <CloudSnow />}
            {weatherType === 'thunderstorm' && <CloudLightning />}
          </motion.div>
        ))}
      </AnimatePresence>
      <canvas ref={canvasRef} className="absolute inset-0" />
      {weatherType === 'snowy' && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-white text-9xl"
          >
            ☃️
          </motion.div>
        </div>
      )}
    </div>
  )
}

