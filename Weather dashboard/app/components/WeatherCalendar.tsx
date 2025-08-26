'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sun, Cloud, CloudRain, Snowflake, ArrowLeft, Sunrise, Sunset, Wind, Droplets, Thermometer, Check, MapPin, Search } from 'lucide-react'
import Image from 'next/image'
import { toast } from '@/components/ui/use-toast'
import { useSpring, animated } from 'react-spring'

type WeatherData = {
  main: {
    temp: number
    humidity: number
    pressure: number
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
  }
}

type WeatherCalendarProps = {
  weatherData: WeatherData | null
  location: string
}

type CalendarDay = {
  date: Date
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
  completed: boolean
  note: string
  temperature: number
  humidity: number
  windSpeed: number
  sunrise: number
  sunset: number
  hourlyForecast: Array<{ 
    time: string
    temp: number
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
    icon: React.ReactNode
  }>
  workCompleted: string
}

type Season = {
  name: string
  months: string
  icon: React.ReactNode
  color: string
  startDate: string
  endDate: string
}

const WeatherCalendar: React.FC<WeatherCalendarProps> = ({ weatherData, location }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<CalendarDay | null>(null)
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
  const [taskNote, setTaskNote] = useState('')
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null)
  const [hasSnowfall, setHasSnowfall] = useState<boolean>(false)

  const seasons: Season[] = [
    { name: 'Spring', months: 'Mar - May', icon: <Sun className="h-8 w-8 text-yellow-500" />, color: 'bg-green-100', startDate: 'March 20', endDate: 'June 20' },
    { name: 'Summer', months: 'Jun - Aug', icon: <Sun className="h-8 w-8 text-orange-500" />, color: 'bg-yellow-100', startDate: 'June 21', endDate: 'September 22' },
    { name: 'Autumn', months: 'Sep - Nov', icon: <Cloud className="h-8 w-8 text-orange-300" />, color: 'bg-orange-100', startDate: 'September 23', endDate: 'December 20' },
    { name: 'Winter', months: 'Dec - Feb', icon: <Snowflake className="h-8 w-8 text-blue-300" />, color: 'bg-blue-100', startDate: 'December 21', endDate: 'March 19' },
    { name: 'Monsoon', months: 'Jul - Sep', icon: <CloudRain className="h-8 w-8 text-blue-500" />, color: 'bg-blue-200', startDate: 'July 1', endDate: 'September 30' },
  ]

  useEffect(() => {
    if (location) {
      const days = getDaysInMonth(selectedYear, currentDate.getMonth())
      setCalendarDays(days)
      setHasSnowfall(location.toLowerCase().includes('moscow') || location.toLowerCase().includes('oslo') || location.toLowerCase().includes('helsinki') || location.toLowerCase().includes('stockholm') || location.toLowerCase().includes('reykjavik'))
    }
  }, [location, currentDate, selectedYear, weatherData])

  const getDaysInMonth = (year: number, month: number): CalendarDay[] => {
    const date = new Date(year, month, 1)
    const days: CalendarDay[] = []

    while (date.getMonth() === month) {
      days.push({
        date: new Date(date),
        weather: getRandomWeather(),
        completed: completedTasks.includes(`${date.toDateString()}-${selectedYear}`),
        note: '',
        temperature: Math.round(10 + Math.random() * 25),
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 20),
        sunrise: date.setHours(6, 0, 0, 0),
        sunset: date.setHours(20, 0, 0, 0),
        hourlyForecast: Array.from({ length: 24 }, (_, i) => ({
          time: `${i.toString().padStart(2, '0')}:00`,
          temp: Math.round(15 + Math.random() * 10),
          condition: getRandomWeather(),
          icon: getWeatherIcon(getRandomWeather())
        })),
        workCompleted: ''
      })
      date.setDate(date.getDate() + 1)
    }

    return days
  }

  const getRandomWeather = (): 'sunny' | 'cloudy' | 'rainy' | 'snowy' => {
    const weathers: ('sunny' | 'cloudy' | 'rainy' | 'snowy')[] = ['sunny', 'cloudy', 'rainy']
    if (hasSnowfall) weathers.push('snowy')
    return weathers[Math.floor(Math.random() * weathers.length)]
  }

  const toggleDayCompletion = (day: CalendarDay) => {
    const taskId = `${day.date.toDateString()}-${selectedYear}`
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
    setCalendarDays(prevDays => 
      prevDays.map(d => 
        d.date.toDateString() === day.date.toDateString() 
          ? { ...d, completed: !d.completed, workCompleted: d.completed ? '' : d.workCompleted } 
          : d
      )
    )
    if (!day.completed) {
      setSelectedDate(day)
      setTaskNote(day.workCompleted || '')
    }
  }

  const getWeatherIcon = (weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy') => {
    switch (weather) {
      case 'sunny':
        return <Sun className="h-4 w-4 text-yellow-500" />
      case 'cloudy':
        return <Cloud className="h-4 w-4 text-gray-500" />
      case 'rainy':
        return <CloudRain className="h-4 w-4 text-blue-500" />
      case 'snowy':
        return hasSnowfall ? <Snowflake className="h-4 w-4 text-blue-200" /> : <Cloud className="h-4 w-4 text-gray-500" />
    }
  }

  const getWeatherColor = (weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy') => {
    switch (weather) {
      case 'sunny':
        return 'bg-gradient-to-br from-yellow-300 to-orange-400'
      case 'cloudy':
        return 'bg-gradient-to-br from-gray-300 to-gray-400'
      case 'rainy':
        return 'bg-gradient-to-br from-blue-300 to-blue-500'
      case 'snowy':
        return hasSnowfall ? 'bg-gradient-to-br from-blue-100 to-gray-200' : 'bg-gradient-to-br from-gray-300 to-gray-400'
    }
  }

  const handleDateSelect = (day: CalendarDay) => {
    setSelectedDate(day)
    setTaskNote(day.workCompleted)
  }

  const handleSeasonSelect = (season: Season) => {
    setSelectedSeason(season)
  }

  const handleSaveNote = () => {
    if (selectedDate) {
      setCalendarDays(prevDays =>
        prevDays.map(d =>
          d.date.toDateString() === selectedDate.date.toDateString()
            ? { ...d, workCompleted: taskNote, completed: true }
            : d
        )
      )
      setSelectedDate(null)
      toast({
        title: "Work Completed",
        description: "Your task has been marked as completed for this day.",
      })
    }
  }


  const animatedTemp = useSpring({
    temperature: weatherData?.main.temp || 0,
    from: { temperature: 0 },
  })

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <AnimatePresence mode="wait">
        {!selectedDate && !selectedSeason ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-3/4"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex justify-between items-center">
                  <span>Weather Calendar - {currentDate.toLocaleString('default', { month: 'long' })}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center mb-4">
                  <animated.div className="text-4xl font-bold">
                    {animatedTemp.temperature.to(t => `${t.toFixed(1)}°C`)}
                  </animated.div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => setSelectedYear(parseInt(value))}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex space-x-2">
                    <Button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
                      Previous Month
                    </Button>
                    <Button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
                      Next Month
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-xs py-2 bg-gray-100 rounded-t-lg">{day}</div>
                  ))}
                  {calendarDays.map((day, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.01 }}
                      className={`p-1 rounded-lg ${getWeatherColor(day.weather)} relative cursor-pointer hover:shadow-lg transition-shadow duration-200 ${day.completed ? 'ring-2 ring-green-500' : ''}`}
                      onClick={() => handleDateSelect(day)}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      <div className="flex flex-col items-center justify-between h-full">
                        <span className="font-semibold text-xs">{day.date.getDate()}</span>
                        <motion.div 
                          className="my-1"
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                          {getWeatherIcon(day.weather)}
                        </motion.div>
                        <span className="text-[10px]">{day.temperature}°C</span>
                      </div>
                      {day.completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5"
                        >
                          <Check className="h-3 w-3 text-white" />
                        </motion.div>
                      )}
                      {hoveredDay === day && day.completed && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-full ml-2 bg-white p-2 rounded-md shadow-md z-10 w-48"
                        >
                          <p className="text-sm font-medium">Completed Work:</p>
                          <p className="text-xs">{day.workCompleted || 'No details provided'}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg shadow-lg"
                >
                  <h3 className="text-lg font-semibold mb-2">Weather Tip of the Day</h3>
                  <p className="text-sm">{getWeatherTip(weatherData?.weather[0].main)}</p>
                </motion.div>
                {completedTasks.length > 0 && (
                  <Card className="mt-4 p-4 bg-green-100">
                    <CardTitle className="text-lg mb-2">Completed Tasks</CardTitle>
                    <p>You have completed tasks on {completedTasks.length} day(s) in {selectedYear}.</p>
                  </Card>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : selectedDate ? (
          <motion.div
            key="selected-date"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-3/4"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex justify-between items-center">
                  <span>Weather Details - {selectedDate.date.toDateString()}</span>
                  <Button variant="outline" onClick={() => setSelectedDate(null)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Calendar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Thermometer className="h-6 w-6 mr-2 text-red-500" />
                      <span>Temperature: {selectedDate.temperature}°C</span>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="h-6 w-6 mr-2 text-blue-500" />
                      <span>Humidity: {selectedDate.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="h-6 w-6 mr-2 text-gray-500" />
                      <span>Wind Speed: {selectedDate.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center">
                      <Sunrise className="h-6 w-6 mr-2 text-orange-500" />
                      <span>Sunrise: {new Date(selectedDate.sunrise).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Sunset className="h-6 w-6 mr-2 text-purple-500" />
                      <span>Sunset: {new Date(selectedDate.sunset).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center">
                      {getWeatherIcon(selectedDate.weather)}
                      <span className="ml-2 capitalize">{selectedDate.weather}</span>
                    </div>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>24-Hour Weather History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-6 gap-2">
                        {selectedDate.hourlyForecast.map((hour, index) => (
                          <div key={index} className="text-center p-2 bg-white bg-opacity-20 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                            <p className="text-xs font-semibold">{hour.time}</p>
                            <div className="flex justify-center my-1">{hour.icon}</div>
                            <p className="text-sm">{hour.temp}°C</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Completed Work</h3>
                    <Textarea
                      value={taskNote}
                      onChange={(e) => setTaskNote(e.target.value)}
                      placeholder="Enter your completed work here..."
                      rows={4}
                    />
                    <Button onClick={handleSaveNote}>Save Completed Work</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="selected-season"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-3/4"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex justify-between items-center">
                  <span>{selectedSeason?.name} Season</span>
                  <Button variant="outline" onClick={() => setSelectedSeason(null)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Calendar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={getSeasonImage(selectedSeason?.name)}
                      alt={selectedSeason?.name || 'Season'}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-6xl mb-4">
                          {selectedSeason?.icon}
                        </div>
                        <h2 className="text-4xl font-bold mb-2">{selectedSeason?.name}</h2>
                        <p className="text-xl">{selectedSeason?.months}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white bg-opacity-70">
                      <CardHeader>
                        <CardTitle>Season Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p><span className="font-semibold">Start Date:</span> {selectedSeason?.startDate}</p>
                        <p><span className="font-semibold">End Date:</span> {selectedSeason?.endDate}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white bg-opacity-70">
                      <CardHeader>
                        <CardTitle>Typical Weather</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg">{getSeasonDescription(selectedSeason?.name)}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="bg-white bg-opacity-70">
                    <CardHeader>
                      <CardTitle>Season Highlights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {getSeasonHighlights(selectedSeason?.name).map((highlight, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="text-2xl">{highlight.icon}</div>
                            <p>{highlight.text}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <Card className="w-full md:w-1/4 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">Seasons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {seasons.map((season) => (
              <motion.div
                key={season.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedSeason?.name === season.name ? 'bg-primary text-primary-foreground' : 'bg-white bg-opacity-70'
                  }`}
                  onClick={() => handleSeasonSelect(season)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{season.name}</h3>
                      <p className="text-sm">{season.months}</p>
                    </div>
                    <div className="text-4xl">
                      {season.icon}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getSeasonDescription(seasonName: string | undefined): string {
  switch (seasonName) {
    case 'Spring':
      return 'Mild temperatures with occasional rain showers. Flora begins to bloom.'
    case 'Summer':
      return 'Warm to hot temperatures with long daylight hours. Occasional thunderstorms.'
    case 'Autumn':
      return 'Cooling temperatures with changing foliage colors. Increased chance of rain.'
    case 'Winter':
      return 'Cold temperatures with possible snow and frost. Shorter daylight hours.'
    case 'Monsoon':
      return 'Heavy rainfall, high humidity, and occasional flooding. Lush green landscapes.'
    default:
      return 'Varied weather conditions throughout the year.'
  }
}

function getSeasonImage(seasonName: string | undefined): string {
  switch (seasonName) {
    case 'Spring':
      return "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
    case 'Summer':
      return "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
    case 'Autumn':
      return "https://images.unsplash.com/photo-1507371341162-763b5e419408?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
    case 'Winter':
      return "https://images.unsplash.com/photo-1457269449834-928af64c684d?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
    case 'Monsoon':
      return "https://images.unsplash.com/photo-1428592953211-077101b2021b?auto=format&fit=crop&q=80&w=1474&ixlib=rb-4.0.3"
    default:
      return "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
  }
}

function getSeasonHighlights(seasonName: string | undefined): { icon: string; text: string }[] {
  switch (seasonName) {
    case 'Spring':
      return [
        { icon: '🌸', text: 'Cherry blossoms' },
        { icon: '🐣', text: 'Baby animals' },
        { icon: '🌱', text: 'New growth' },
        { icon: '🌈', text: 'Rainbows' }
      ]
    case 'Summer':
      return [
        { icon: '🏖️', text: 'Beach days' },
        { icon: '🍉', text: 'Fresh fruits' },
        { icon: '☀️', text: 'Long daylight hours' },
        { icon: '🏊', text: 'Swimming' }
      ]
    case 'Autumn':
      return [
        { icon: '🍁', text: 'Colorful foliage' },
        { icon: '🎃', text: 'Festivals' },
        { icon: '🍎', text: 'Apple picking' },
        { icon: '🥧', text: 'Cozy baking' }
      ]
    case 'Winter':
      return [
        { icon: '❄️', text: 'Frosty mornings' },
        { icon: '🧣', text: 'Cozy clothing' },
        { icon: '☕', text: 'Hot beverages' },
        { icon: '🎄', text: 'Festive decorations' }
      ]
    case 'Monsoon':
      return [
        { icon: '☔', text: 'Umbrella weather' },
        { icon: '🌿', text: 'Lush greenery' },
        { icon: '🌊', text: 'Full rivers' },
        { icon: '🍵', text: 'Hot chai' }
      ]
    default:
      return []
  }
}

function getWeatherTip(weatherMain: string | undefined): string {
  switch (weatherMain?.toLowerCase()) {
    case 'clear':
      return "It's a beautiful day! Don't forget your sunscreen and stay hydrated."
    case 'clouds':
      return "Partly cloudy skies ahead. Perfect weather for outdoor activities!"
    case 'rain':
      return "Don't forget your umbrella today. Stay dry out there!"
    case 'snow':
      return "Bundle up and be careful on the roads. Hot cocoa weather!"
    default:
      return "Always be prepared for changing weather conditions."
  }
}

export default WeatherCalendar

