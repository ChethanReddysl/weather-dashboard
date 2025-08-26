'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { WiStormWarning } from 'react-icons/wi'
import { AlertCircle, Umbrella, Wind, Thermometer, Sun, Droplets, Snowflake } from 'lucide-react'

type WeatherAlertsProps = {
  weatherData: {
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
  } | null
}

type ActionableAlert = {
  title: string
  description: string
  icon: React.ReactNode
  tips: string[]
}

export default function WeatherAlerts({ weatherData }: WeatherAlertsProps) {
  const [alerts, setAlerts] = useState<ActionableAlert[]>([])

  useEffect(() => {
    if (weatherData) {
      const newAlerts = generateActionableAlerts(weatherData)
      setAlerts(newAlerts)
    }
  }, [weatherData])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-bold text-primary">
          <WiStormWarning className="mr-2 text-red-500" />
          Weather Alerts for {weatherData?.name}, {weatherData?.sys.country}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <Alert key={index} variant="destructive" className="mb-2">
                <AlertTitle className="flex items-center">
                  {alert.icon}
                  <span className="ml-2">{alert.title}</span>
                </AlertTitle>
                <AlertDescription>
                  <p>{alert.description}</p>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    {alert.tips.map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            ))
          ) : (
            <p>No current weather alerts for {weatherData?.name}.</p>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}

function generateActionableAlerts(weatherData: WeatherAlertsProps['weatherData']): ActionableAlert[] {
  if (!weatherData) return []

  const alerts: ActionableAlert[] = []
  const { main: { temp, humidity }, weather, wind, name } = weatherData
  const weatherCondition = weather[0].main.toLowerCase()

  // Temperature-based alerts
  if (temp > 35) {
    alerts.push({
      title: 'Extreme Heat',
      description: `Dangerous heat conditions in ${name}.`,
      icon: <Sun className="h-5 w-5 text-red-500" />,
      tips: [
        'Stay indoors in air-conditioned areas',
        'Drink plenty of water, even if not thirsty',
        'Wear lightweight, light-colored clothing',
        'Avoid strenuous activities during peak hours'
      ]
    })
  } else if (temp > 30) {
    alerts.push({
      title: 'High Temperature',
      description: `Very warm conditions in ${name}.`,
      icon: <Thermometer className="h-5 w-5 text-orange-500" />,
      tips: [
        'Stay hydrated with cool drinks',
        'Seek shade when outdoors',
        'Use sunscreen and wear a hat',
        'Check on elderly neighbors and those with health conditions'
      ]
    })
  } else if (temp < 0) {
    alerts.push({
      title: 'Freezing Temperatures',
      description: `Very cold conditions in ${name}.`,
      icon: <Thermometer className="h-5 w-5 text-blue-500" />,
      tips: [
        'Dress in warm layers',
        'Protect exposed skin when outside',
        'Keep your home heated',
        'Check on vulnerable neighbors'
      ]
    })
  }

  // Weather condition-based alerts
  switch (weatherCondition) {
    case 'thunderstorm':
      alerts.push({
        title: 'Thunderstorm Warning',
        description: `Thunderstorms expected in ${name}.`,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        tips: [
          'Stay indoors and away from windows',
          'Unplug electronic devices',
          'Avoid using landline phones',
          'If outside, seek shelter immediately'
        ]
      })
      break
    case 'rain':
      alerts.push({
        title: 'Rain Alert',
        description: `Rainy conditions in ${name}.`,
        icon: <Umbrella className="h-5 w-5 text-blue-500" />,
        tips: [
          'Carry an umbrella or raincoat',
          'Drive carefully on wet roads',
          'Check for any flood warnings in your area',
          'Ensure proper drainage around your home'
        ]
      })
      break
    case 'snow':
      alerts.push({
        title: 'Snowfall Alert',
        description: `Snowy conditions in ${name}.`,
        icon: <Snowflake className="h-5 w-5 text-blue-300" />,
        tips: [
          'Drive slowly and maintain a safe distance',
          'Clear snow from walkways and driveways',
          'Dress warmly and in layers',
          'Be cautious of ice under the snow'
        ]
      })
      break
  }

  // Wind-based alerts
  if (wind.speed > 15) {
    alerts.push({
      title: 'Strong Winds',
      description: `High winds expected in ${name}.`,
      icon: <Wind className="h-5 w-5 text-yellow-500" />,
      tips: [
        'Secure outdoor furniture and decorations',
        'Close and lock all windows and doors',
        'Park vehicles away from trees if possible',
        'Be cautious of falling branches or debris when outside'
      ]
    })
  }

  // Humidity-based alerts
  if (humidity > 80 && temp > 25) {
    alerts.push({
      title: 'High Humidity',
      description: `Very humid conditions in ${name}.`,
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      tips: [
        'Stay in air-conditioned areas when possible',
        'Drink plenty of water to stay hydrated',
        'Wear light, breathable clothing',
        'Limit strenuous outdoor activities'
      ]
    })
  }

  return alerts
}

