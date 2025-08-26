'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowUp, ArrowDown, Droplets, Snowflake, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type HistoricalData = {
  year: number
  temperature: number
  rainfall: number
  snowfall: number
}

type HistoricalWeatherComparisonProps = {
  city: string
  currentTemp: number
  currentRainfall: number
  currentSnowfall: number
  date: string
  apiKey: string
}

export default function HistoricalWeatherComparison({
  city,
  currentTemp,
  currentRainfall,
  currentSnowfall,
  date,
  apiKey
}: HistoricalWeatherComparisonProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(true)
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false)
  const [contactInfo, setContactInfo] = useState('')
  const [contactType, setContactType] = useState<'email' | 'mobile'>('email')
  const [showNotReceivedAlert, setShowNotReceivedAlert] = useState(false)

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true)
      try {
        const mockData: HistoricalData[] = Array.from({ length: 5 }, (_, i) => ({
          year: new Date().getFullYear() - i - 1,
          temperature: currentTemp + Math.random() * 6 - 3,
          rainfall: Math.random() * 10,
          snowfall: Math.random() * 5,
        }))
        setHistoricalData(mockData)
      } catch (error) {
        console.error('Error fetching historical weather data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [city, currentTemp, apiKey, date])

  const calculateAverage = (data: number[]) => 
    data.reduce((sum, value) => sum + value, 0) / data.length

  const averageTemp = calculateAverage(historicalData.map(d => d.temperature))
  const averageRainfall = calculateAverage(historicalData.map(d => d.rainfall))
  const averageSnowfall = calculateAverage(historicalData.map(d => d.snowfall))

  const tempDifference = currentTemp - averageTemp
  const rainfallDifference = currentRainfall - averageRainfall
  const snowfallDifference = currentSnowfall - averageSnowfall

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const messageDelivered = Math.random() < 0.5

    if (messageDelivered) {
      let welcomeMessage = ''
      if (contactType === 'mobile') {
        welcomeMessage = `Welcome to Weather Dashboard! You've successfully subscribed to weather alerts. We'll send updates to ${contactInfo}. Stay informed about ${city}'s weather conditions. Reply STOP to unsubscribe.`
      } else {
        welcomeMessage = `Welcome to Weather Dashboard! You've successfully subscribed to weather alerts. We'll send updates to ${contactInfo}. Stay informed about ${city}'s weather conditions. Check your inbox for a confirmation email.`
      }
      
      toast({
        title: "Subscription Successful",
        description: welcomeMessage,
      })
    } else {
      setShowNotReceivedAlert(true)
    }

    setNotificationDialogOpen(false)
  }

  const handleResendNotification = () => {
    toast({
      title: "Notification Resent",
      description: "We've attempted to resend your welcome message. Please check your inbox or phone.",
    })
    setShowNotReceivedAlert(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Historical Weather Comparison</span>
          <Button variant="outline" size="sm" onClick={() => setNotificationDialogOpen(true)}>
            <Bell className="mr-2 h-4 w-4" />
            Get Notified
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading historical data...</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Temperature</span>
                <div className="flex items-center">
                  {tempDifference > 0 ? (
                    <ArrowUp className="text-red-500 mr-1" />
                  ) : (
                    <ArrowDown className="text-blue-500 mr-1" />
                  )}
                  <span className={tempDifference > 0 ? 'text-red-500' : 'text-blue-500'}>
                    {Math.abs(tempDifference).toFixed(1)}°C {tempDifference > 0 ? 'warmer' : 'cooler'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Rainfall</span>
                <div className="flex items-center">
                  <Droplets className="text-blue-500 mr-1" />
                  <span>{rainfallDifference.toFixed(1)}mm {rainfallDifference > 0 ? 'more' : 'less'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Snowfall</span>
                <div className="flex items-center">
                  <Snowflake className="text-blue-300 mr-1" />
                  <span>{snowfallDifference.toFixed(1)}cm {snowfallDifference > 0 ? 'more' : 'less'}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Compared to the average of the same date over the past 5 years.
              </p>
            </div>
          </motion.div>
        )}
        {showNotReceivedAlert && (
          <Alert className="mt-4">
            <AlertTitle>Notification Not Received</AlertTitle>
            <AlertDescription>
              It seems you didn't receive our welcome message. Would you like us to resend it?
              <Button variant="outline" size="sm" className="mt-2" onClick={handleResendNotification}>
                Resend Notification
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Weather Notifications</DialogTitle>
            <DialogDescription>
              Enter your email or mobile number to receive weather updates and alerts.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNotificationSubmit}>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={contactType === 'email' ? 'default' : 'outline'}
                  onClick={() => setContactType('email')}
                >
                  Email
                </Button>
                <Button
                  type="button"
                  variant={contactType === 'mobile' ? 'default' : 'outline'}
                  onClick={() => setContactType('mobile')}
                >
                  Mobile
                </Button>
              </div>
              <Input
                type={contactType === 'email' ? 'email' : 'tel'}
                placeholder={`Enter your ${contactType}`}
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Subscribe</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

