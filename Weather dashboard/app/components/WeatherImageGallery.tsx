'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const weatherImages = [
  { 
    src: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3Vubnl8ZW58MHx8MHx8fDA%3D', 
    alt: 'Sunny day', 
    description: 'A beautiful sunny day with clear blue skies',
    quote: "Wherever you go, no matter what the weather, always bring your own sunshine."
  },
  { 
    src: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFpbnl8ZW58MHx8MHx8fDA%3D', 
    alt: 'Rainy day', 
    description: 'A rainy day with dark clouds and wet streets',
    quote: "The best thing one can do when it's raining is to let it rain."
  },
  { 
    src: 'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25vd3klMjBsYW5kc2NhcGV8ZW58MHx8MHx8fDA%3D', 
    alt: 'Snowy landscape', 
    description: 'A serene snowy landscape with pristine white fields',
    quote: "To appreciate the beauty of a snowflake, it is necessary to stand out in the cold."
  },
  { 
    src: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGh1bmRlcnN0b3JtfGVufDB8fDB8fHww', 
    alt: 'Thunderstorm', 
    description: 'A dramatic thunderstorm with lightning illuminating the sky',
    quote: "The sound of thunder reminds us of the power of nature."
  },
  { 
    src: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9nZ3klMjBtb3JuaW5nfGVufDB8fDB8fHww', 
    alt: 'Foggy morning', 
    description: 'A misty foggy morning in the countryside with limited visibility',
    quote: "In the fog of uncertainty, every step is a leap of faith."
  },
  {
    src: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXV0dW1uJTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D',
    alt: 'Autumn weather',
    description: 'A colorful autumn scene with falling leaves',
    quote: "Autumn shows us how beautiful it is to let things go."
  },
  {
    src: 'https://images.unsplash.com/photo-1581059729226-c493d3086748?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3ByaW5nJTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D',
    alt: 'Spring weather',
    description: 'A vibrant spring day with blooming flowers',
    quote: "Spring: a lovely reminder of how beautiful change can truly be."
  },
  {
    src: 'https://images.unsplash.com/photo-1600377927594-ceae8f8981a6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D',
    alt: 'Hot summer day',
    description: 'A scorching hot summer day with visible heat waves',
    quote: "A perfect summer day is when the sun is shining, the breeze is blowing, the birds are singing, and the lawn mower is broken."
  },
  {
    src: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29sZCUyMHdlYXRoZXJ8ZW58MHx8MHx8fDA%3D',
    alt: 'Cold winter day',
    description: 'A frigid winter day with frost-covered trees',
    quote: "What good is the warmth of summer, without the cold of winter to give it sweetness."
  },
  {
    src: 'https://images.unsplash.com/photo-1572272195904-f64d9c02c5b5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2luZHklMjB3ZWF0aGVyfGVufDB8fDB8fHww',
    alt: 'Windy day',
    description: 'A blustery day with trees bending in the strong wind',
    quote: "The wind shows us how close to the edge we are."
  },
  {
    src: 'https://images.unsplash.com/photo-1520609798519-2e1e8c18df3a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFpbHN0b3JtfGVufDB8fDB8fHww',
    alt: 'Hailstorm',
    description: 'A severe hailstorm with large hailstones',
    quote: "Nature's way of giving you a massage: a hailstorm."
  },
  {
    src: 'https://images.unsplash.com/photo-1595674637483-2e9b3ebb2c2e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHVzdCUyMHN0b3JtfGVufDB8fDB8fHww',
    alt: 'Dust storm',
    description: 'A massive dust storm engulfing the landscape',
    quote: "In the midst of a dust storm, remember that even the air we breathe tells a story of the earth's journey."
  },
  {
    src: 'https://images.unsplash.com/photo-1520875777965-f99b6d5b3b98?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFpbmJvd3xlbnwwfHwwfHx8MA%3D%3D',
    alt: 'Rainbow after rain',
    description: 'A beautiful rainbow arching across the sky after a rainstorm',
    quote: "Be a rainbow in someone else's cloud."
  },
  {
    src: 'https://images.unsplash.com/photo-1516490981167-dc990a242afe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxpenphcmR8ZW58MHx8MHx8fDA%3D',
    alt: 'Blizzard',
    description: 'A fierce blizzard with heavy snowfall and strong winds',
    quote: "In the heart of a blizzard, we find the warmth of resilience."
  }
]

export default function WeatherImageGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextImage = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % weatherImages.length)
  }

  const prevImage = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + weatherImages.length) % weatherImages.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage()
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      }
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      }
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Weather Image Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] overflow-hidden rounded-lg">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full h-full"
            >
              <Image
                src={weatherImages[currentIndex].src}
                alt={weatherImages[currentIndex].alt}
                layout="fill"
                objectFit="cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-75"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-75"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4 text-center space-y-2"
        >
          <p className="font-semibold">{weatherImages[currentIndex].description}</p>
          <p className="italic text-sm text-gray-600">"{weatherImages[currentIndex].quote}"</p>
        </motion.div>
      </CardContent>
    </Card>
  )
}

