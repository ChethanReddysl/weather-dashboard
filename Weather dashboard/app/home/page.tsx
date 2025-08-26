'use client'

import { motion } from 'framer-motion'
import Header from '../components/Header'
import WeatherSearch from '../components/WeatherSearch'
import WeatherDisplay from '../components/WeatherDisplay'
import SidePanel from '../components/SidePanel'
import WeatherAlerts from '../components/WeatherAlerts'
import AirQualityIndex from '../components/AirQualityIndex'
import WeatherHistory from '../components/WeatherHistory'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <WeatherSearch />
            <WeatherAlerts />
          </div>
          <div className="space-y-8">
            <WeatherDisplay />
            <AirQualityIndex />
          </div>
          <div className="space-y-8">
            <SidePanel />
            <WeatherHistory />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

