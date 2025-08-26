import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type FoodItem = {
  name: string
  image: string
  description: string
}

type FoodCategory = {
  name: string
  foods: FoodItem[]
}

type WeatherBasedFoodProps = {
  weatherData: {
    main: { temp: number }
    weather: [{ main: string }]
    name: string
    sys: { country: string }
  } | null
}

const WeatherBasedFood: React.FC<WeatherBasedFoodProps> = ({ weatherData }) => {
  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (weatherData) {
      setFoodCategories(getFoodCategories(weatherData.main.temp, weatherData.weather[0].main, weatherData.name, weatherData.sys.country, currentTime))
    }
  }, [weatherData, currentTime])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000) // Update every minute
    return () => clearInterval(timer)
  }, [])

  const getFoodCategories = (temperature: number, weatherCondition: string, location: string, country: string, time: Date): FoodCategory[] => {
    const hour = time.getHours()
    const isHotClimate = ['desert', 'tropical', 'mediterranean'].some(climate => location.toLowerCase().includes(climate))
    const isColdClimate = ['arctic', 'antarctic', 'alpine'].some(climate => location.toLowerCase().includes(climate))

    let categories: FoodCategory[] = []

    // Breakfast (6 AM - 11 AM)
    if (hour >= 6 && hour < 11) {
      categories.push({
        name: 'Breakfast',
        foods: getBreakfastSuggestions(temperature, weatherCondition, location, country)
      })
    }
    // Lunch (11 AM - 4 PM)
    else if (hour >= 11 && hour < 16) {
      categories.push({
        name: 'Lunch',
        foods: getLunchSuggestions(temperature, weatherCondition, location, country)
      })
    }
    // Dinner (4 PM - 11 PM)
    else if (hour >= 16 || hour < 6) {
      categories.push({
        name: 'Dinner',
        foods: getDinnerSuggestions(temperature, weatherCondition, location, country)
      })
    }

    // Add snacks, refreshments, and dairy products for all times
    categories.push({
      name: 'Snacks',
      foods: getSnackSuggestions(temperature, weatherCondition, location, country)
    })

    categories.push({
      name: 'Refreshments',
      foods: getRefreshmentSuggestions(temperature, weatherCondition, location, country)
    })

    categories.push({
      name: 'Dairy',
      foods: getDairySuggestions(temperature, weatherCondition, location, country)
    })

    return categories
  }

  const getBreakfastSuggestions = (temperature: number, weatherCondition: string, location: string, country: string): FoodItem[] => {
    if (temperature > 25) {
      return [
        { name: 'Acai Bowl', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A refreshing and nutritious bowl of acai berry puree topped with fresh fruits and granola.' },
        { name: 'Greek Yogurt Parfait', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Layers of creamy Greek yogurt, fresh berries, and crunchy granola.' },
        { name: 'Avocado Toast', image: 'https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Toasted whole grain bread topped with mashed avocado, cherry tomatoes, and a poached egg.' },
      ]
    } else {
      return [
        { name: 'Oatmeal with Berries', image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Warm and comforting oatmeal topped with a variety of fresh berries and a drizzle of honey.' },
        { name: 'Breakfast Burrito', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Scrambled eggs, black beans, cheese, and salsa wrapped in a warm tortilla.' },
        { name: 'Pancakes with Maple Syrup', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Fluffy pancakes served with butter and warm maple syrup.' },
      ]
    }
  }

  const getLunchSuggestions = (temperature: number, weatherCondition: string, location: string, country: string): FoodItem[] => {
    if (weatherCondition.toLowerCase() === 'clear' || weatherCondition.toLowerCase() === 'sunny') {
      return [
        { name: 'Grilled Chicken Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Fresh mixed greens topped with grilled chicken, cherry tomatoes, cucumber, and balsamic vinaigrette.' },
        { name: 'Caprese Sandwich', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Fresh mozzarella, tomatoes, and basil on a ciabatta roll drizzled with olive oil and balsamic glaze.' },
        { name: 'Poke Bowl', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A Hawaiian-inspired bowl with raw fish, rice, avocado, and various toppings.' },
      ]
    } else {
      return [
        { name: 'Tomato Basil Soup', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A comforting bowl of creamy tomato soup with fresh basil and a grilled cheese sandwich on the side.' },
        { name: 'Beef Stir Fry', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Tender strips of beef stir-fried with colorful vegetables in a savory sauce, served over rice.' },
        { name: 'Vegetable Lasagna', image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Layers of pasta, ricotta cheese, and a medley of roasted vegetables in a rich tomato sauce.' },
      ]
    }
  }

  const getDinnerSuggestions = (temperature: number, weatherCondition: string, location: string, country: string): FoodItem[] => {
    if (temperature < 15) {
      return [
        { name: 'Beef Stew', image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Hearty beef stew with tender chunks of meat, potatoes, carrots, and a rich gravy.' },
        { name: 'Chicken Pot Pie', image: 'https://images.unsplash.com/photo-1612776572997-76cc42e058c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A comforting pie filled with chicken, vegetables, and a creamy sauce, topped with a flaky crust.' },
        { name: 'Mushroom Risotto', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Creamy Arborio rice cooked with mushrooms, white wine, and Parmesan cheese.' },
      ]
    } else {
      return [
        { name: 'Grilled Salmon', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Perfectly grilled salmon fillet served with roasted vegetables and lemon butter sauce.' },
        { name: 'Margherita Pizza', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Classic pizza topped with tomato sauce, fresh mozzarella, basil leaves, and a drizzle of olive oil.' },
        { name: 'Vegetable Curry', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A fragrant and spicy curry with a variety of colorful vegetables, served with basmati rice.' },
      ]
    }
  }

  const getSnackSuggestions = (temperature: number, weatherCondition: string, location: string, country: string): FoodItem[] => {
    return [
      { name: 'Mixed Nuts', image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A healthy mix of almonds, cashews, walnuts, and pistachios.' },
      { name: 'Fruit and Cheese Plate', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A delightful assortment of fresh fruits and artisanal cheeses.' },
      { name: 'Hummus with Veggie Sticks', image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Creamy hummus served with an array of fresh vegetable sticks for dipping.' },
    ]
  }

  const getRefreshmentSuggestions = (temperature: number, weatherCondition: string, location: string, country: string): FoodItem[] => {
    if (temperature > 25) {
      return [
        { name: 'Iced Green Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A refreshing glass of iced green tea, perfect for hot days.' },
        { name: 'Watermelon Smoothie', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A cool and hydrating smoothie made with fresh watermelon and a hint of mint.' },
        { name: 'Coconut Water', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Natural coconut water, rich in electrolytes and incredibly refreshing.' },
      ]
    } else {
      return [
        { name: 'Hot Chocolate', image: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A rich and creamy hot chocolate topped with marshmallows.' },
        { name: 'Spiced Chai Latte', image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A warming blend of black tea and aromatic spices with steamed milk.' },
        { name: 'Mulled Wine', image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A comforting winter beverage made with red wine, citrus fruits, and warming spices.' },
      ]
    }
  }

  const getDairySuggestions = (temperature: number, weatherCondition: string, location: string, country: string): FoodItem[] => {
    return [
      { name: 'Greek Yogurt with Honey', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'Creamy Greek yogurt drizzled with golden honey and topped with nuts.' },
      { name: 'Cheese Board', image: 'https://images.unsplash.com/photo-1543528176-61b239494933?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A selection of fine cheeses served with crackers and fruit preserves.' },
      { name: 'Lassi', image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', description: 'A traditional Indian yogurt-based drink, available in sweet or savory flavors.' },
    ]
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {weatherData ? `Food Suggestions for ${weatherData.name}, ${weatherData.sys.country}` : 'Enter a location for food suggestions'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          <Tabs defaultValue={foodCategories[0]?.name.toLowerCase()}>
            <TabsList>
              {foodCategories.map((category) => (
                <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {foodCategories.map((category) => (
              <TabsContent key={category.name} value={category.name.toLowerCase()}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {category.foods.map((food) => (
                    <Card key={food.name}>
                      <CardContent className="p-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="relative h-48 w-full cursor-pointer rounded-md overflow-hidden">
                              <Image
                                src={food.image}
                                alt={food.name}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-start p-4">
                                <h4 className="text-white text-lg font-semibold">{food.name}</h4>
                              </div>
                            </div>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>{food.name}</DialogTitle>
                            </DialogHeader>
                            <div className="relative h-64 w-full">
                              <Image
                                src={food.image}
                                alt={food.name}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-md"
                              />
                            </div>
                            <p className="mt-4">{food.description}</p>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

export default WeatherBasedFood

