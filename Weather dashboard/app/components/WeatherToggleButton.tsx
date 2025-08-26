'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react'

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'thunderstorm'

interface WeatherToggleButtonProps {
  onWeatherChange: (weather: WeatherType) => void
}

const WeatherToggleButton: React.FC<WeatherToggleButtonProps> = ({ onWeatherChange }) => {
  const [activeWeather, setActiveWeather] = useState<WeatherType>('sunny')

  const handleWeatherChange = (weather: WeatherType) => {
    setActiveWeather(weather)
    onWeatherChange(weather)
  }

  const weatherIcons = [
    { type: 'sunny', icon: Sun, color: 'text-yellow-500' },
    { type: 'cloudy', icon: Cloud, color: 'text-gray-500' },
    { type: 'rainy', icon: CloudRain, color: 'text-blue-500' },
    { type: 'snowy', icon: CloudSnow, color: 'text-blue-200' },
    { type: 'thunderstorm', icon: CloudLightning, color: 'text-purple-500' },
  ]

  return (
    <div className="flex justify-center items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-lg rounded-full p-2">
      {weatherIcons.map(({ type, icon: Icon, color }) => (
        <motion.button
          key={type}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full ${activeWeather === type ? 'bg-primary' : 'bg-transparent'}`}
          onClick={() => handleWeatherChange(type as WeatherType)}
          aria-label={`Set weather to ${type}`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </motion.button>
      ))}
    </div>
  )
}

export default WeatherToggleButton

