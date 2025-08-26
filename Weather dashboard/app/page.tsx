'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from 'next-themes'
import Header from './components/Header'
import WeatherSearch from './components/WeatherSearch'
import WeatherDisplay from './components/WeatherDisplay'
import SidePanel from './components/SidePanel'
import WeatherAlerts from './components/WeatherAlerts'
import AirQualityIndex from './components/AirQualityIndex'
import WeatherHistory from './components/WeatherHistory'
import DynamicWeatherBackground from './components/DynamicWeatherBackground'
import SavedLocations from './components/SavedLocations'
import AnimatedWeatherThemeToggle from './components/AnimatedWeatherThemeToggle'
import HistoricalWeatherComparison from './components/HistoricalWeatherComparison'
import WeatherImageGallery from './components/WeatherImageGallery'
import WeatherCalendar from './components/WeatherCalendar'
import WeatherBasedFood from './components/WeatherBasedFood'
import WeatherBasedFoodButton from './components/WeatherBasedFoodButton'
import WeatherToggleButton from './components/WeatherToggleButton'
import WeatherCalendarButton from './components/WeatherCalendarButton'
import { Toaster } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { Image, ArrowLeft, ArrowUp, Calendar } from 'lucide-react'

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
  sys: {
    sunrise: number
    sunset: number
    country: string
  }
  name: string
  rain?: {
    '1h': number
  }
  snow?: {
    '1h': number
  }
}

type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'thunderstorm'

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [weatherType, setWeatherType] = useState<WeatherType>('sunny')
  const [apiKey, setApiKey] = useState('')
  const [weatherTheme, setWeatherTheme] = useState<'default' | 'dynamic'>('default')
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showFoodSuggestions, setShowFoodSuggestions] = useState(false)
  const [showWeatherAnimation, setShowWeatherAnimation] = useState(true)
  const [showWeatherToggle, setShowWeatherToggle] = useState(true)

  const updateWeatherData = (data: WeatherData | null, key: string) => {
    setWeatherData(data)
    setWeatherType(getWeatherType(data?.weather[0].main ?? 'Clear'))
    setApiKey(key)
  }

  const handleSelectSavedLocation = async (location: string) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
      const data: WeatherData = await response.json()
      updateWeatherData(data, apiKey)
    } catch (error) {
      console.error('Error fetching weather data for saved location:', error)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen relative">
        <DynamicWeatherBackground 
          weatherType={weatherType} 
          temperature={weatherData?.main.temp ?? 20}
          theme={weatherTheme}
        />
        <div className="relative z-10">
          <Header
            onWeatherChange={setWeatherType}
            showWeatherToggle={showWeatherToggle}
            onToggleWeatherToggle={() => setShowWeatherToggle(!showWeatherToggle)}
          >
            <AnimatedWeatherThemeToggle
              theme={weatherTheme}
              onThemeChange={(newTheme) => setWeatherTheme(newTheme)}
            />
          </Header>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <div className="container mx-auto px-4 py-4">
              <WeatherToggleButton onWeatherChange={setWeatherType} />
            </div>
            <AnimatePresence mode="wait">
              {!showImageGallery && !showCalendar && !showFoodSuggestions ? (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3">
                          <WeatherSearch onWeatherUpdate={updateWeatherData} />
                        </div>
                      </div>
                      <WeatherDisplay weatherData={weatherData} apiKey={apiKey} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AirQualityIndex 
                          weatherCondition={weatherData?.weather[0].main ?? 'Clear'} 
                          temperature={weatherData?.main.temp ?? 20}
                        />
                        <WeatherHistory 
                          weatherCondition={weatherData?.weather[0].main ?? 'Clear'}
                          currentTemperature={weatherData?.main.temp ?? 20}
                        />
                      </div>
                    </div>
                    <div className="space-y-8">
                      <SavedLocations onSelectLocation={handleSelectSavedLocation} />
                      <WeatherCalendarButton
                        onClick={() => setShowCalendar(true)}
                        weatherData={weatherData}
                      />
                      <WeatherBasedFoodButton
                        onClick={() => setShowFoodSuggestions(true)}
                        weatherData={weatherData}
                      />
                      <SidePanel weatherData={weatherData} />
                      {weatherData && (
                        <HistoricalWeatherComparison
                          city={weatherData.name}
                          currentTemp={weatherData.main.temp}
                          currentRainfall={weatherData.rain?.['1h'] || 0}
                          currentSnowfall={weatherData.snow?.['1h'] || 0}
                          date={new Date().toISOString().split('T')[0]}
                          apiKey={apiKey}
                        />
                      )}
                      <WeatherAlerts weatherData={weatherData} />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8"
                      >
                        <Button 
                          onClick={() => setShowImageGallery(true)}
                          className="w-full py-6 text-lg font-semibold rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <Image className="h-6 w-6" />
                            <span>Explore Weather Image Gallery</span>
                          </div>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ) : showImageGallery ? (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button 
                    onClick={() => setShowImageGallery(false)}
                    className="mb-4 rounded-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                  <WeatherImageGallery />
                </motion.div>
              ) : showCalendar ? (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button 
                    onClick={() => setShowCalendar(false)}
                    className="mb-4 rounded-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                  <WeatherCalendar weatherData={weatherData} location={weatherData ? weatherData.name : ''} />
                </motion.div>
              ) : (
                <motion.div
                  key="food-suggestions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button 
                    onClick={() => setShowFoodSuggestions(false)}
                    className="mb-4 rounded-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                  <WeatherBasedFood weatherData={weatherData} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        <AnimatePresence>
          {showScrollButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <Button
                onClick={scrollToTop}
                className="rounded-full w-12 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ArrowUp className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

function getWeatherType(weatherMain: string): WeatherType {
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return 'sunny'
    case 'clouds':
      return 'cloudy'
    case 'rain':
    case 'drizzle':
      return 'rainy'
    case 'snow':
      return 'snowy'
    case 'thunderstorm':
      return 'thunderstorm'
    default:
      return 'sunny'
  }
}

