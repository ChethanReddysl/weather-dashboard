'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BookmarkPlus, Search } from 'lucide-react'

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
  sys: {
    country: string
  }
  coord: {
    lat: number
    lon: number
  }
}

type WeatherSearchProps = {
  onWeatherUpdate: (data: WeatherData | null, apiKey: string) => void
}

export default function WeatherSearch({ onWeatherUpdate }: WeatherSearchProps) {
  const [search, setSearch] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [cityNotFound, setCityNotFound] = useState(false)

  useEffect(() => {
    setApiKey(process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'e160d1cc288c87f351bf02dff68a3ec9')
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey) {
      console.error('API key is missing')
      return
    }
    try {
      setCityNotFound(false)
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=metric`)
      if (!response.ok) {
        throw new Error('City not found')
      }
      const data: WeatherData = await response.json()
      console.log('Weather data:', data)
      setCurrentWeather(data)
      onWeatherUpdate(data, apiKey)
    } catch (error) {
      console.error('Error fetching weather data:', error)
      setCityNotFound(true)
      setCurrentWeather(null)
      onWeatherUpdate(null, apiKey)
    }
  }

  const saveLocation = () => {
    if (currentWeather) {
      const savedLocations = JSON.parse(localStorage.getItem('savedLocations') || '[]')
      const newLocation = {
        name: currentWeather.name,
        country: currentWeather.sys.country,
        lat: currentWeather.coord.lat,
        lon: currentWeather.coord.lon,
        lastUpdated: new Date().toISOString()
      }
      const updatedLocations = [newLocation, ...savedLocations.filter((loc: any) => loc.name !== newLocation.name)]
      localStorage.setItem('savedLocations', JSON.stringify(updatedLocations))
      window.dispatchEvent(new Event('storage'))
    }
  }

  const CityNotFoundMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mt-4 p-4 bg-red-100 text-red-700 rounded-lg"
    >
      <p className="text-lg font-semibold">City not found</p>
      <p className="text-sm">Please check the spelling or enter a valid city, state, or country.</p>
    </motion.div>
  )

  return (
    <Card className="bg-white bg-opacity-20 backdrop-blur-lg w-full h-full">
      <CardHeader>
        <CardTitle>Search Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter city, state, or country"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </form>
        {currentWeather && (
          <Button onClick={saveLocation} className="w-full mt-4 flex items-center justify-center">
            <BookmarkPlus className="mr-2" />
            Save Location
          </Button>
        )}
        {cityNotFound && <CityNotFoundMessage />}
      </CardContent>
    </Card>
  )
}

