'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { WiSunrise, WiSunset } from 'react-icons/wi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckSquare, Trash2 } from 'lucide-react'

type SidePanelProps = {
 weatherData: {
   main: {
     temp: number
   }
   weather: Array<{
     main: string
     description: string
   }>
   sys: {
     sunrise: number
     sunset: number
   }
 } | null
}

type TodoItem = {
 text: string
 completed: boolean
}

export default function SidePanel({ weatherData }: SidePanelProps) {
 const [todoItem, setTodoItem] = useState('')
 const [todoList, setTodoList] = useState<TodoItem[]>([
   { text: 'Check weather forecast', completed: false },
   { text: 'Pack umbrella', completed: false }
 ])

 const handleAddTodo = (e: React.FormEvent) => {
   e.preventDefault()
   if (todoItem.trim()) {
     setTodoList([...todoList, { text: todoItem.trim(), completed: false }])
     setTodoItem('')
   }
 }

 const toggleTodoCompletion = (index: number) => {
   const newTodoList = [...todoList]
   newTodoList[index].completed = !newTodoList[index].completed
   setTodoList(newTodoList)
 }

 const removeTodoItem = (index: number) => {
   setTodoList(prevList => prevList.filter((_, i) => i !== index))
 }

 const formatTime = (timestamp: number) => {
   return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 }

 return (
   <div className="space-y-6">
     <Card className="w-full">
       <CardHeader>
         <CardTitle>Sunrise & Sunset</CardTitle>
       </CardHeader>
       <CardContent>
         <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
           className="flex justify-between items-center"
         >
           <div className="text-center flex-1">
             <WiSunrise className="text-6xl text-yellow-500 mx-auto" />
             <p className="font-semibold text-lg">Sunrise</p>
             <p className="text-xl">{weatherData ? formatTime(weatherData.sys.sunrise) : 'N/A'}</p>
           </div>
           <div className="text-center flex-1">
             <WiSunset className="text-6xl text-orange-500 mx-auto" />
             <p className="font-semibold text-lg">Sunset</p>
             <p className="text-xl">{weatherData ? formatTime(weatherData.sys.sunset) : 'N/A'}</p>
           </div>
         </motion.div>
       </CardContent>
     </Card>

     <Card>
       <CardHeader>
         <CardTitle className="flex items-center">
           <CheckSquare className="mr-2" />
           Weather-Related Tasks
         </CardTitle>
       </CardHeader>
       <CardContent>
         <form onSubmit={handleAddTodo} className="space-y-4">
           <div className="flex space-x-2">
             <Input
               type="text"
               placeholder="Add a weather-related task"
               value={todoItem}
               onChange={(e) => setTodoItem(e.target.value)}
             />
             <Button type="submit">Add</Button>
           </div>
         </form>
         <motion.ul className="space-y-2 mt-4">
           {todoList.map((item, index) => (
             <motion.li
               key={index}
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
               className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg p-2"
             >
               <Checkbox
                 id={`todo-${index}`}
                 checked={item.completed}
                 onCheckedChange={() => toggleTodoCompletion(index)}
               />
               <label
                 htmlFor={`todo-${index}`}
                 className={`flex-grow text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}
               >
                 {item.text}
               </label>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => removeTodoItem(index)}
                 className="text-red-500 hover:text-red-700"
               >
                 <Trash2 className="h-4 w-4" />
               </Button>
             </motion.li>
           ))}
         </motion.ul>
         {todoList.length === 0 && (
           <p className="text-center text-gray-500 mt-4">No tasks yet. Add some weather-related tasks!</p>
         )}
       </CardContent>
     </Card>
   </div>
 )
}

