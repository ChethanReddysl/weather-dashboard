'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Trash2, Sunrise, Sunset } from 'lucide-react'

type SavedLocation = {
  name: string
  country: string
  lat: number
  lon: number
  lastUpdated: string
  sunrise: number
  sunset: number
}

type SavedLocationsProps = {
  onSelectLocation: (location: string) => void
}

export default function SavedLocations({ onSelectLocation }: SavedLocationsProps) {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([])

  useEffect(() => {
    const loadSavedLocations = () => {
      const storedLocations = localStorage.getItem('savedLocations')
      if (storedLocations) {
        setSavedLocations(JSON.parse(storedLocations))
      }
    }

    loadSavedLocations()
    window.addEventListener('storage', loadSavedLocations)

    return () => {
      window.removeEventListener('storage', loadSavedLocations)
    }
  }, [])

  const handleSelectLocation = (location: SavedLocation) => {
    onSelectLocation(`${location.name},${location.country}`)
  }

  const handleRemoveLocation = (location: SavedLocation) => {
    const updatedLocations = savedLocations.filter(
      (loc) => loc.name !== location.name || loc.country !== location.country
    )
    setSavedLocations(updatedLocations)
    localStorage.setItem('savedLocations', JSON.stringify(updatedLocations))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <MapPin className="mr-2" />
          Saved Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {savedLocations.length > 0 ? (
            <motion.ul className="space-y-2 max-h-48 overflow-y-auto">
              {savedLocations.map((location, index) => (
                <motion.li
                  key={`${location.name}-${location.country}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-sm">{location.name}, {location.country}</h3>
                      <p className="text-xs text-gray-600">Lat: {location.lat.toFixed(2)}, Lon: {location.lon.toFixed(2)}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center">
                          <Sunrise className="h-4 w-4 mr-1 text-orange-500" />
                          <span className="text-xs">{new Date(location.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center">
                          <Sunset className="h-4 w-4 mr-1 text-purple-500" />
                          <span className="text-xs">{new Date(location.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectLocation(location)}
                      >
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveLocation(location)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 text-sm"
            >
              No saved locations yet.
            </motion.p>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

