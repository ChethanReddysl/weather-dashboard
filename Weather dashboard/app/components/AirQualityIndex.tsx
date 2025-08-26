'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Wind, Droplets, Sun, AlertTriangle } from 'lucide-react'

type AirQualityData = {
  aqi: number
  mainPollutant: string
  level: string
  pollutants: {
    [key: string]: number
  }
}

type AirQualityIndexProps = {
  weatherCondition: string
  temperature: number
}

export default function AirQualityIndex({ weatherCondition, temperature }: AirQualityIndexProps) {
  const [aqi, setAqi] = useState<AirQualityData | null>(null)

  useEffect(() => {
    // Mock AQI data generation (replace with actual API call in production)
    const mockAqi = Math.floor(Math.random() * 300) + 1
    const getLevel = (value: number) => {
      if (value <= 50) return 'Good'
      if (value <= 100) return 'Moderate'
      if (value <= 150) return 'Unhealthy for Sensitive Groups'
      if (value <= 200) return 'Unhealthy'
      if (value <= 300) return 'Very Unhealthy'
      return 'Hazardous'
    }
    const getMockPollutant = () => {
      const pollutants = ['PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'CO']
      return pollutants[Math.floor(Math.random() * pollutants.length)]
    }
    setAqi({
      aqi: mockAqi,
      mainPollutant: getMockPollutant(),
      level: getLevel(mockAqi),
      pollutants: {
        PM25: Math.random() * 500,
        PM10: Math.random() * 600,
        O3: Math.random() * 200,
        NO2: Math.random() * 200,
        SO2: Math.random() * 500,
        CO: Math.random() * 50,
      }
    })
  }, [weatherCondition, temperature])

  const getAqiColor = (level: string) => {
    switch (level) {
      case 'Good': return 'bg-green-500'
      case 'Moderate': return 'bg-yellow-500'
      case 'Unhealthy for Sensitive Groups': return 'bg-orange-500'
      case 'Unhealthy': return 'bg-red-500'
      case 'Very Unhealthy': return 'bg-purple-500'
      case 'Hazardous': return 'bg-maroon-500'
      default: return 'bg-gray-500'
    }
  }

  const getWeatherIcon = () => {
    switch (weatherCondition.toLowerCase()) {
      case 'clear': return <Sun className="h-6 w-6 text-yellow-400" />
      case 'clouds': return <Wind className="h-6 w-6 text-gray-400" />
      case 'rain': return <Droplets className="h-6 w-6 text-blue-400" />
      default: return <Wind className="h-6 w-6 text-gray-400" />
    }
  }

  return (
    <Card className="bg-white bg-opacity-20 backdrop-blur-lg w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Air Quality Index</CardTitle>
        {getWeatherIcon()}
      </CardHeader>
      <CardContent>
        {aqi ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
              <motion.div
                className={`absolute top-0 left-0 h-full ${getAqiColor(aqi.level)}`}
                initial={{ width: 0 }}
                animate={{ width: `${(aqi.aqi / 500) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className={`text-3xl font-bold mb-2 ${getAqiColor(aqi.level).replace('bg-', 'text-')}`}>
              {aqi.aqi}
            </div>
            <p className="text-lg font-semibold mb-4">{aqi.level}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(aqi.pollutants).map(([pollutant, value]) => (
                <div key={pollutant} className="flex justify-between items-center">
                  <span>{pollutant}:</span>
                  <span className="font-semibold">{value.toFixed(1)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-left">
              <p className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                Main pollutant: {aqi.mainPollutant}
              </p>
              <p className="mt-1">
                Temperature: {temperature}°C | Weather: {weatherCondition}
              </p>
            </div>
          </motion.div>
        ) : (
          <p className="text-center">Loading air quality data...</p>
        )}
      </CardContent>
    </Card>
  )
}

