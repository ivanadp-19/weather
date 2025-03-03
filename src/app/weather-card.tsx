import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface WeatherCardProps {
  city: string
  temperature: number
  condition: string
  onRemove: () => void
}

export default function WeatherCard({ city, temperature, condition, onRemove }: WeatherCardProps) {
  return (
    <Card className="relative">
      <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-8 w-8 p-0" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle>{city}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{temperature}°C</p>
        <p className="text-muted-foreground">{condition}</p>
      </CardContent>
    </Card>
  )
}

