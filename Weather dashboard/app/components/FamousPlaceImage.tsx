import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type FamousPlaceImageProps = {
  location: string
}

export default function FamousPlaceImage({ location }: FamousPlaceImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true)
      try {
        // In a real app, you'd use an API like Unsplash or Google Places to fetch an image
        // For this example, we'll use a placeholder
        const response = await fetch(`https://source.unsplash.com/400x300/?${encodeURIComponent(location)}+landmark`)
        setImageUrl(response.url)
      } catch (error) {
        console.error('Error fetching image:', error)
      } finally {
        setLoading(false)
      }
    }

    if (location) {
      fetchImage()
    }
  }, [location])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Famous Place in {location}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="w-full h-[300px] rounded-md" />
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Famous place in ${location}`}
            width={400}
            height={300}
            className="w-full h-[300px] object-cover rounded-md"
          />
        ) : (
          <p>No image available</p>
        )}
      </CardContent>
    </Card>
  )
}

