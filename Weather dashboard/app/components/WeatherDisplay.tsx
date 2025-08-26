'use client'

import { motion } from 'framer-motion'
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiStrongWind, WiHumidity, WiThermometer } from 'react-icons/wi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import WeatherForecast from './WeatherForecast'
import ClothingSuggestions from './ClothingSuggestions'

type WeatherData = {
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
  }>
  wind: {
    speed: number
  }
  name: string
}

type WeatherDisplayProps = {
  weatherData: WeatherData | null
  apiKey: string
}

function getWeatherMessage(temp: number, weatherMain: string): string {
  if (temp > 30) return "It's a scorcher out there! Stay cool and hydrated."
  if (temp < 10) return "Bundle up! It's chilly outside."
  
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return "Perfect weather to enjoy the outdoors!"
    case 'clouds':
      return "A bit overcast, but still a great day for activities."
    case 'rain':
      return "Don't forget your umbrella! It's a bit wet out there."
    case 'snow':
      return "Winter wonderland alert! Time for some snow fun."
    case 'thunderstorm':
      return "Stay safe indoors. Mother Nature is putting on a light show!"
    default:
      return "Enjoy your day, whatever the weather!"
  }
}

export default function WeatherDisplay({ weatherData, apiKey }: WeatherDisplayProps) {
  if (!weatherData) {
    return (
      <Card className="bg-white bg-opacity-20 backdrop-blur-lg">
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            Search for a location to see weather information.
          </motion.p>
        </CardContent>
      </Card>
    )
  }

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear':
        return <WiDaySunny className="text-8xl text-yellow-500" />
      case 'clouds':
        return <WiCloudy className="text-8xl text-gray-500" />
      case 'rain':
      case 'drizzle':
        return <WiRain className="text-8xl text-blue-500" />
      case 'snow':
        return <WiSnow className="text-8xl text-blue-200" />
      case 'thunderstorm':
        return <WiThunderstorm className="text-8xl text-gray-700" />
      default:
        return <WiDaySunny className="text-8xl text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white bg-opacity-20 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Current Weather in {weatherData.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              {getWeatherIcon(weatherData.weather[0].main)}
              <div>
                <span className="text-6xl font-bold">{Math.round(weatherData.main.temp)}°C</span>
                <p className="text-xl mt-2 capitalize">{weatherData.weather[0].description}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <WiStrongWind className="text-3xl mr-2" />
                <span className="text-lg">{weatherData.wind.speed} m/s</span>
              </div>
              <div className="flex items-center">
                <WiHumidity className="text-3xl mr-2" />
                <span className="text-lg">{weatherData.main.humidity}%</span>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center text-xl font-semibold mt-4 p-4 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg"
      >
        {getWeatherMessage(Math.round(weatherData.main.temp), weatherData.weather[0].main)}
      </motion.div>

      <Card className="bg-white bg-opacity-20 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-bold">
            <WiThermometer className="mr-2" />
            Clothing Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-2"
          >
            {getClothingSuggestions(weatherData.main.temp, weatherData.weather[0].main, weatherData.wind.speed).map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start space-x-2"
              >
                <span className="text-lg">{item.emoji}</span>
                <div>
                  <p className="font-medium">{item.item}</p>
                  <p className="text-sm text-gray-600">{item.reason}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </CardContent>
      </Card>

      <WeatherForecast city={weatherData.name} apiKey={apiKey} />
    </div>
  )
}

function getClothingSuggestions(temperature: number, weatherMain: string, windSpeed: number): Array<{ emoji: string; item: string; reason: string }> {
  const suggestions: Array<{ emoji: string; item: string; reason: string }> = []

  if (temperature < 0) {
    suggestions.push(
      { emoji: '🧥', item: 'Heavy winter coat', reason: 'Protects against extreme cold' },
      { emoji: '🧦', item: 'Thermal underwear', reason: 'Provides base layer insulation' },
      { emoji: '🧤', item: 'Warm hat and gloves', reason: 'Prevents heat loss from head and hands' }
    )
  } else if (temperature < 10) {
    suggestions.push(
      { emoji: '🧥', item: 'Winter coat', reason: 'Suitable for cold temperatures' },
      { emoji: '🧶', item: 'Sweater', reason: 'Adds an extra layer of warmth' },
      { emoji: '🧦', item: 'Warm socks', reason: 'Keeps feet cozy in cold weather' }
    )
  } else if (temperature < 20) {
    suggestions.push(
      { emoji: '🧥', item: 'Light jacket or sweater', reason: 'Perfect for mild temperatures' },
      { emoji: '👕', item: 'Long-sleeved shirt', reason: 'Provides moderate coverage' }
    )
  } else if (temperature < 30) {
    suggestions.push(
      { emoji: '👕', item: 'T-shirt', reason: 'Comfortable in warm weather' },
      { emoji: '👖', item: 'Light pants or shorts', reason: 'Allows for air circulation' }
    )
  } else {
    suggestions.push(
      { emoji: '👚', item: 'Light, breathable clothing', reason: 'Helps stay cool in hot weather' },
      { emoji: '🩳', item: 'Shorts', reason: 'Ideal for high temperatures' },
      { emoji: '👒', item: 'Sunhat', reason: 'Protects from strong sun' }
    )
  }

  if (weatherMain.toLowerCase() === 'rain') {
    suggestions.push(
      { emoji: '☔', item: 'Raincoat or umbrella', reason: 'Keeps you dry in wet conditions' },
      { emoji: '👟', item: 'Waterproof shoes', reason: 'Prevents wet feet in rainy weather' }
    )
  }

  if (weatherMain.toLowerCase() === 'snow') {
    suggestions.push(
      { emoji: '🥾', item: 'Snow boots', reason: 'Provides traction and warmth in snowy conditions' },
      { emoji: '🧤', item: 'Waterproof gloves', reason: 'Keeps hands dry and warm in snow' }
    )
  }

  if (windSpeed > 20) {
    suggestions.push({ emoji: '🧣', item: 'Scarf or neck gaiter', reason: 'Protects against strong winds' })
  }

  return suggestions
}

