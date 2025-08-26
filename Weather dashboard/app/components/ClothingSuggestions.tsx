import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

type ClothingSuggestionsProps = {
  temperature: number
  weatherMain: string
  windSpeed: number
}

export default function ClothingSuggestions({ temperature, weatherMain, windSpeed }: ClothingSuggestionsProps) {
  const suggestions = getClothingSuggestions(temperature, weatherMain, windSpeed)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Clothing Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-2"
        >
          {suggestions.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start space-x-2"
            >
              <span className="text-lg font-semibold">{item.emoji}</span>
              <div>
                <p className="font-medium">{item.item}</p>
                <p className="text-sm text-gray-600">{item.reason}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </CardContent>
    </Card>
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

