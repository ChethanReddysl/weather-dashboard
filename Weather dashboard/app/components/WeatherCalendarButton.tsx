import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

type WeatherCalendarButtonProps = {
  onClick: () => void
  weatherData: {
    main: { temp: number }
    weather: [{ main: string }]
    name: string
  } | null
}

const WeatherCalendarButton: React.FC<WeatherCalendarButtonProps> = ({ onClick, weatherData }) => {
  const backgroundImage = "https://images.unsplash.com/photo-1530908295418-a12e326966ba?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer relative w-full h-48 rounded-lg overflow-hidden shadow-lg"
    >
      <Image
        src={backgroundImage}
        alt="Weather Calendar"
        layout="fill"
        objectFit="cover"
        className="transition-transform duration-300 hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center transition-opacity duration-300 hover:bg-opacity-40 p-4">
        {weatherData ? (
          <>
            <p className="text-white text-3xl font-bold text-center px-4 drop-shadow-lg mb-2">
              Weather Calendar for {weatherData.name}
            </p>
            <p className="text-white text-xl text-center px-4 drop-shadow-lg">
              {weatherData.main.temp.toFixed(1)}°C, {weatherData.weather[0].main}
            </p>
          </>
        ) : (
          <>
            <p className="text-white text-3xl font-bold text-center px-4 drop-shadow-lg mb-4">
              Enter a location to view Weather Calendar
            </p>
            <Button variant="outline" className="bg-white text-black hover:bg-gray-200">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default WeatherCalendarButton

