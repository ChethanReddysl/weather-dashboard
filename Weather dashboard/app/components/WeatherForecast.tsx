'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi'

type ForecastDay = {
  date: string
  temp: {
    min: number
    max: number
  }
  weather: string
  humidity: number
  windSpeed: number
}

type WeatherForecastProps = {
  city: string
  apiKey: string
}

export default function WeatherForecast({ city, apiKey }: WeatherForecastProps) {
  const [forecast, setForecast] = useState<ForecastDay[]>([])

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        )
        const data = await response.json()
        const dailyForecast = data.list
          .filter((_: any, index: number) => index % 8 === 0)
          .slice(0, 5)
          .map((day: any) => ({
            date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            temp: {
              min: Math.round(day.main.temp_min),
              max: Math.round(day.main.temp_max)
            },
            weather: day.weather[0].main,
            humidity: day.main.humidity,
            windSpeed: day.wind.speed
          }))
        setForecast(dailyForecast)
      } catch (error) {
        console.error('Error fetching forecast:', error)
      }
    }

    if (city && apiKey) {
      fetchForecast()
    }
  }, [city, apiKey])

  const getWeatherIcon = (weather: string) => {
    switch (weather.toLowerCase()) {
      case 'clear':
        return <WiDaySunny className="text-4xl text-yellow-500" />
      case 'clouds':
        return <WiCloudy className="text-4xl text-gray-500" />
      case 'rain':
        return <WiRain className="text-4xl text-blue-500" />
      case 'snow':
        return <WiSnow className="text-4xl text-blue-200" />
      case 'thunderstorm':
        return <WiThunderstorm className="text-4xl text-gray-700" />
      default:
        return <WiDaySunny className="text-4xl text-yellow-500" />
    }
  }

  return (
    <Card className="bg-white bg-opacity-20 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {forecast.map((day, index) => (
            <motion.div
              key={day.date}
              className="flex flex-col items-center p-2 rounded-lg bg-white bg-opacity-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="font-medium">{day.date}</span>
              {getWeatherIcon(day.weather)}
              <span className="text-lg font-bold mt-2">{day.temp.max}°C</span>
              <span className="text-sm">{day.temp.min}°C</span>
              <span className="text-sm mt-2">Humidity: {day.humidity}%</span>
              <span className="text-sm">Wind: {day.windSpeed} m/s</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

