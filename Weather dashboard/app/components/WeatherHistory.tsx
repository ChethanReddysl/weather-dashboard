'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts'
import { Clock, Thermometer, ArrowUp, ArrowDown } from 'lucide-react'
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi'

type WeatherHistoryProps = {
  weatherCondition: string
  currentTemperature: number
}

type HistoryData = {
  time: string
  temperature: number
  condition: string
}

const WeatherIcons: { [key: string]: React.ElementType } = {
  Clear: WiDaySunny,
  Clouds: WiCloudy,
  Rain: WiRain,
  Snow: WiSnow,
}

export default function WeatherHistory({ weatherCondition, currentTemperature }: WeatherHistoryProps) {
  const [data, setData] = useState<HistoryData[]>([])

  useEffect(() => {
    setData(generateWeatherData(weatherCondition, currentTemperature))
  }, [weatherCondition, currentTemperature])

  const minTemp = Math.min(...data.map(d => d.temperature))
  const maxTemp = Math.max(...data.map(d => d.temperature))

  return (
    <Card className="bg-white bg-opacity-20 backdrop-blur-lg w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-sm font-medium">
          <Clock className="mr-2 h-4 w-4" />
          24-Hour Temperature History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#ffffff', fontSize: 12 }}
                stroke="#ffffff"
              />
              <YAxis 
                tick={{ fill: '#ffffff', fontSize: 12 }}
                stroke="#ffffff"
                domain={[Math.floor(minTemp) - 2, Math.ceil(maxTemp) + 2]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const WeatherIcon = WeatherIcons[data.condition] || WiDaySunny;
                    return (
                      <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
                        <p className="text-sm font-bold">{label}</p>
                        <p className="text-lg font-semibold">{`${data.temperature.toFixed(1)}°C`}</p>
                        <WeatherIcon className="text-4xl" />
                        <p className="text-xs">{data.condition}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={minTemp} stroke="rgba(59, 130, 246, 0.5)" strokeDasharray="3 3" />
              <ReferenceLine y={maxTemp} stroke="rgba(239, 68, 68, 0.5)" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#8884d8"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 flex justify-between items-center text-sm"
        >
          <div className="flex items-center">
            <ArrowDown className="mr-1 h-4 w-4 text-blue-500" />
            <span>Min: {minTemp.toFixed(1)}°C</span>
          </div>
          <div className="font-semibold">
            Current: {currentTemperature.toFixed(1)}°C
          </div>
          <div className="flex items-center">
            <ArrowUp className="mr-1 h-4 w-4 text-red-500" />
            <span>Max: {maxTemp.toFixed(1)}°C</span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

function generateWeatherData(weatherCondition: string, currentTemp: number): HistoryData[] {
  const data: HistoryData[] = []
  const now = new Date()
  const baseTemperature = currentTemp

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    let temperature = baseTemperature
    let condition = weatherCondition

    // Adjust temperature based on time of day and weather condition
    const hourOfDay = time.getHours()
    if (hourOfDay >= 0 && hourOfDay < 6) {
      temperature -= Math.random() * 3 + 1 // Cooler at night
    } else if (hourOfDay >= 12 && hourOfDay < 18) {
      temperature += Math.random() * 3 + 1 // Warmer during the day
    }

    // Add some randomness based on weather condition
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        temperature += Math.random() * 2 - 1
        break
      case 'clouds':
        temperature += Math.random() * 1.5 - 0.75
        condition = Math.random() > 0.7 ? 'Clear' : 'Clouds'
        break
      case 'rain':
        temperature -= Math.random() * 2
        condition = Math.random() > 0.8 ? 'Clouds' : 'Rain'
        break
      case 'snow':
        temperature -= Math.random() * 3
        condition = Math.random() > 0.9 ? 'Clouds' : 'Snow'
        break
    }

    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round(temperature * 10) / 10,
      condition
    })
  }

  return data
}

