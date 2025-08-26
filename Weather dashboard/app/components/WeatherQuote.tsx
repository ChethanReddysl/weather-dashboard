import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'

type WeatherQuoteProps = {
  weatherCondition: string
}

const weatherQuotes: Record<string, string[]> = {
  Clear: [
    "Sunshine is a welcome thing. It brings a lot of brightness.",
    "A sunny day is like a sunny mood. It shines brightly.",
    "Keep your face always toward the sunshine - and shadows will fall behind you."
  ],
  Clouds: [
    "The sky and the strong wind have moved the tree to talk.",
    "Clouds come floating into my life, no longer to carry rain or usher storm, but to add color to my sunset sky.",
    "Even when clouds grow thick, the sun still pours its light earthward."
  ],
  Rain: [
    "The best thing one can do when it's raining is to let it rain.",
    "Some people feel the rain. Others just get wet.",
    "Rain is grace; rain is the sky descending to the earth; without rain, there would be no life."
  ],
  Snow: [
    "The first fall of snow is not only an event, it is a magical event.",
    "Snowflakes are one of nature's most fragile things, but just look what they can do when they stick together.",
    "To appreciate the beauty of a snowflake, it is necessary to stand out in the cold."
  ],
  Thunderstorm: [
    "The sound of thunder reminds us of the power of nature.",
    "Thunderstorms are as much our friends as the sunshine.",
    "The sky was dark and gloomy, the air was humid and heavy, but somehow I felt excited, exhilarated. Another adventure was about to begin."
  ]
}

const WeatherQuote: React.FC<WeatherQuoteProps> = ({ weatherCondition }) => {
  const quotes = weatherQuotes[weatherCondition] || weatherQuotes.Clear
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <Card>
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start space-x-4"
        >
          <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
          <p className="text-lg italic">{randomQuote}</p>
        </motion.div>
      </CardContent>
    </Card>
  )
}

export default WeatherQuote

